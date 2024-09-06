// export interface IAllServer {
//     server?: {
//       _id: string;
//       name: string;
//       image?: string;
//     },
//     roles:string[]
//   }


export interface IServer {
channelId?: string;
  _id?: string;
  name?: string;
  image?: string;
}

export interface IAllServer {
  server: IServer;
  roles: string[];
}
