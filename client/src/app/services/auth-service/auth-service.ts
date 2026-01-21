import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url:string = "http://localhost:8000/auth/"
  private tokenSubject = new BehaviorSubject<string|null>(null)
  token$ = this.tokenSubject.asObservable()

  constructor (
    private http: HttpClient
  ){
    const token = localStorage.getItem("jwt_token")
    this.tokenSubject.next(token)
  }

  isLoggedIn(): boolean{
    return this.tokenSubject.value !== null
  }

  login(userdata:User){
    const userdataForm = new FormData()
    userdataForm.append("username", userdata.username)
    userdataForm.append("password", userdata.password)

    return this.http.post<string>(this.url, userdataForm)
      .pipe(
        tap(val => {
          localStorage.setItem("jwt_token", val)
          this.tokenSubject.next(val)
        })
      )
  }

  getJWT(){
    return this.tokenSubject.value
  }
}
