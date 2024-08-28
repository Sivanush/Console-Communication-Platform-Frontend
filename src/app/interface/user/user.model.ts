export interface User{
    banner: string
    customStatus:string
    status:string
    friendshipStatus: string
    _id:string 
    username:string
    bio:string
    email:string
    image:string
    isBlocked:boolean 
    result:[],
    _doc: UserDoc,
    createdAt:Date
}


interface UserDoc {
    _id: string;
    username: string;
    email: string;
    image: string;
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