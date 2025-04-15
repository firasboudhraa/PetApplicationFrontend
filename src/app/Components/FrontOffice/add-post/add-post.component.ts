import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit, AfterViewInit {
  postForm: FormGroup;
  selectedFile: File | null = null;
  imageError: string | null = null;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  userId: number = 1; // TODO: récupérer depuis JWT
  map!: google.maps.Map;
  marker!: google.maps.Marker;

  // Coordonnées par défaut (ex. Tunis)
  latitude: number = 36.8065;
  longitude: number = 10.1815;

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
      image: [null, Validators.required],
      latitude: [this.latitude],
      longitude: [this.longitude]
    });
    
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 12
    });

    this.marker = new google.maps.Marker({
      position: { lat: this.latitude, lng: this.longitude },
      map: this.map,
      draggable: true,
      title: 'Position du post'
    });

    // Mettre à jour les coordonnées quand le marqueur est déplacé
    this.marker.addListener('dragend', () => {
      const position = this.marker.getPosition();
      if (position) {
        this.latitude = position.lat();
        this.longitude = position.lng();
      }
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
    if (this.postForm.invalid || !this.selectedFile) return;
    console.log('Latitude:', this.latitude);
    console.log('Longitude:', this.longitude);

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('title', this.postForm.value.title);
    formData.append('content', this.postForm.value.content);
    formData.append('type', this.postForm.value.type);
    formData.append('image', this.selectedFile);
    formData.append('latitude', this.latitude.toString());
    formData.append('longitude', this.longitude.toString());

    this.postService.addPost(formData, this.userId).subscribe({
      next: () => this.router.navigate(['/blog']),
      error: (err) => {
        this.errorMessage = 'Erreur lors de la publication.';
        this.isSubmitting = false;
      }
    });
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
