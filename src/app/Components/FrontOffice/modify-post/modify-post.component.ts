import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/Post';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.css']
})
export class ModifyPostComponent implements OnInit {
  postForm: FormGroup;
  selectedFile: File | null = null;
  imageError: string | null = null;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  postId: number = -1; // Default value
  post: Post | null = null;
  userId: number = 2; // Dynamically fetched user ID, like JWT token

  types = [
    { label: 'Success Story', value: 'success_stories' },
    { label: 'Lost & Found', value: 'lost_found' },
    { label: 'Help & Advice', value: 'help_advice' }
  ];

  constructor(
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute,
    public router: Router,
    private userService: UserService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      type: ['', Validators.required],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id')); // Ensure it's properly set
    if (this.postId) {
      this.loadPostDetails(this.postId);
    }
  }
  

  // Fetch post details by ID
  private loadPostDetails(postId: number): void {
    this.postService.getPostById(postId).subscribe(
      (post: Post) => {
        this.post = post;
        this.populateForm(post);
      },
      (error) => console.error('Error loading post details:', error)
    );
  }

  // Populate the form with the existing post details
  private populateForm(post: Post): void {
    this.postForm.patchValue({
      title: post.title,
      content: post.content,
      type: post.type
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.imageError = 'Seules les images sont autorisées.';
        this.selectedFile = null;
        this.postForm.get('image')?.setValue(null);
      } else {
        this.imageError = null;
        this.selectedFile = file;
        this.postForm.get('image')?.setValue(file);
      }
    }
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();
      formData.append('title', this.postForm.get('title')?.value);
      formData.append('content', this.postForm.get('content')?.value);
      formData.append('type', this.mapTypeToEnum(this.postForm.get('type')?.value));

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // Call the updatePost service method with the dynamic userId
      this.postService.updatePost(this.postId, formData, this.userId).subscribe(
        () => {
          this.isSubmitting = false;
          this.router.navigate(['/blog']); // Navigate to the blog page or another view
        },
        (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Erreur lors de la mise à jour du post. Veuillez réessayer.';
          console.error('Error updating post:', error);
        }
      );
    }
  }

  mapTypeToEnum(type: string): string {
    switch (type) {
      case 'success_stories':
        return 'SUCCESS_STORIES';
      case 'lost_found':
        return 'LOST_FOUND';
      case 'help_advice':
        return 'HELP_ADVICE';
      default:
        return '';
    }
  }
}
