import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITask } from '../../interfaces/task'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private url: string = "http://localhost:8000"
  
  constructor (
    private http: HttpClient
  ) { }

  getAllTasks():Observable<ITask[]>{
    return this.http.get<ITask[]>(this.url)
  }

  getTaskById(id:number):Observable<ITask>{
    const urlWithParams = new URL(this.url)
    urlWithParams.searchParams.append("id", String(id))

    const resp = this.http.get<ITask>(urlWithParams.href)
    return resp
  }

  updateTask(taskData:ITask){
    return this.http.put(
      this.url,
      taskData
    )
  }
}
