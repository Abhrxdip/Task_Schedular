from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
from pathlib import Path

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

def load_tasks():
    if TASKS_FILE.exists():
        try:
            df = pd.read_excel(TASKS_FILE)
            if df.empty:
                return []
            # Ensure required columns exist
            expected = {"id", "title", "description", "deadline", "priority", "status"}
            if not expected.issubset(df.columns):
                return []
            return df.to_dict(orient="records")
        except Exception:
            return []
    return []

def save_tasks(tasks):
    try:
        if not tasks:  # if empty, write just headers
            df = pd.DataFrame(columns=["id", "title", "description", "deadline", "priority", "status"])
        else:
            df = pd.DataFrame(tasks)
        df.to_excel(TASKS_FILE, index=False)
        # update cache after successful write
        global TASKS_CACHE
        TASKS_CACHE = list(tasks)
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
