import { createAction, props } from "@ngrx/store";
import { User } from "../../interface/user/user.model";


export const loadUser = createAction('[user] load users')
export const loadUserSuccess = createAction('[user] load users success',props<{user:User[]}>())
export const loadUserFailed = createAction('[user] load users failed',props<{error:unknown}>())