import { Component } from '@angular/core';
import { UserService } from '../../../service/user/user.service';
import { ServerService } from '../../../service/server/server.service';
import { PostService } from '../../../service/post-service/post.service';
import { ToastService } from '../../../service/toster/toster-service.service';
import { CommonModule, Location } from '@angular/common';
import { User } from '../../../interface/user/user.model';
import { PostI } from '../../../models/post/post.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; 
import { Subscription } from 'rxjs';
import { AutoPlayPostDirective } from '../../../directive/auto-play-post/auto-play-post.directive';



@Component({
  selector: 'app-users-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,AutoPlayPostDirective],
  templateUrl: './users-profile.component.html',
  styleUrl: './users-profile.component.scss'
})
export class UsersProfileComponent {


  user!: User;
  userId!:string
  posts!:PostI[]
  subscription!:Subscription

  constructor(
    private userService: UserService,
    private serverService: ServerService,
    private postService: PostService,
    private toaster: ToastService,
    private location: Location,
    private route:ActivatedRoute
  ) {

  }

  ngOnInit() {

    this.subscription = this.route.params.subscribe(params => {
      this.userId = params['userId']
      if (this.userId) {
        this.getUserData()
        this.getUserPost()
      }
    })


   
  }



  goBack() {
    this.location.back()
  }

  getUserData(){
    this.userService.getUserDataForFriend(this.userId).subscribe({
      next: (data) => {
        this.user = data
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }


  getUserPost(){
    this.postService.getUserPost(this.userId).subscribe({
      next: (data) => {
        this.posts = data
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }



  likeAndUnlikePost(postId: string) {
    this.postService.likeAndUnlikePost(postId).subscribe({
      next: (response) => {
        const post = this.posts.find(p => p._id === postId);
        if (post) {
          if (post.isLiked) {
            post.likeCount--;
            post.isLiked = false;
          } else {
            post.likeCount++;
            post.isLiked = true;
          }
        }
        console.log(response);
      },
      error: (err) => {
        this.toaster.showError('Something went wrong, Try again');
      }
    })
  }

}
