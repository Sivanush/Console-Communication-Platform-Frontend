export interface ICategory{
    name: string;
    server: string;
    createdAt: Date;
    _id:string
    channels: {
        _id: string;
        name: string;
        type: 'text' | 'voice' | 'video';
      }[];
}