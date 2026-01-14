import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private url: string = "http://localhost:8000"
  
  constructor (
    private http: HttpClient
  ) { }

  getAllTasks():Observable<Task[]>{
    return this.http.get<Task[]>(this.url)
  }

  getTaskById(id:number):Observable<Task>{
    const urlWithParams = new URL(this.url)
    urlWithParams.searchParams.append("id", String(id))

    const resp = this.http.get<Task>(urlWithParams.href)
    return resp
  }
}
