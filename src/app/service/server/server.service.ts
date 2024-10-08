import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAllServer } from '../../interface/server/getAllServer';
import { map, Observable, Subject } from 'rxjs';
import { IChannel, IServer } from '../../interface/server/serverDetails';
import { ICategory } from '../../interface/server/categories';
import { User } from '../../interface/user/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private apiLink = environment.apiUrl

  constructor(private http: HttpClient) { }

  private serverUpdateSource = new Subject<void>();

  serverUpdate$ = this.serverUpdateSource.asObservable()


  createServer(serverName: string, image: File | null) {
    const formData = new FormData()
    formData.append('serverName', serverName)
    if (image) {
      formData.append('image', image)
    }
    return this.http.post<{ message: string }>(`${this.apiLink}/create-server`, formData)
  }

  getAllServers() {
    return this.http.get<IServer[]>(`${this.apiLink}/servers`)
  }

  getAllUserForServer(serverId: string) {
    return this.http.get<{ user: User }[]>(`${this.apiLink}/servers/${serverId}`)
    .pipe(map((data: { user: User }[]) => data.map(item => item.user)));
  }
  

  findAdminForServer(userId: string, serverId: string) {
    return this.http.get(`${this.apiLink}/servers/admin/${serverId}/${userId}`)
  }




  triggerServerUpdate() {
    this.serverUpdateSource.next()
  }

  getServerDetails(serverId: string) {
    return this.http.get<IServer>(`${this.apiLink}/server-detail/${serverId}`,)
  }

  generateInviteLink(serverId: string) {
    return this.http.post<{ inviteCode: string, expireDate: string }>(`${this.apiLink}/generate-invite-code`, { serverId })
  }

  joinServer(inviteCode: string, userId: string) {
    return this.http.post<{ serverData: string }>(`${this.apiLink}/join-server`, { inviteCode, userId })
  }

  getInviteDetails(inviteCode: string) {
    return this.http.get<{ serverDetail: { serverId: IServer }, memberCount: number }>(`${this.apiLink}/server-detail-by-invite/${inviteCode}`);
  }

  createCategory(serverId: string, name: string) {
    return this.http.post<{ message: string, category: ICategory }>(`${this.apiLink}/create-category`, { name, serverId })
  }

  getCategoriesUnderServer(serverId: string) {
    return this.http.get<{ categories: ICategory[] }>(`${this.apiLink}/server-category/${serverId}`)
  }

  createChannel(name: string, type: string, categoryId: string) {
    return this.http.post<{ message: string, channel: IChannel }>(`${this.apiLink}/create-channel`, { name, type, categoryId })
  }

  getChannelDetail(channelId: string) {
    return this.http.get<{ message: string, channelDetail: IChannel }>(`${this.apiLink}/channel-detail/${channelId}`)
  }

  kickUserById(userId: string,serverId:string) {
    return this.http.get(`${this.apiLink}/servers/kick/${serverId}/${userId}`)
  }
}
