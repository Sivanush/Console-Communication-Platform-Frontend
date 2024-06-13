import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { inject } from '@angular/core';

export const userNotAuthGuard: CanActivateFn = (route, state) => {
  
  const userService = inject(UserService)
  const router = inject(Router)
  if (userService.isAuthenticated()) {
    router.navigate(['/']); 
    return false; 
  } else {
    return true; 
  }
 
};
