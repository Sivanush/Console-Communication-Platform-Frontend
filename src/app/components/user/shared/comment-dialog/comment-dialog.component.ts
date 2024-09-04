import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.scss'
})
export class CommentDialogComponent {

  // @Input() comments: any[] = [];
  // @Output() close = new EventEmitter<void>();
  // @Output() addComment = new EventEmitter<string>();

  // commentForm: FormGroup;

  // constructor(private fb: FormBuilder) {
  //   this.commentForm = this.fb.group({
  //     comment: ['', Validators.required]
  //   });
  // }



  // ngOnInit() {
  //   // Disable scrolling on the body when the modal opens
  //   document.body.style.overflow = 'hidden';
  // }

  // ngOnDestroy() {
  //   // Re-enable scrolling when the component is destroyed
  //   document.body.style.overflow = 'auto';
  // }

  
  // submitComment() {
  //   if (this.commentForm.valid) {
  //     this.addComment.emit(this.commentForm.value.comment);
  //     this.commentForm.reset();
  //   }
  // }


  // onBackdropClick(event: MouseEvent) {
  //   // Close the modal if the click is on the backdrop
  //   if ((event.target as HTMLElement).classList.contains('fixed')) {
  //     this.close.emit();
  //   }
  // }


  // @Input() post: any;
  // newCommentContent: string = '';

  // addComment(postId: string) {
  //   if (this.newCommentContent.trim()) {
  //     // Here you would typically call a service to add the comment
  //     console.log(`Adding comment to post ${postId}: ${this.newCommentContent}`);
  //     this.newCommentContent = '';
  //   }
  // }


  @Input() postId!: string;
  @Input() comments: any[] = [];
  @Output() addComment = new EventEmitter<{ postId: string, content: string }>();

  isOpen = false;
  newComment = '';

  onSubmit() {
    if (this.newComment.trim()) {
      this.addComment.emit({ postId: this.postId, content: this.newComment });
      this.newComment = '';
    }
  }
}
