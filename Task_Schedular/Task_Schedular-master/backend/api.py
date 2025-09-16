from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
from pathlib import Path
import threading
import schedule
import time
from collections import defaultdict
from deadline_notifier import DeadlineNotifier, smtp_config

app = FastAPI()

# Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TASKS_FILE = Path("tasks_deadlines.xlsx")
TASKS_CACHE: List[dict] = []

class Task(BaseModel):
    id: int
    title: str
    description: str
    deadline: str
    priority: str
    status: str
    assignee: str
    email: str

def load_tasks():
    if TASKS_FILE.exists():
        try:
            df = pd.read_excel(TASKS_FILE)
            if df.empty:
                return []
            # Ensure required columns exist
            expected = {"id", "title", "description", "deadline", "priority", "status", "assignee", "email"}
            if not expected.issubset(df.columns):
                return []
            return df.to_dict(orient="records")
        except Exception:
            return []
    return []

def export_notifier_tasks(tasks):
    """Write a notifier-friendly Excel with columns Task, Assignee, Email, Deadline."""
    try:
        notifier_path = Path("notifier_tasks.xlsx")
        if not tasks:
            df = pd.DataFrame(columns=["Task", "Assignee", "Email", "Deadline"])
        else:
            df = pd.DataFrame([
                {
                    "Task": t.get("title", ""),
                    "Assignee": t.get("assignee", ""),
                    "Email": t.get("email", ""),
                    "Deadline": t.get("deadline", ""),
                }
                for t in tasks
            ])
        df.to_excel(notifier_path, index=False)
    except Exception:
        # Best-effort; do not raise to avoid breaking main API save
        pass

def save_tasks(tasks):
    try:
        if not tasks:  # if empty, write just headers
            df = pd.DataFrame(columns=["id", "title", "description", "deadline", "priority", "status", "assignee", "email"])
        else:
            df = pd.DataFrame(tasks)
        df.to_excel(TASKS_FILE, index=False)
        # update cache after successful write
        global TASKS_CACHE
        TASKS_CACHE = list(tasks)
        # export notifier view
        export_notifier_tasks(TASKS_CACHE)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to save tasks: {exc}")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    # serve from cache; lazy-load if empty
    global TASKS_CACHE
    if not TASKS_CACHE:
        TASKS_CACHE = load_tasks()
    return TASKS_CACHE

@app.post("/tasks", response_model=Task)
def add_task(task: Task):
    global TASKS_CACHE
    if not TASKS_CACHE:
        TASKS_CACHE = load_tasks()
    TASKS_CACHE.append(task.dict())
    save_tasks(TASKS_CACHE)
    return task

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task: Task):
    global TASKS_CACHE
    if not TASKS_CACHE:
        TASKS_CACHE = load_tasks()
    for i, t in enumerate(TASKS_CACHE):
        if t["id"] == task_id:
            TASKS_CACHE[i] = task.dict()
            save_tasks(TASKS_CACHE)
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    global TASKS_CACHE
    if not TASKS_CACHE:
        TASKS_CACHE = load_tasks()
    TASKS_CACHE = [t for t in TASKS_CACHE if t["id"] != task_id]
    save_tasks(TASKS_CACHE)
    return {"message": "Task deleted"}

@app.get("/persons")
def get_persons():
    """Return distinct persons (assignee, email) with task counts."""
    global TASKS_CACHE
    if not TASKS_CACHE:
        TASKS_CACHE = load_tasks()
    counts = defaultdict(int)
    for t in TASKS_CACHE:
        key = (t.get("assignee", ""), t.get("email", ""))
        counts[key] += 1
    return [
        {"assignee": k[0], "email": k[1], "taskCount": v}
        for k, v in counts.items()
        if any(k)  # skip empty
    ]

@app.post("/notify/run")
def trigger_notifications():
    """Run the deadline notifier once using exported notifier_tasks.xlsx."""
    try:
        notifier = DeadlineNotifier("notifier_tasks.xlsx", smtp_config)
        notifier.process_notifications()
        return {"message": "Notifications processed"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to run notifier: {exc}")

def _schedule_daily_notifications():
    notifier = DeadlineNotifier("notifier_tasks.xlsx", smtp_config)
    schedule.every().day.at("09:00").do(notifier.process_notifications)
    while True:
        schedule.run_pending()
        time.sleep(60)

@app.on_event("startup")
def startup_event():
    # fire-and-forget background scheduler
    thread = threading.Thread(target=_schedule_daily_notifications, daemon=True)
    thread.start()
