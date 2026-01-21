import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/auth-service/auth-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  
  if (!authService.isLoggedIn()){
    const path = router.url
    console.log(path)
    if (path !== '/login'){
      router.navigate(['login/'])
      return EMPTY
    }
    return next(req)
  }

  const token = authService.getJWT()

  const newReq = req.clone({
    headers: req.headers.append("Authorization", `Bearer ${token}`)
  })
  

  return next(newReq);
};
