import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../../service/post-service/post.service';
import { commentI } from '../../../../models/post/post.model';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.scss'
})
export class CommentDialogComponent {

  constructor(private postService:PostService) {

  }

  @Input() postId!: string;
  @Input() comments: commentI[] = [];
  @Output() addComment = new EventEmitter<{ postId: string, content: string }>();


  ngOnInit(): void {
  
    console.log(this.postId);
    
    this.getCommentsForThePost(this.postId)

  }
  isOpen = true;
  newComment = '';



  getCommentsForThePost(postId: string) {
    this.postService.getCommentsForThePost(postId).subscribe({
      next: (response) => {
        this.comments = response.comments
        console.log(response.comments);
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }


  onSubmit() {
    if (this.newComment.trim()) {
      this.postService.commentOnPost(this.postId,this.newComment).subscribe({
        next:(response)=>{
          this.getCommentsForThePost(this.postId)
          console.log(response);
          this.newComment = ''
        },
        error:(err)=>{
          console.error(err);
        }
      })
    }
  }
}
