export interface User{
    _id:string 
    username:string
    email:string
    image:string
    isBlocked:boolean 
    result:[]
}

export interface UserRequestI{
    _id:string
    receiver:string,
    sender:{
        _id: string;
        username: string;
        email: string;
        password: string;
        isVerified: boolean;
        image: string;
        isBlocked: boolean;
        isAdmin: boolean;
        isGoogle: boolean;
    }
}