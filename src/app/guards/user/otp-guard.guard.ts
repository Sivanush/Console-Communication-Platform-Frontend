import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const otpGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)  
  const otpToken = localStorage.getItem('otpToken')
  if (otpToken) {
    return true
  }else{
    router.navigate(['/login']);
      return false;
  }
  
  


};
