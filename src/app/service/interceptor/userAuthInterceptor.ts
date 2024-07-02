import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';



export const UserAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router)

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(cloned).pipe(
      catchError((error:HttpErrorResponse)=>{
        if (error.status === 401) {
          localStorage.removeItem('token')
          router.navigate((['/login']))
        }
        return throwError(()=>error)
      })
    )
  } else {
    return next(req);
  }
};