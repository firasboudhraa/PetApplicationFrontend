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
  map!: google.maps.Map;
marker!: google.maps.Marker;
latitude: number = 36.8065;
longitude: number = 10.1815;

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
      image: [null],
      latitude: [this.latitude],
      longitude: [this.longitude]
    });
    
  }
  ngOnInit(): void {
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
      formData.append('latitude', this.latitude.toString());
formData.append('longitude', this.longitude.toString());


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
