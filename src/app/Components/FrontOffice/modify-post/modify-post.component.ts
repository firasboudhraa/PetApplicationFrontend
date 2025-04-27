import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/Services/posts.service';
import { Post } from 'src/app/models/Post';
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service'; // Ensure correct import path
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.css']
})
export class ModifyPostComponent implements OnInit, AfterViewInit {
  postForm: FormGroup;
  selectedFile: File | null = null;
  imageError: string | null = null;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  postId: number = -1;
  post: Post | null = null;
  map!: google.maps.Map;
  marker!: google.maps.Marker;
  latitude: number = 36.8065;
  longitude: number = 10.1815;
  fileName: string | null = null;

  userId: number = -1; // Will be dynamically fetched

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
    private authService: AuthService  // Inject AuthService here
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      type: ['', Validators.required],
      image: [null],
      latitude: [this.latitude],
      longitude: [this.longitude]
    });
  }

  ngOnInit(): void {
    // Fetch logged-in user ID
    const tokenData = this.authService.getDecodedToken();
    if (tokenData && tokenData.userId) {
      this.userId = tokenData.userId;
      console.log('Logged-in user ID:', this.userId);
    } else {
      this.errorMessage = 'User not authenticated';
      this.router.navigate(['/login']);
      return;
    }

    // Fetch post ID from route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.postId = +id;
        this.loadPostDetails(this.postId);
      }
    });
  }

  ngAfterViewInit(): void {
    this.postForm.get('type')?.valueChanges.subscribe(value => {
      if (value === 'lost_found') {
        setTimeout(() => this.initMap(), 0);
      }
    });

    if (this.postForm.get('type')?.value === 'lost_found') {
      setTimeout(() => this.initMap(), 0);
    }
  }

  initMap(): void {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    this.map = new google.maps.Map(mapDiv, {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 12
    });

    this.marker = new google.maps.Marker({
      position: { lat: this.latitude, lng: this.longitude },
      map: this.map,
      draggable: true,
      title: 'Post location'
    });

    this.marker.addListener('dragend', () => {
      const position = this.marker.getPosition();
      if (position) {
        this.latitude = position.lat();
        this.longitude = position.lng();
      }
    });
  }

  private loadPostDetails(postId: number): void {
    this.postService.getPostById(postId).subscribe(
      (post: Post) => {
        this.post = post;
        this.populateForm(post);
      },
      (error) => console.error('Error loading post details:', error)
    );
  }

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
        this.fileName = null;
      } else {
        this.imageError = null;
        this.selectedFile = file;
        this.fileName = file.name;
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
      formData.append('latitude', this.latitude.toString());
      formData.append('longitude', this.longitude.toString());

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.postService.updatePost(this.postId, formData, this.userId).subscribe(
        () => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'success',
            title: 'Post Updated!',
            text: 'Your post has been successfully updated.',
            showConfirmButton: false,
            timer: 2000 // auto close after 2 seconds
          });

          setTimeout(() => {
            this.router.navigate(['/blog']);
          }, 2000);
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
