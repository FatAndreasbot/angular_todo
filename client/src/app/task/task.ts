import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { ITask } from '../task';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  @Input({required: true}) data!:ITask
  @Output() FinishedChange = new EventEmitter<boolean>
  constructor( ){ }

  Title():string{ return this.data.title }

  Finished:WritableSignal<boolean> = signal(false)
  Description():string {return this.data.description?this.data.description:""}

  ngOnInit(){
    this.Finished.set(this.data.finished)
  }

  UpdateStatus(event:Event){
    const isFinished = (event.target as HTMLInputElement).checked;
    console.log(isFinished)
    this.Finished.set(isFinished)
    this.FinishedChange.emit(isFinished)
  }

}
