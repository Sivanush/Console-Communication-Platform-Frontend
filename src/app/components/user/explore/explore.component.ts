import { Component } from '@angular/core';
import { FriendsSidebarComponent } from "../shared/friends-sidebar/friends-sidebar.component";
import { FriendsHeaderComponent } from "../shared/friends-header/friends-header.component";
import { PostService } from '../../../service/post-service/post.service';
import { PostI } from '../../../models/post/post.model';
import { CommonModule } from '@angular/common';
import { AutoPlayPostDirective } from '../../../directive/auto-play-post/auto-play-post.directive';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [FriendsSidebarComponent, FriendsHeaderComponent,CommonModule,AutoPlayPostDirective],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss'
})
export class ExploreComponent {
  posts: any[] = [];
  isLoading: boolean = false;
  stories:any
  suggestions:any
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();

    // setTimeout(() => {
    //   this.posts = [
    //     {
    //       id: '1',
    //       content: 'Just finished a great gaming session! #GamerLife',
    //       author: {
    //         _id: 'user1',
    //         username: 'GameMaster42',
    //         image: 'https://i.pravatar.cc/150?img=1'
    //       },
    //       timestamp: new Date().toISOString(),
    //       likes: 15,
    //       comments: 3,
    //       mediaUrl: 'https://picsum.photos/seed/picsum/800/600',
    //       mediaType: 'image'
    //     },
    //     {
    //       id: '2',
    //       content: 'Check out this amazing cosplay! #Cosplay #AnimeConvention',
    //       author: {
    //         _id: 'user2',
    //         username: 'CosplayQueen',
    //         image: 'https://i.pravatar.cc/150?img=5'
    //       },
    //       timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    //       likes: 42,
    //       comments: 7,
    //       mediaUrl: 'https://picsum.photos/seed/cosplay/800/600',
    //       mediaType: 'image'
    //     },
    //     {
    //       id: '3',
    //       content: 'Just released a new song! Give it a listen and let me know what you think. #NewMusic',
    //       author: {
    //         _id: 'user3',
    //         username: 'MusicProducer99',
    //         image: 'https://i.pravatar.cc/150?img=8'
    //       },
    //       timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    //       likes: 31,
    //       comments: 12,
    //       mediaUrl: 'https://picsum.photos/seed/music/800/600',
    //       mediaType: 'image'
    //     },
    //     {
    //       id: '4',
    //       content: 'Streaming my speedrun attempt in 30 minutes! Come watch live! #Speedrun #LiveStream',
    //       author: {
    //         _id: 'user4',
    //         username: 'SpeedyGonzales',
    //         image: 'https://i.pravatar.cc/150?img=12'
    //       },
    //       timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    //       likes: 28,
    //       comments: 5
    //     },
    //     {
    //       id: '5',
    //       content: 'Just hit Diamond rank! The grind was real but totally worth it. #CompetitiveGaming',
    //       author: {
    //         _id: 'user5',
    //         username: 'DiamondWarrior',
    //         image: 'https://i.pravatar.cc/150?img=15'
    //       },
    //       timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    //       likes: 56,
    //       comments: 9,
    //       mediaUrl: 'https://picsum.photos/seed/diamond/800/600',
    //       mediaType: 'image'
    //     }
    //   ];
    //   this.isLoading = false;
    // }, 1000);




    this.stories  = [
      
        {
          "authorName": "GameMaster42",
          "authorImage": "https://i.pravatar.cc/150?img=1"
        },
        {
          "authorName": "CosplayQueen",
          "authorImage": "https://i.pravatar.cc/150?img=5"
        },
        {
          "authorName": "MusicProducer99",
          "authorImage": "https://i.pravatar.cc/150?img=8"
        },
        {
          "authorName": "SpeedyGonzales",
          "authorImage": "https://i.pravatar.cc/150?img=12"
        },
        {
          "authorName": "DiamondWarrior",
          "authorImage": "https://i.pravatar.cc/150?img=15"
        }
      ]



      this.suggestions = [
        { username: 'JohnDoe', image: 'path/to/image.jpg', mutualFriends: 5 },
        { username: 'JaneSmith', image: 'path/to/image.jpg', mutualFriends: 3 },
        // ... more suggestions
      ];


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

}
