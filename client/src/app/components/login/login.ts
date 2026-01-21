import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth-service';
import { User } from '../../interfaces/user';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userData:User = {username:"", password:""}

  constructor(
    private authService:AuthService,
    private router:Router
  ) { }

  LogIn(){
    this.authService.logIn(this.userData).subscribe({
      complete: () => {
        this.router.navigate([""])
      },
      error: (err:HttpErrorResponse) => {
        alert(err.status)
      }
    })
  }
}
