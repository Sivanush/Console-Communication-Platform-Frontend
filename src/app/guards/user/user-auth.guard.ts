import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { UserService } from '../../service/user/user.service';

export const userAuthGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService)
  const router = inject(Router)
  if (userService.isAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false; 
  }
}
