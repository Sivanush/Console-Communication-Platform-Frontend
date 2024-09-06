import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { UserI } from '../../../interface/server/channelChat';
import { User } from '../../../interface/user/user.model';
import { RouterModule } from '@angular/router';
import { ServerService } from '../../../service/server/server.service';
import { PostService } from '../../../service/post-service/post.service';
import { PostI } from '../../../models/post/post.model';
import { AutoPlayPostDirective } from '../../../directive/auto-play-post/auto-play-post.directive';
import { ToastService } from '../../../service/toster/toster-service.service';
import { error } from 'console';
import { VideoPlayerComponent } from "../shared/video-player/video-player.component";
import { CommentDialogComponent } from "../shared/comment-dialog/comment-dialog.component";
import { LoadingService } from '../../../service/loading/loading.service';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AutoPlayPostDirective, FormsModule, ReactiveFormsModule, VideoPlayerComponent, CommentDialogComponent],
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
  isLoading: boolean = false
  previewUrl: string | null = null;
  fileType: 'image' | 'video' | null = null;
  selectedFile: File | null = null;
  private observer: IntersectionObserver | null = null;
  profileImagePreview: string | null = null;
  bannerImagePreview: string | null = null;

  @Input() isModalOpen: boolean = false;
  openPostId: string | null = null;

  profileImageFile: File | null = null;
  bannerImageFile: File | null = null;
  showCommentDialog = false;

  userForm: FormGroup
  constructor(
    private userService: UserService,
    private serverService: ServerService,
    private postService: PostService,
    private toaster: ToastService,
    private fb: FormBuilder,
    private location: Location,
    private loading:LoadingService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.maxLength(160)]],
      status: ['', [Validators.required]],
    });
  }

  toggleModel() {
    this.isModalOpen = !this.isModalOpen;
  }


  async ngOnInit(): Promise<void> {
    this.loading.show()
    this.loadUserData()

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

    if (this.userId) {
      this.getUserPost(this.userId)
    }





    // Initialize sample servers
    this.servers = [
      { name: 'Gaming Hub', memberCount: 1000, iconUrl: 'https://placehold.co/1000x1000/000000/FFF' },
      { name: 'Movie Buffs', memberCount: 500, iconUrl: 'https://placehold.co/1000x1000/000000/FFF' }
      // Add more sample servers here
    ];
  }


  loadUserData() {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.user = data
        console.log(data);

      }
    })
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

      this.postService.createPost(this.content, type, mediaUrl!).subscribe({
        next: (data) => {
          console.log(data);
          this.content = ''
          this.previewUrl = null;
          this.fileType = null;
          this.selectedFile = null;
          this.getUserPost(this.userId as string)
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


  getUserPost(userId:string) {
    this.postService.getUserPost(userId).subscribe({
      next: (data) => {
        this.posts = data
        console.log(data);
        this.loading.hide()

      }
    })
  }


  goBack() {
    this.location.back()
  }


  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.validateAndSetProfileImage(file);
    }
  }


  validateAndSetProfileImage(file: File): void {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const isValidAspectRatio = Math.abs(aspectRatio - 1) < 0.5;

      if (isValidAspectRatio) {
        this.profileImageFile = file;
        this.readFile(file, 'image');
        console.log(`Image loaded successfully with aspect ratio: ${aspectRatio.toFixed(2)}.`);
      } else {
        console.warn(`Invalid aspect ratio: ${aspectRatio.toFixed(2)}. Required approximately 1:1.`);
        this.toaster.showError('Please select an image with an aspect ratio close to 1:1.');
      }
    };
    img.onerror = () => {
      this.toaster.showError('Invalid image file. Please try again.');
    };
    img.src = URL.createObjectURL(file);
  }

  onBannerImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.bannerImageFile = input.files[0];
      this.readFile(this.bannerImageFile, 'banner');
    }
  }

  readFile(file: File, type: 'image' | 'banner'): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (type === 'image') {
        this.profileImagePreview = e.target.result;
      } else {
        this.bannerImagePreview = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }




  async onEditProfileSubmit() {
    if (this.userForm.valid) {
      let profileData: User = this.userForm.value;
      profileData._id = await this.userService.getUserId() as string
      console.log(profileData);

      if (this.profileImageFile) {
        try {
          const imageUrl = await this.postService.uploadToAWS(this.profileImageFile);
          profileData.image = imageUrl;
        } catch (error) {
          this.toaster.showError('Failed to upload profile image');
          return;
        }
      }

      if (this.bannerImageFile) {
        try {
          const bannerUrl = await this.postService.uploadToAWS(this.bannerImageFile);
          profileData.banner = bannerUrl;
        } catch (error) {
          this.toaster.showError('Failed to upload banner image');
          return;
        }
      }

      this.userService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.toaster.showSuccess('Profile updated successfully');
          this.loadUserData();
          this.isModalOpen = false
        },
        error: (error) => {
          this.toaster.showError('Failed to update profile');
          this.isModalOpen = false
        }
      });

    } else {
      console.log(this.userForm);
    }
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



}