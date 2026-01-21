import { Routes } from '@angular/router';
import { AllTasks } from './components/all-tasks/all-tasks';
import { TaskDetails } from './components/task-details/task-details'; 
import { Login } from './components/login/login';

export const routes: Routes = [
    {
        path:'',
        title:'All tasks',
        component: AllTasks
    },
    {
        path:'task/:id',
        title:'Details',
        component:TaskDetails
    },
    {
        path:'login',
        title:'Login',
        component:Login
    }
];
