import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { ITask } from '../task';
import { TaskService } from '../task-service/task-service';
import { IFilter } from '../filter';
import { Task } from '../task/task';

@Component({
  selector: 'app-all-tasks',
  imports:[Task],
  templateUrl: './all-tasks.html',
  styleUrl: './all-tasks.css',
})
export class AllTasks implements OnInit {
  private tasks: WritableSignal<ITask[]> = signal([])
  
  statusFilter: IFilter[] = [{
    name: "Not selected",
    func: () => true
  }, {
    name: "Finished",
    func: (e) => e.finished
  }, {
    name: "Ongoing",
    func: (e) => !e.finished
  }]
  
  selectedFilter: WritableSignal<IFilter> = signal(this.statusFilter[0]);

  getTasks = computed(() => {
    const f = this.selectedFilter()
    const tasksToShow = this.tasks().filter(f.func)

    return tasksToShow ? tasksToShow : []
  })


  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.taskService.getAllTasks().subscribe((resp) => {
      this.tasks.set(resp)
    })
  }

  updateStatusFilter(f: string) {
    const filter = this.statusFilter.find(
      (e) => e.name === f
    )
    if (filter)
      this.selectedFilter.set(filter)
  }

  updateTask(taskId:number, status:boolean){
    this.tasks.update(tasks => 
      tasks.map(task => {
        if (task.id !== taskId) return task
        task.finished = status
        return task
      })
    )
  }
}
