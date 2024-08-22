import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { UserI } from '../../../interface/server/channelChat';
import { User } from '../../../interface/user/user.model';
import { RouterModule } from '@angular/router';
import { ServerService } from '../../../service/server/server.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user!: User;
  isOwnProfile: boolean = true;
  activeTab: string = 'posts';
  newPost: string = '';
  posts: any[] = [];
  friends: any[] = [];
  servers: any[] = [];
  userId!:string|null

  constructor(private userService:UserService,private serverService:ServerService) { }



  async ngOnInit(): Promise<void> {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.user = data
      }
    })
  

    this.userService.getAllFriends().subscribe({
      next: (data) => {
        this.friends = data.friends
        console.log(this.friends);
        
      }
    })

    this.userId = await this.userService.getUserId()
    

    this.serverService.getAllServers().subscribe({
      next: (data) => {
        this.servers = data
      }
    })

  //   this.posts = [
  //     {
  //       authorName: 'John Doe',
  //       authorHandle: 'johndoe',
  //       authorAvatar: 'https://placehold.co/1000x1000/000000/FFF',
  //       content: 'This is a sample post!',
  //       timestamp: '2h ago',
  //       comments: 5,
  //       reposts: 2,
  //       likes: 10
  //     }
  //     // Add more sample posts here
  //   ];





  //   // Initialize sample friends
    

    // Initialize sample servers
    this.servers = [
      { name: 'Gaming Hub', memberCount: 1000, iconUrl: 'https://placehold.co/1000x1000/000000/FFF' },
      { name: 'Movie Buffs', memberCount: 500, iconUrl: 'https://placehold.co/1000x1000/000000/FFF' }
      // Add more sample servers here
    ];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  submitPost(): void {
    if (this.newPost.trim()) {
      const post = {
        authorName: this.user.username,
        // authorHandle: this.user.handle,
        // authorAvatar: this.user.avatarUrl,
        content: this.newPost,
        timestamp: 'Just now',
        comments: 0,
        reposts: 0,
        likes: 0
      };
      this.posts.unshift(post);
      this.newPost = '';
    }
  }
}