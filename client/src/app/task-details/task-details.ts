import { Component, computed, HostListener, signal, WritableSignal } from '@angular/core';
import { TaskService } from '../task-service/task-service';
import { ActivatedRoute } from '@angular/router';
import { ITask } from '../task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  imports: [FormsModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails {
  task:WritableSignal<ITask> = signal({title:"", id:-1, finished:false, description:""})
  redacting_mode:WritableSignal<boolean> = signal(false)
  
  description = this.task().description
  title = this.task().title

  constructor (
    private taskService: TaskService,
    private route:ActivatedRoute
  ) {}

  ngOnInit(){
    const taskId:number = Number(this.route.snapshot.params['id'])

    this.taskService.getTaskById(taskId).subscribe(resp => {
      this.task.set(resp)
      this.description = this.task().description
      this.title = this.task().title
    })
  }
  
  updateStatus(){
    const taskData = this.task()
    taskData.finished = !taskData.finished

    this.taskService.updateTask(taskData).subscribe((resp) => {
      this.task.set(taskData)
    })
  }

  @HostListener('window:keydown.control.s', ['$event'])
  saveChanges(event:Event|undefined){
    const is_redacting_mode = this.redacting_mode()
    if (!is_redacting_mode){
      this.redacting_mode.set(!is_redacting_mode)
      return
    }
    if (event !== undefined){
      event.preventDefault()
    }
    if (is_redacting_mode){

      const oldTitle = this.task().title
      const oldDescription = this.task().description
      
      const taskData = {
        ...this.task(),
        description : this.description,
        title : this.title
      }

      this.taskService.updateTask(taskData).subscribe({
        next:() => {
        this.description = this.task().description
        this.title = this.task().title
        this.task.set(taskData)
        },
        error: (err) => {
          this.description = oldDescription
          this.title = oldTitle
        },
      }).add(()=>this.redacting_mode.set(!is_redacting_mode))
    } 
  }

  deleteTask(){
    
  }

}
