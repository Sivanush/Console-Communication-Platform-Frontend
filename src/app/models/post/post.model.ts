

export interface PostI {
    _id: string,
    content: string,
    author: UserPostI,
    mediaUrl:string,
    mediaType:string
    likes: number,
    comments: number,
    timestamp:Date
}

interface UserPostI {
    _id: string
    customStatus: string
    status: string
    username: string
    bio: string
    email: string
    image: string
}