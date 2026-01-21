import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Todo app';
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  isLoggedIn(){
    return this.authService.isLoggedIn()
  }

  logOut(){
    this.authService.logOut()
    this.router.navigate(["login/"])
  }
}
