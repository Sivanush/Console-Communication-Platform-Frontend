export interface directChatI extends Document{
    thumbnailUrl: string;
    _id: string;
    senderId: {
      _id: string;
      username: string;
      email: string;
      password: string;
      isVerified: boolean;
      image: string;
      isBlocked: boolean;
      isAdmin: boolean;
      isGoogle: boolean;
      __v: number;
    };
    receiverId: {
      _id: string;
      username: string;
      email: string;
      password: string;
      isVerified: boolean;
      image: string;
      isBlocked: boolean;
      isAdmin: boolean;
      isGoogle: boolean;
      __v: number;
    };
    message: string;
    imageUrl:string
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    isNewGroup: boolean;
}

export interface UserStatus {
  userId: string;
  isOnline: boolean;
}