import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/Services/posts.service';
import { UserService } from 'src/app/Services/user.service';
import { CommentService } from 'src/app/Services/comments.service';
import { Post } from 'src/app/models/Post';
import { Comment } from 'src/app/models/Comment';
import { UserDTO } from 'src/app/models/userDTO';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';

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
  
  userId: number = 1; // Replace with dynamic user ID

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

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private userService: UserService,
    private commentService: CommentService,
    private router: Router,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      this.loadPost(postId);
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
          // Set the coordinates from the post
          this.latitude = post.latitude;
          this.longitude = post.longitude;
          this.loadPostAuthor(post.userId);
          this.loadComments(postId);
          this.loadLikes(post.likedBy);
          // After ensuring the post data is loaded, initialize the map.
          // Use setTimeout to ensure the DOM for the map container is ready.
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
      next: (user: UserDTO) => {
        this.authorName = user.name;
      },
      error: (error) => console.error('Error loading post author:', error)
    });
  }

  private loadComments(postId: number): void {
    this.commentService.getCommentsByPostId(postId).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
        this.loadCommentAuthors();
      },
      error: (error) => console.error('Error loading comments:', error)
    });
  }

  private loadCommentAuthors(): void {
    this.comments.forEach(comment => {
      if (!this.commentAuthors.has(comment.userId)) {
        this.userService.getUserById(comment.userId).subscribe({
          next: (user: UserDTO) => {
            this.commentAuthors.set(comment.userId, user.name);
          },
          error: (error) => console.error('Error loading comment author:', error)
        });
      }
    });
  }

  private loadLikes(userIds: number[]): void {
    userIds.forEach(userId => {
      if (!this.userNames.has(userId)) {
        this.userService.getUserById(userId).subscribe({
          next: (user: UserDTO) => {
            this.userNames.set(userId, user.name);
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

  // Dummy implementation for toggleLikesPopup (to satisfy template calls)
  toggleLikesPopup(): void {
    this.showLikesPopup = !this.showLikesPopup;
  }

  likeComment(commentId: number): void {
    this.commentService.likeComment(commentId, this.userId).subscribe({
      next: () => {
        // Reload the comments to get the updated like count after the like action
        const postId = this.post?.id; // Get the current post ID
        if (postId) {
          this.loadComments(postId); // Re-fetch the comments to reflect the updated data
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
          this.loadComments(this.post!.id); // 👈 Re-fetch all comments after adding
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

  isDeleted: boolean = false;

  deletePostWithoutMail(postId: number): void {
    if (postId) { // Ensure that postId is provided
      // Proceed with the deletion first
      this.postService.deletePostWithoutMail(postId).subscribe({
        next: () => {
          console.log('Post deleted successfully');
          // Now navigate to the blog page after successful deletion
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

  // Fonction pour basculer l'affichage du picker
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;

    // Get the position of the emoji button
    const emojiButton = document.querySelector('.btn-emoji') as HTMLElement;
    const rect = emojiButton.getBoundingClientRect();
    
    // If the emoji picker should be above the button
    const popup = document.querySelector('.emoji-picker-popup') as HTMLElement;
  
    if (popup) {
      // Adjust the position based on the button's position
      popup.style.top = `${rect.top - popup.offsetHeight - 8}px`;  // 8px for margin
      popup.style.left = `${rect.left + rect.width / 2 - popup.offsetWidth / 2}px`;  // Center horizontally
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.emoji-picker-popup') &&
      !(event.target as HTMLElement).closest('.btn-emoji')) {
      this.showEmojiPicker = false;
    }
  }

  showEmojis: boolean = false; // Ajoutez cette méthode pour gérer la sélection d'emoji

  onSelectEmojis(event: any): void {
    const emoji = event.emoji?.native;  // This should directly give you the emoji character
    if (emoji) {
      this.newCommentContent += emoji;  // Append the emoji to the comment content
    }
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        console.log('Comment deleted successfully!');
        this.isDeleted = true;
        setTimeout(() => {
          this.isDeleted = false;
        }, 3000); // Hide notification after 3 seconds

        // Re-fetch the updated comments list from the server
        const postId = this.post?.id; // Get the current post ID
        if (postId) {
          this.loadComments(postId); // Re-fetch the comments to reflect the updated data
        }
      },
      error: (error) => {
        console.error('Error deleting comment:', error);

        // Show error snackbar
        console.log('Opening error snackbar...');
        this.snackBar.open('Error deleting comment', '', {
          duration: 3000, // 3 seconds
          panelClass: ['snackbar-error'], // Red error snackbar
        });
      }
    });
  }

  // Open the confirmation modal
  openDeleteModal(postId: number): void {
    this.postIdToDelete = postId;
    this.showConfirmModal = true;
  }

  // Cancel deletion and close modal
  cancelDelete(): void {
    this.showConfirmModal = false;
    this.postIdToDelete = null;
  }

  // Confirm and delete the post
  confirmDelete(): void {
    if (this.postIdToDelete) {
      this.deletePostWithoutMail(this.postIdToDelete);
      this.showConfirmModal = false; // Hide the modal after confirming
      this.postIdToDelete = null; // Reset the post ID to delete
    }
  }





}
