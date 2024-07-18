import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserService } from '../user/user.service';



export const UserAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const userService = inject(UserService);
  const router = inject(Router)

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(cloned).pipe(
      catchError((error:HttpErrorResponse)=>{
        if (error.status === 401) {
          localStorage.removeItem('token')
          userService.logout();
        }
        return throwError(()=>error)
      })
    )
  } else {
    return next(req);
  }
};