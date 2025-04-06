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
  selectedTypes: string[] = [];
  currentPage: number = 1;
  postsPerPage: number = 5;
  totalPages: number = 1;

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
        this.totalPages = Math.ceil(this.posts.length / this.postsPerPage);
        this.filteredPosts = this.paginatePosts();
        this.fetchUserNames();
        this.fetchCommentsCount();
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
  }

  paginatePosts(): Post[] {
    const start = (this.currentPage - 1) * this.postsPerPage;
    const end = start + this.postsPerPage;
    return this.posts.slice(start, end);
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
    const type = event.target.value;
    if (event.target.checked) {
      this.selectedTypes.push(type);
    } else {
      this.selectedTypes = this.selectedTypes.filter(cat => cat !== type);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.posts];

    // Filtrage par catégorie
    if (this.selectedTypes.length > 0) {
      filtered = filtered.filter(post => this.selectedTypes.includes(post.type));
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
    this.totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
  }

  formatCategory(category: string): string {
    if (!category) return '';
    return category
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  sortByDate(order: string): void {
    if (order === 'latest') {
      this.filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (order === 'oldest') {
      this.filteredPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  }

  sortByNumber(criteria: string): void {
    switch (criteria) {
      case 'mostLiked':
        this.filteredPosts.sort((a, b) => b.likes - a.likes);
        break;
      case 'mostCommented':
        this.filteredPosts.sort((a, b) => b.comments - a.comments);
        break;
    }
  }

  getCardColor(index: number): string {
    return index % 2 === 0 ? 'ligh-theme' : 'light-theme';
  }

  refreshPosts(): void {
    this.sortByDate('latest');
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filteredPosts = this.paginatePosts();
    }
  }
}
