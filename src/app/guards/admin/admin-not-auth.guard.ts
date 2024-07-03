import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../../service/admin/admin.service';
import { inject } from '@angular/core';

export const adminNotAuthGuard: CanActivateFn = (route, state) => {
  
  
  const adminService = inject(AdminService)
  const router = inject(Router)
  if (adminService.isAuthenticated()) {
    router.navigate(['/admin/dashboard']); 
    return false; 
  } else {
    return true; 
  }
};
