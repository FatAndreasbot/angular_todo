import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/auth-service/auth-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  
  const token = authService.getJWT()
  if (token === null){
    // TODO add redirection logic
    return next(req)
  }

  const newReq = req.clone({
    headers: req.headers.append("Authorization", `Bearer ${token}`)
  })
  

  return next(newReq);
};
