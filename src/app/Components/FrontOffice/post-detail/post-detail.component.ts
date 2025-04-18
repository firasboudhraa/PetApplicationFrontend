import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import { CommentService } from 'src/app/services/comments.service';
import { Post } from 'src/app/models/Post';
import { Comment } from 'src/app/models/Comment';
import { UserDTO } from 'src/app/models/userDTO';
import { Router } from '@angular/router';

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

  userId: number = 2; // Replace with dynamic user ID

  // Map-related properties
  latitude: number | null = null;
  longitude: number | null = null;
  zoom: number = 12;
  map!: google.maps.Map;
  marker!: google.maps.Marker;
  showEmojiPicker = false;


  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private userService: UserService,
    private commentService: CommentService,
    private router: Router
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

  // Dummy implementation for likeComment (to satisfy template calls)
  likeComment(commentId: number): void {
    // Replace this with your actual logic for liking a comment.
    console.log('Liking comment id:', commentId);
  }

  addComment(): void {
    const trimmedContent = this.newCommentContent.trim();
    if (trimmedContent) {
      const commentData = { content: trimmedContent };
      this.commentService.addComment(this.post?.id ?? 0, this.userId, commentData).subscribe({
        next: (response: Comment) => {
          this.comments.push(response);
          this.newCommentContent = '';
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

  deletePost(postId: number): void {
    if (confirm("Are you sure you want to delete this post?")) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          console.log('Post deleted successfully');
          this.router.navigate(['/blog']);
        },
        error: (error) => console.error('Error deleting post:', error)
      });
    }
  }

  deleteComment(commentId: number): void {
    if (confirm("Are you sure you want to delete this comment?")) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          console.log('Comment deleted successfully');
          this.comments = this.comments.filter(comment => comment.id !== commentId);
        },
        error: (error) => console.error('Error deleting comment:', error)
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
    if (!(event.target as HTMLElement).closest('.emoji-picker-container') && 
        !(event.target as HTMLElement).closest('.btn-emoji')) {
        this.showEmojiPicker = false;
    }
}

    showEmojis: boolean = false;// Ajoutez cette méthode pour gérer la sélection d'emoji

    onSelectEmojis(event: any): void {
      const emoji = event.emoji?.native;  // This should directly give you the emoji character
      if (emoji) {
        this.newCommentContent += emoji;  // Append the emoji to the comment content
      }
    }
    
}
