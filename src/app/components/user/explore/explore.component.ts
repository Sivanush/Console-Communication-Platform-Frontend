import { Component, Input } from '@angular/core';
import { FriendsSidebarComponent } from "../shared/friends-sidebar/friends-sidebar.component";
import { FriendsHeaderComponent } from "../shared/friends-header/friends-header.component";
import { PostService } from '../../../service/post-service/post.service';
import { PostI } from '../../../models/post/post.model';
import { CommonModule } from '@angular/common';
import { AutoPlayPostDirective } from '../../../directive/auto-play-post/auto-play-post.directive';
import { VideoPlayerComponent } from "../shared/video-player/video-player.component";
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../service/toster/toster-service.service';
import { CommentDialogComponent } from "../shared/comment-dialog/comment-dialog.component";
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user/user.model';
import { RouterLink } from '@angular/router';
import { CreateServerComponent } from "../shared/create-server/create-server.component";
import { Subscription } from 'rxjs';
import { ToggleCreateServerService } from '../../../service/toggleCreateServer/toggle-create-server.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [FriendsSidebarComponent, FriendsHeaderComponent, CommonModule, AutoPlayPostDirective, VideoPlayerComponent, FormsModule, CommentDialogComponent, RouterLink, CreateServerComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent {
  openPostId: string | null = null;
  posts: PostI[] = [];
  isLoading: boolean = false;
  showCommentDialog = false;
  createServerVisible:boolean = false
  suggestions:User[] = []
  private subscription!: Subscription
  constructor(private postService: PostService,private toaster:ToastService,private userService:UserService,private toggleCreateServerService:ToggleCreateServerService) {}


  ngOnInit(): void {
    this.loadPosts();

    this.subscription = this.toggleCreateServerService.booleanValue$.subscribe({
      next: (value) => {
        this.createServerVisible = value 
        
      },
      error:(err)=> console.log(err)
    })

    // this.stories  = [
      
    //     {
    //       "authorName": "GameMaster42",
    //       "authorImage": "https://i.pravatar.cc/150?img=1"
    //     },
    //     {
    //       "authorName": "CosplayQueen",
    //       "authorImage": "https://i.pravatar.cc/150?img=5"
    //     },
    //     {
    //       "authorName": "MusicProducer99",
    //       "authorImage": "https://i.pravatar.cc/150?img=8"
    //     },
    //     {
    //       "authorName": "SpeedyGonzales",
    //       "authorImage": "https://i.pravatar.cc/150?img=12"
    //     },
    //     {
    //       "authorName": "DiamondWarrior",
    //       "authorImage": "https://i.pravatar.cc/150?img=15"
    //     }
    //   ]


      this.getSuggestionUsers()


  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe() 
    }
  }
  loadPosts(): void {
    this.isLoading = true;
    this.postService.getExplorePosts().subscribe({
      next: (data) => {
        this.posts = data;
        console.log(data);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.isLoading = false;
      }
    });
  }



  toggleComments(postId: string) {
    if (this.openPostId === postId) {
      this.openPostId = null; // Close if already open
    } else {
      this.openPostId = postId; // Open the selected post
    }
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

  getSuggestionUsers(){
    this.userService.getRandomUsers().subscribe({
      next: (data) => {
        console.log(data);
        
        this.suggestions = data
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }


  openCommentDialog() {
    this.showCommentDialog = true;
  }

  closeCommentDialog() {
    this.showCommentDialog = false;
  }


  updateUserStatus(userId:string,status:string){
    const userIndex = this.suggestions.findIndex(user => user._id == userId)
    if (userIndex !== -1) {
      this.suggestions[userIndex].friendshipStatus = status
    }
  }

  sendFriendRequest(userId:string){
    this.userService.sendFriendRequest(userId).subscribe({
      next: (response) => {
        console.log(response);
        this.updateUserStatus(userId,'Sended')
        this.toaster.showSuccess('Success',response.message)
      },
      error:(err)=>{
        console.log(err);
        this.toaster.showError('Error',err.error.error)
      }
    })
  }

}
