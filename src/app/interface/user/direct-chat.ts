export interface directChatI extends Document{
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
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface UserStatus {
  userId: string;
  isOnline: boolean;
}