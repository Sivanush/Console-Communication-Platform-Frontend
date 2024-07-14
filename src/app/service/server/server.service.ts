import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { IAllServer } from '../../interface/server/getAllServer';
import { Subject } from 'rxjs';
import { IServer } from '../../interface/server/serverDetails';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private apiLink = environment.apiUrl

  constructor(private http:HttpClient) { }

  private serverUpdateSource = new Subject<void>();

  serverUpdate$ = this.serverUpdateSource.asObservable()


  createServer(serverName:string,image:File|null){
    const formData = new FormData()
    formData.append('serverName',serverName)
    if (image) {
      formData.append('image',image)
    }
    return this.http.post<{message:string}>(`${this.apiLink}/create-server`,formData)
  }

  getAllServers(){
    return this.http.get<IAllServer[]>(`${this.apiLink}/servers`)
  }


  triggerServerUpdate(){
    this.serverUpdateSource.next()
  }

  getServerDetails(serverId:string){
    return this.http.get<IServer>(`${this.apiLink}/server-detail/${serverId}`,)
  }

}
