from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

from definitions import NewTask, Task

app = FastAPI()

origins = [
    "http://localhost:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@app.get("/")
def get_tasks(id:int|None=None) -> list[Task]|Task:
    with sqlite3.connect("tasks.db") as con:
        sql = f'''select id, title, description, finished from tasks
        {f"where id={id}" if id is not None else ""}
        ;'''
        con.row_factory = dict_factory

        cur = con.cursor()
        res = cur.execute(sql)

    taskdata = [Task(**r) for r in res.fetchall()] if id is None else Task(**res.fetchone())

    return taskdata


@app.post("/")
def post_task(task:NewTask):
    with sqlite3.connect("tasks.db") as con:
        sql = f'''
            insert into tasks (title, description) values
            ("{task.title}", "{task.description if task.description is not None else "NULL"}")
        '''
        cur = con.cursor()
        cur.execute(sql)
        con.commit()

        new_row_id = cur.lastrowid

    saved_task = Task(
        id=new_row_id,
        **task.model_dump(),
        finished=False
    )

    return saved_task

@app.put("/")
def put_task(task:Task):
    with sqlite3.connect("tasks.db") as con:
        sql = f'''
            update tasks set
                title="{task.title}",
                description="{task.description if task.description is not None else "NULL"}",
                finished={task.finished}
            where id={task.id}
        '''
        cur = con.cursor()
        cur.execute(sql)
        con.commit()

    return {"msg":"ok"}

@app.delete("/")
def delete_task(task_id:int):
    with sqlite3.connect("tasks.db") as con:
        sql = f'''
            delete from tasks where id={task_id}
        '''
        cur = con.cursor()
        cur.execute(sql)
        con.commit()

    return {"msg":"task deleted"}
