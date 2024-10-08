import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { commentI, PostI } from '../../models/post/post.model';
import { S3 } from 'aws-sdk';
import { awsCredentials } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiLink = environment.apiUrl
  private s3: S3;
  constructor(private http:HttpClient) {
    this.s3 =  new S3({
      accessKeyId: awsCredentials.accessKey,
      secretAccessKey: awsCredentials.secretKey,
      region: 'ap-south-1',
    });
   }

  async uploadToAWS(file: File){
    const fileName = file.name;
    const params = {
      Bucket: 'discord-bucket-7',
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    return this.s3.upload(params).promise().then((data) => {
      return data.Location;
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
