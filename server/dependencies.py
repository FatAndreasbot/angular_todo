from typing import Annotated, Any
from jwt.exceptions import InvalidTokenError
from fastapi import Depends
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
import sqlite3

from definitions import User

SECRET_KEY = "OemqqLjOQigFi9Kg7dJgx6zTcNTLn9iluOlh7W4sBWirpuyeclrxBTAmdoh8BOQ2TLkvTfWHfGO"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

auth_bearer = OAuth2PasswordBearer(
    tokenUrl="/auth/"
)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_current_user(token: Annotated[str, Depends(auth_bearer)]) -> User:
    credential_exception = HTTPException(
        status_code=HTTP_401_UNAUTHORIZED,
        headers={ "WWW-Authenticate": "Bearer" }
    )

    try:
        payload:dict[str, Any] = jwt.decode(
            jwt=token,
            key=SECRET_KEY,
            algorithms=ALGORITHM
        )
        user_id = payload.get('user_id')
        if user_id is None:
            raise credential_exception
    except InvalidTokenError as e:
        print(e)
        raise credential_exception

    with sqlite3.connect("tasks.db") as con:
        sql = f'''
        select 
            id,
            username, 
            password 
        from users u where u.id={user_id}
        '''
        con.row_factory = dict_factory

        cur = con.cursor()
        res = cur.execute(sql)

    userdata = res.fetchone()
    if userdata is None:
        raise credential_exception

    user = User(**userdata)
    return user

