import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { ITask } from '../task';
import { TaskService } from '../task-service/task-service';

@Component({
  selector: 'app-task',
  imports: [],
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
