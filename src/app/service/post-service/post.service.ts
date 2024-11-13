import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { commentI, PostI } from '../../models/post/post.model';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiLink = environment.apiUrl
  
  private cloudName = environment.CLOUDINARY_CLOUD_NAME
  private uploadPreset = environment.CLOUDINARY_UPLOADPRESET

  constructor(private http:HttpClient) {
   }

  async uploadToAWS(file: File): Promise<string> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
  
      const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/${file.type.startsWith('image/') ? 'image' : 'video'}/upload`;
  
      return this.http.post<{ url: string }>(uploadUrl, formData)
        .toPromise()
        .then(response => response!.url)
        .catch(error => {
          console.error('Upload error:', error);
          throw new Error("Failed to upload file");
        });
    }




  createPost(content:string,type:string,mediaUrl?:string):Observable<PostI>{
    if (mediaUrl) {
      return this.http.post<PostI>(`${this.apiLink}/create-post`,{content,type,mediaUrl})
    }else{
      return this.http.post<PostI>(`${this.apiLink}/create-post`,{content,type})
    }
  }

  getUserPost(userId:string):Observable<PostI[]>{
    return this.http.get<PostI[]>(`${this.apiLink}/user-post/${userId}`)
  }

  getExplorePosts():Observable<PostI[]>{
    return this.http.get<PostI[]>(`${this.apiLink}/explore-post`)
  }

  likeAndUnlikePost(postId:string){
    return this.http.get(`${this.apiLink}/like-post/${postId}`)
  }

  commentOnPost(postId:string,comment:string){
    return this.http.post(`${this.apiLink}/comment-post/${postId}`,{comment})
  }

  getCommentsForThePost(postId:string){
    return this.http.get<{comments:commentI[]}>(`${this.apiLink}/comments/${postId}`)
  }
}
