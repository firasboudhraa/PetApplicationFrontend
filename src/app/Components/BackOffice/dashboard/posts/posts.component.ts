import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import { CommentService } from 'src/app/services/comments.service';
import { Post } from 'src/app/models/Post';
import { UserDTO } from 'src/app/models/userDTO';
import { Comment } from 'src/app/models/Comment';
import { EmailService } from 'src/app/services/email.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  authors: { [key: number]: UserDTO } = {};
  commentCounts: { [key: number]: number } = {};
  likeCounts: { [key: number]: number } = {};
  userNames: Map<number, string> = new Map();
  postComments: { [key: number]: Comment[] } = {}; // Store comments by post

  showConfirmModal: boolean = false; // Control the visibility of the confirmation modal
  selectedPostId: number | null = null; // Track the post ID to delete

  constructor(
    private postsService: PostsService,
    private userService: UserService,
    private commentService: CommentService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.loadPosts();
    setInterval(() => {
      this.loadPosts();
    }, 3000);
  }

  // Load posts and associated data
  loadPosts(): void {
    this.postsService.getPosts().subscribe(posts => {
      this.posts = posts;
  
      posts.forEach(post => {
        // Load the author for each post
        this.userService.getUserById(post.userId).subscribe(user => {
          this.authors[post.id] = user;
          this.userNames.set(post.userId, user.name);
        });
  
        // Load comments for each post
        this.commentService.getCommentsByPostId(post.id).subscribe(comments => {
          this.commentCounts[post.id] = comments.length;
          this.postComments[post.id] = comments;
  
          // For each comment, ensure the userName is populated
          comments.forEach(comment => {
            if (!this.userNames.has(comment.userId)) {
              this.userService.getUserById(comment.userId).subscribe(user => {
                this.userNames.set(comment.userId, user.name); // Set the username for this comment
              });
            }
          });
        });
  
        // Count the likes
        this.likeCounts[post.id] = post.likedBy?.length || 0;
      });
    });
  }
  

  // Open the confirmation modal for deleting a post
  openConfirmModal(postId: number): void {
    this.selectedPostId = postId;
    this.showConfirmModal = true;
  }

  // Cancel deletion and close the modal
  cancelDelete(): void {
    this.showConfirmModal = false;
    this.selectedPostId = null; // Reset selected post ID
  }

  isDeleted: boolean = false;
  isDeletedComment: boolean = false;

  // Confirm deletion and delete the post
  confirmDelete(): void {
    if (this.selectedPostId) {
      const postId = this.selectedPostId;
  
      // Close modal immediately for instant feedback
      this.showConfirmModal = false;
      this.selectedPostId = null;
      this.isDeleted = true;
  
      // Remove the post from the list (this avoids the need for page reload)
      this.posts = this.posts.filter(post => post.id !== postId);
  
      setTimeout(() => {
        this.isDeleted = false;
      }, 3000); // Hide notification after 3 seconds
  
      // Call the delete API
      this.postsService.deletePost(postId).subscribe(() => {
        console.log('Post deleted');
      }, error => {
        console.error('Error deleting post', error);
      });
    }
  }
  
  
  
  
  // Delete comment method
  deleteComment(commentId: number, postId: number): void {
      this.commentService.deleteComment(commentId).subscribe(() => {
        // Filter the deleted comment out from the list
        this.postComments[postId] = this.postComments[postId].filter(c => c.id !== commentId);
        this.commentCounts[postId] = this.postComments[postId].length;
        this.isDeletedComment = true;
  
        // Only close the popup if necessary (remove this line if you want to keep it open)
        // this.selectedPostId = null;  // Optional: Remove this line to keep the comment popup open
  
        // Hide the notification after 3 seconds
        setTimeout(() => {
          this.isDeletedComment = false;
        }, 3000); 
      });
    }
  
  
  

  // Method to handle opening comment popup
  openCommentsPopup(postId: number): void {
    if (this.showConfirmModal) {
      return;  // Prevent opening the comment popup if the delete modal is open
    }

    this.selectedPostId = postId;
  }

  // Open the confirmation modal for deleting a post
  deletePost(postId: number): void {
    // Open the confirmation modal when deleting
    this.openConfirmModal(postId);
  }

  // Close comment popup
  closePopup(): void {
    this.selectedPostId = null;
  }
}
