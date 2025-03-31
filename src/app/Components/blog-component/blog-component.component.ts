import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/Post';
import { UserService } from 'src/app/services/user.service';
import { UserDTO } from 'src/app/models/userDTO';
import { CommentService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-blog-component',
  templateUrl: './blog-component.component.html',
  styleUrls: ['./blog-component.component.css']
})
export class BlogComponentComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  userNames: Map<number, string> = new Map();
  searchText: string = "";
  selectedCategories: string[] = [];

  constructor(
    private postService: PostsService,
    private userService: UserService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data;
        this.filteredPosts = [...data];
        this.fetchUserNames();
        this.fetchCommentsCount();
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
  }

  fetchUserNames(): void {
    this.posts.forEach(post => {
      this.userService.getUserById(post.userId).subscribe(
        (user: UserDTO) => {
          this.userNames.set(post.userId, user.name);
        },
        (error) => {
          console.error('Error fetching user by ID', error);
        }
      );
    });
  }

  fetchCommentsCount(): void {
    this.posts.forEach(post => {
      this.commentService.getCommentsByPostId(post.id).subscribe(
        (comments) => {
          post.comments = comments.length;
        },
        (error) => {
          console.error('Error fetching comments', error);
        }
      );
    });
  }

  updateSelectedCategories(event: any): void {
    const category = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.posts];

    // Filtrage par catégorie
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(post => this.selectedCategories.includes(post.type.toLowerCase()));
    }

    // Filtrage par recherche texte
    if (this.searchText.trim() !== '') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        post.type.toLowerCase().includes(this.searchText.toLowerCase()) ||
        post.content.toLowerCase().includes(this.searchText.toLowerCase()) ||
        this.userNames.get(post.userId)?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredPosts = filtered;
  }
}
