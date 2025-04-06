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

  types = [  // Renamed from 'categories' to 'types'
    { label: 'Success Story', value: 'success_stories' },
    { label: 'Lost & Found', value: 'lost_found' },
    { label: 'Help & Advice', value: 'help_advice' }
  ];

  constructor(private fb: FormBuilder, private postService: PostsService, private router: Router) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      type: ['', Validators.required]  // Changed 'category' to 'type'
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const userId = 1; // Replace with dynamic userId from JWT later
      const postType = this.mapTypeToEnum(this.postForm.value.type);  // Changed to 'type'
  
      // Log to check if the type is mapped correctly
      console.log('Mapped Type:', postType);
  
      // Replace the category with the corresponding type value
      const postData = {
        ...this.postForm.value,
        type: postType  // Ensure 'type' is passed correctly
      };
  
      console.log('Form Submitted:', postData); // Log the cleaned-up form data
  
      this.postService.addPost(postData, userId).subscribe(() => {
        this.router.navigate(['/blog']);
      });
    }
  }
  

  // Helper function to map the type string to the PostTypeEnum
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
