import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/Services/posts.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';  // Ensure you have the environment set correctly
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';
import Swal from 'sweetalert2';


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
  userId: number = 0; // Will be set in ngOnInit
  map!: google.maps.Map;
  marker!: google.maps.Marker;
  fileName: string | null = null;  // Pour stocker le nom du fichier

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
    public router: Router,
    private http: HttpClient,
    private authService: AuthService // <-- add this
    // Inject HttpClient for API calls
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

  ngOnInit(): void {
    const tokenData = this.authService.getDecodedToken();
    if (tokenData && tokenData.userId) {
      this.userId = tokenData.userId;
      console.log('Logged-in user ID:', this.userId);
    } else {
      this.errorMessage = 'User not authenticated';
      this.router.navigate(['/login']);
    }
  }
  



  isDeleted: boolean = false;


  ngAfterViewInit(): void {
    this.postForm.get('type')?.valueChanges.subscribe(value => {
      if (value === 'lost_found') {
        setTimeout(() => this.initMap(), 0); // attendre que le DOM rende le div *ngIf
      }
    });

    // Si le type est déjà sélectionné à lost_found au chargement
    if (this.postForm.get('type')?.value === 'lost_found') {
      setTimeout(() => this.initMap(), 0);
    }
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
        this.fileName = null;  // Réinitialiser le nom du fichier en cas d'erreur
      } else {
        this.imageError = null;
        this.selectedFile = file;
        this.fileName = file.name;  // Stocker le nom du fichier
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
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Post Added!',
          text: 'Your post was successfully added.',
          timer: 2000,
          showConfirmButton: false
        });
  
        setTimeout(() => {
          this.router.navigate(['/blog']); // Redirect after the alert
        }, 2000); 
      },
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

  // Enhance content method
  enhanceContent(): void {
    const currentContent = this.postForm.get('content')?.value;

    if (currentContent) {
      // Call the Flask backend to enhance the content
      this.http.post<{ enhanced_text: string }>(`${environment.apiBaseUrl}/enhance`, { text: currentContent }).subscribe({
        next: (response) => {
          this.postForm.get('content')?.setValue(response.enhanced_text);  // Set the enhanced content back
        },
        error: (err) => {
          this.errorMessage = "Error enhancing content. Please try again.";
        }
      });
    } else {
      this.errorMessage = "Content is empty and can't be enhanced.";
    }
  }


 
}
