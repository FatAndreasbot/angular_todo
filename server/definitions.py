from pydantic import BaseModel

class NewTask(BaseModel):
    title:str
    description:str|None

class Task(NewTask):
    id: int|None
    finished:bool

class Token(BaseModel):
    access_token:str
    token_type:str

class User(BaseModel):
    id:int
    username:str
    password:str