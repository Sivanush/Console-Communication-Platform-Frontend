import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';

export const directChatGuard: CanActivateFn = async(route, state) => {
  const userService = inject(UserService)
  const router = inject(Router)
  const tokenUserId = await userService.getUserId();
  const userId = route.params['userId'];
  const friendsId = route.params['friendsId'];
  if(tokenUserId !== userId){
    router.navigate([''])
    return false
  }else if(userId === friendsId){
    router.navigate([''])
    return false
  }else{
    return true;
  }
};
