import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/Services/posts.service';
import { UserService } from 'src/app/Components/FrontOffice/user/service_user/user.service';
import { CommentService } from 'src/app/Services/comments.service';
import { Post } from 'src/app/models/Post';
import { Comment } from 'src/app/models/Comment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { User } from '../user/models/user_model';
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service'; // Ensure correct import path

declare var google: any;  // Ensure Google Maps API types are loaded via @types/google.maps

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, AfterViewInit {
  post: Post | null = null;
  authorName: string = 'Unknown';
  comments: Comment[] = [];
  commentAuthors: Map<number, string> = new Map();
  userNames: Map<number, string> = new Map();
  showLikesPopup: boolean = false;
  newCommentContent: string = '';
  reportedComments: Set<Comment> = new Set<Comment>();
  
  // Map-related properties
  latitude: number | null = null;
  longitude: number | null = null;
  zoom: number = 12.5;
  map!: google.maps.Map;
  marker!: google.maps.Marker;

  showEmojiPicker = false;
  isSnackbarVisible: boolean = true; // Set this to true to show snackbar for testing

  // For Confirmation Modal
  showConfirmModal = false;
  postIdToDelete: number | null = null;

  userId: number = 0;  // Add this to store the logged-in user's ID

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private userService: UserService,
    private commentService: CommentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService  // Inject AuthService
  ) {}

  isDeleted: boolean = false;
  



  ngOnInit(): void {
    // Retrieve the logged-in user's ID using the AuthService
    const tokenData = this.authService.getDecodedToken();  // Decodes the JWT token
    if (tokenData && tokenData.userId) {
      this.userId = tokenData.userId;
      console.log('Logged-in user ID:', this.userId);  // Log the logged-in user ID
    } else {
      this.router.navigate(['/login']);  // Redirect to login if not authenticated
      return;  // Prevent further execution
    }
  
    // Retrieve the post ID from the route parameters
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      this.loadPost(postId);  // Load the post details by ID
    } else {
      console.error('Post ID not found in route parameters');
    }
  }
  
  ngAfterViewInit(): void {
    // We'll initialize the map after post is loaded. See loadPost() below.
  }

  private loadPost(postId: number): void {
    this.postService.getPostById(postId).subscribe({
      next: (post: Post) => {
        if (post) {
          this.post = post;
          this.latitude = post.latitude;
          this.longitude = post.longitude;
          this.loadPostAuthor(post.userId);
          this.loadComments(postId);  // 👈 comments and authors will be loaded properly inside loadComments
          this.loadLikes(post.likedBy);
  
          setTimeout(() => {
            this.initMap();
          }, 0);
        }
      },
      error: (error) => console.error('Error loading post:', error)
    });
  }

  private loadPostAuthor(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.authorName = user.firstName + ' ' + user.lastName + ' (' + this.formatRole(user.roles.map(role => role.toString())) + ')';
      },
      error: (error) => console.error('Error loading post author:', error)
    });
  }

  private loadComments(postId: number): void {
    this.commentService.getCommentsByPostId(postId).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
        this.loadCommentAuthors(comments);  // ✅ Pass the loaded comments here
      },
      error: (error) => console.error('Error loading comments:', error)
    });
  }

  private loadCommentAuthors(comments: Comment[]): void {
    comments.forEach(comment => {
      console.log('Processing comment userId:', comment.userId); // Log the userId to make sure it's correct
      
      if (comment.userId && !this.commentAuthors.has(comment.userId)) {
        this.userService.getUserById(comment.userId).subscribe({
          next: (user: User) => {
            console.log('Loaded user:', user);  // Log the user data for debugging
            this.commentAuthors.set(comment.userId, user.firstName + ' ' + user.lastName);
            this.changeDetectorRef.detectChanges(); 
          },
          error: (error) => {
            console.error('Error loading comment author for userId:', comment.userId, 'Error:', error); // More detailed error logging
          }
        });
      }
    });
  
    console.log('Final commentAuthors map:', this.commentAuthors); // Check the map after loading users
  }

  private loadLikes(userIds: number[]): void {
    userIds.forEach(userId => {
      if (!this.userNames.has(userId)) {
        this.userService.getUserById(userId).subscribe({
          next: (user: User) => {
            this.userNames.set(userId, user.firstName + ' ' + user.lastName);
            this.changeDetectorRef.detectChanges(); // 👈 force Angular to refresh view
          },
          error: (error) => console.error('Error loading user likes:', error)
        });
      }
    });
  }

  initMap(): void {
    if (this.latitude !== null && this.longitude !== null) {
      const mapElement = document.getElementById('map') as HTMLElement;
      this.map = new google.maps.Map(mapElement, {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: this.zoom
      });
  
      this.marker = new google.maps.Marker({
        position: { lat: this.latitude, lng: this.longitude },
        map: this.map,
        title: 'Post Location'
      });
    }
  }

  toggleLikesPopup(): void {
    this.showLikesPopup = !this.showLikesPopup;
  }

  likeComment(commentId: number): void {
    this.commentService.likeComment(commentId, this.userId).subscribe({
      next: () => {
        const postId = this.post?.id;
        if (postId) {
          this.loadComments(postId); 
        }
      },
      error: (err) => console.error('Error liking comment:', err)
    });
  }

  addComment(): void {
    const trimmedContent = this.newCommentContent.trim();
    if (trimmedContent && this.post?.id) {
      const commentData = { content: trimmedContent };
      this.commentService.addComment(this.post.id, this.userId, commentData).subscribe({
        next: () => {
          this.newCommentContent = '';
          this.loadComments(this.post!.id); 
        },
        error: (error) => console.error('Error adding comment:', error)
      });
    }
  }

  likePost(postId: number): void {
    this.postService.likePost(postId, this.userId).subscribe({
      next: () => {
        this.loadPost(postId);
      },
      error: (err) => console.error('Error liking post:', err)
    });
  }

  deletePostWithoutMail(postId: number): void {
    if (postId) {
      this.postService.deletePostWithoutMail(postId).subscribe({
        next: () => {
          console.log('Post deleted successfully');
          this.router.navigate(['/blog']);
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  formatCategory(category: string): string {
    if (!category) return '';
    return category
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    const emojiButton = document.querySelector('.btn-emoji') as HTMLElement;
    const rect = emojiButton.getBoundingClientRect();
    const popup = document.querySelector('.emoji-picker-popup') as HTMLElement;
  
    if (popup) {
      popup.style.top = `${rect.top - popup.offsetHeight - 8}px`; // Adjust this as needed
      popup.style.left = `${rect.left + rect.width / 2 - popup.offsetWidth / 2}px`; // Adjust this as needed
    }
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.emoji-picker-popup') &&
      !(event.target as HTMLElement).closest('.btn-emoji')) {
      this.showEmojiPicker = false;
    }
  }

  showEmojis: boolean = false;

  onSelectEmojis(event: any): void {
    const emoji = event.emoji?.native;
    if (emoji) {
      this.newCommentContent += emoji;
    }
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.isDeleted = true;
        setTimeout(() => {
          this.isDeleted = false;
        }, 3000);
        const postId = this.post?.id;
        if (postId) {
          this.loadComments(postId);
        }
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
        this.snackBar.open('Error deleting comment', '', {
          duration: 3000, 
          panelClass: ['snackbar-error'],
        });
      }
    });
  }

  openDeleteModal(postId: number): void {
    this.postIdToDelete = postId;
    this.showConfirmModal = true;
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.postIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.postIdToDelete) {
      this.deletePostWithoutMail(this.postIdToDelete);
      this.showConfirmModal = false;
      this.postIdToDelete = null;
    }
  }
  private formatRole(roles: string[]): string {
    return roles.map(role => {
      switch (role) {
        case 'SERVICE_PROVIDER':
          return 'Service Provider';
        case 'PET_OWNER':
          return 'Pet Owner';
        case 'VETERINARIAN':
          return 'Veterinarian';
        case 'ADMIN':
          return 'Administrator';
        default:
          return role;
      }
    }).join(', ');  // Joining the formatted roles with commas
  }
  


}
