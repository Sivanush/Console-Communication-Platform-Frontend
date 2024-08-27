import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { UserI } from '../../../interface/server/channelChat';
import { User } from '../../../interface/user/user.model';
import { RouterModule } from '@angular/router';
import { ServerService } from '../../../service/server/server.service';
import { PostService } from '../../../service/post-service/post.service';
import { PostI } from '../../../models/post/post.model';
import { AutoPlayPostDirective } from '../../../directive/auto-play-post/auto-play-post.directive';
import { ToastService } from '../../../service/toster/toster-service.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,AutoPlayPostDirective],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user!: User;
  isOwnProfile: boolean = true;
  activeTab: string = 'posts';
  content: string = '';
  posts: PostI[] = [];
  friends: any[] = [];
  servers: any[] = [];
  userId!: string | null
  isLoading:boolean = false
  previewUrl: string | null = null;
  fileType: 'image' | 'video' | null = null;
  selectedFile: File | null = null;
  private observer: IntersectionObserver | null = null;

  constructor(
    private userService: UserService, 
    private serverService: ServerService, 
    private postService: PostService,
    private toaster:ToastService
  ) { }



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

    this.getUserPost()
    


    // Initialize sample servers
    this.servers = [
      { name: 'Gaming Hub', memberCount: 1000, iconUrl: 'https://placehold.co/1000x1000/000000/FFF' },
      { name: 'Movie Buffs', memberCount: 500, iconUrl: 'https://placehold.co/1000x1000/000000/FFF' }
      // Add more sample servers here
    ];
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.fileType = this.selectedFile!.type.startsWith('image/') ? 'image' : 'video';
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }


  clearPreview(): void {
    this.previewUrl = null;
    this.fileType = null;
    this.selectedFile = null;
  }

  getFileSize(bytes: number | undefined): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }


  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  async submitPost(): Promise<void> {
    if (this.content.trim() || this.selectedFile) {
      this.isLoading = true
      let mediaUrl: string | null;

      if (this.selectedFile) {
        try {
          mediaUrl = await this.postService.uploadToAWS(this.selectedFile);
        } catch (error) {
          console.error('Error uploading to S3:', error);
          return;
        }
      }

      const type = this.fileType || 'text';

      this.postService.createPost(this.content,type,mediaUrl!).subscribe({
        next: (data) => {
          console.log(data);
          this.content = ''
          this.previewUrl = null;
          this.fileType = null;
          this.selectedFile = null;
          this.getUserPost()
          this.isLoading = false
          this.toaster.showSuccess('Successfully Posted')
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false
          this.toaster.showError('Something Went Wrong, Try Again')
        }
      })
    }
  }
  

  getUserPost(){
    this.postService.getUserPost().subscribe({
      next: (data) => {
        this.posts = data
      }
    })
  }
}