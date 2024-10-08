export interface IChannel {
    _id: string;
    name: string;
    type: 'text' | 'voice' | 'video'; 
    server: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ICategory {
    _id: string;
    name: string;
    server: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    channels: IChannel[];
}


export interface IServer {
    _id: string;
    name: string;
    image: string;
    owner: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    role: string[];
    channelId: string;
    categories: ICategory[];
}
