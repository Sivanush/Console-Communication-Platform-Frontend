import { createReducer, on } from "@ngrx/store";
import { User } from "../../interface/user/user.model";
import { loadUser, loadUserFailed, loadUserSuccess } from "./user.action";

export interface userState{
    loading: boolean
    error: unknown,
    users: User[]
}

export const initial:userState = {
    loading: false,
    error: null,
    users: []
}

export const userReducer = createReducer(
    initial,
    on(loadUser,state=>({...state,loading:true})),
    on(loadUserSuccess,(state,{user})=>({...state,loading:false,users:user})),
    on(loadUserFailed,(state,{error})=>({...state,loading:false,error})),

)