import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  postForm: FormGroup;
  selectedFile: File | null = null;
  imageError: string | null = null;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  userId: number = 1; // Replace this with dynamic user ID (e.g., from JWT)

  types = [
    { label: 'Success Story', value: 'success_stories' },
    { label: 'Lost & Found', value: 'lost_found' },
    { label: 'Help & Advice', value: 'help_advice' }
  ];

  constructor(
    private fb: FormBuilder,
    private postService: PostsService,
    public router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      type: ['', Validators.required],
      image: [null, Validators.required] // Ensure image is required
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
    if (this.postForm.valid && this.selectedFile) {
      this.isSubmitting = true;

      // Ideally, the user ID should be dynamically fetched (e.g., from JWT)
      const userId = this.userId;

      const formData = new FormData();
      formData.append('title', this.postForm.get('title')?.value);
      formData.append('content', this.postForm.get('content')?.value);
      formData.append('type', this.mapTypeToEnum(this.postForm.get('type')?.value));
      formData.append('image', this.selectedFile);

      this.postService.addPost(formData, userId).subscribe(
        () => {
          this.isSubmitting = false;
          this.router.navigate(['/blog']);
          this.postForm.reset(); // Optionally reset form after successful post
        },
        (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Erreur lors de la publication du post. Veuillez réessayer.';
          console.error('Error uploading post:', error);
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
