import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { inject } from '@angular/core';

export const profileCheckGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService)
  const router = inject(Router)
  const tokenUserId = await userService.getUserId();
  const userId = route.params['userId'];
  if(tokenUserId === userId){
    router.navigate(['/profile'])
    return false
  }else{
    return true
  }
};
