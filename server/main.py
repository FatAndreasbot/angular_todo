from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.exceptions import HTTPException
import sqlite3
from typing import Annotated, Any
from starlette.status import HTTP_401_UNAUTHORIZED
import jwt
from datetime import datetime, timedelta

from definitions import NewTask, Task, Token, User
from dependencies import get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM

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
def get_tasks(user:Annotated[User, Depends(get_current_user)], id:int|None=None) -> list[Task]|Task:
    with sqlite3.connect("tasks.db") as con:
        sql = f'''select id, title, description, finished from tasks
        where user_id={user.id}
        {f"and id={id}" if id is not None else ""}
        ;'''
        con.row_factory = dict_factory

        cur = con.cursor()
        res = cur.execute(sql)

    taskdata = [Task(**r) for r in res.fetchall()] if id is None else Task(**res.fetchone())

    return taskdata

@app.post("/")
def post_task(user:Annotated[User, Depends(get_current_user)], task:NewTask):
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
def put_task(user:Annotated[User, Depends(get_current_user)], task:Task):
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
def delete_task(user:Annotated[User, Depends(get_current_user)], task_id:int):
    with sqlite3.connect("tasks.db") as con:
        sql = f'''
            delete from tasks where id={task_id}
        '''
        cur = con.cursor()
        cur.execute(sql)
        con.commit()

    return {"msg":"task deleted"}

@app.post("/auth/")
def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    username = form_data.username
    password = form_data.password

    exp = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    with sqlite3.connect("tasks.db") as con:
        sql = f'''
        select 
            id as user_id
        from 
            users u 
        where 
            u.username='{username}'
            and u.password='{password}'
        '''
        con.row_factory = dict_factory

        cur = con.cursor()
        res = cur.execute(sql)

    tokendata:dict[str, Any]|None = res.fetchone()
    if tokendata is None:
        raise HTTPException(
            HTTP_401_UNAUTHORIZED
        )
    tokendata["exp"] = exp
    token = jwt.encode(
        payload=tokendata,
        key=SECRET_KEY,
        algorithm=ALGORITHM
    ) 
    
    return {"access_token":token,"token_type":"bearer"}