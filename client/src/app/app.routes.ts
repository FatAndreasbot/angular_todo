import { Routes } from '@angular/router';
import { AllTasks } from './components/all-tasks/all-tasks';
import { TaskDetails } from './components/task-details/task-details'; 

export const routes: Routes = [
    {
        path:'',
        title:'All tasks',
        component: AllTasks
    },
    {
        path:'task/:id',
        title:'details',
        component:TaskDetails
    }
];
