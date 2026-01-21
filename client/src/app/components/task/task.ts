import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { ITask } from '../../interfaces/task'; 
import { TaskService } from '../../services/task-service/task-service'; 
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-task',
  imports: [RouterLink],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  @Input({required: true}) data!:ITask
  @Output() FinishedChange = new EventEmitter<boolean>

  Title():string{ return this.data.title }
  Finished:WritableSignal<boolean> = signal(false)
  Description():string {return this.data.description?this.data.description:""}

  constructor( 
    private taskService: TaskService
  ){ }

  ngOnInit(){
    this.Finished.set(this.data.finished)
  }

  UpdateStatus(event:Event){
    const isFinished = (event.target as HTMLInputElement).checked;

    const taskData = this.data
    taskData.finished = isFinished

    this.taskService.updateTask(taskData).subscribe(resp =>{
      this.Finished.set(isFinished)
      this.FinishedChange.emit(isFinished)  
    })    
  }

}
