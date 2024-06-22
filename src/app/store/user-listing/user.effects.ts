import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../service/user/user.service";
import { loadUser, loadUserFailed, loadUserSuccess } from "./user.action";
import { catchError, delay, map, mergeMap, of, tap } from "rxjs";
import { AdminService } from "../../service/admin/admin.service";




@Injectable()
export class userEffects{
    constructor(private actions$:Actions,private adminService:AdminService) {}

    loadUser$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(loadUser),
            mergeMap(()=>{
                return this.adminService.getUser().pipe(
                    // delay(),
                    // tap((data:any)=>console.log(data)),
                    map(users => loadUserSuccess({user:users.result})),
                    catchError(error => of(loadUserFailed({ error })))
                );
            })
        )
    })
}