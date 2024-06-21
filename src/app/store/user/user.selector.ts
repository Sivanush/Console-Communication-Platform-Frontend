import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userState } from "./user.reducer";



export const selectUserState = createFeatureSelector<userState>('user')



export const selectAllUsers = createSelector(
    selectUserState,
    (state:userState)=>state.users
)

export const selectUsersLoading = createSelector(
    selectUserState,
    (state:userState)=>state.loading
)

export const selectUsersError = createSelector(
    selectUserState,
    (state:userState)=>state.error
)