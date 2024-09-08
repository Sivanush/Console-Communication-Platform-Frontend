export interface currentGroupI{
    date : string,
    messages : string[]
}

export interface UserI {
    _id: string;
    username: string;
    image: string;
  }
  
  export interface MessageI {
  thumbnailUrl: string;
    fileType: File;
    _id: string;
    sender: UserI;
    message: string;
    createdAt: string;
    updatedAt: string;
    grouped?: boolean | null;
  }
  
  export interface MessageGroupI {
    date: string;
    messages: MessageI[];
  }