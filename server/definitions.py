from pydantic import BaseModel

class NewTask(BaseModel):
    title:str
    description:str|None

class Task(NewTask):
    id: int|None
    finished:bool
