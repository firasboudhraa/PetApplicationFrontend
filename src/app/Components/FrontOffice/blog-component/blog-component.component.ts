import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/Services/posts.service';
import { Post } from 'src/app/models/Post';
import { UserService } from 'src/app/Services/user.service';
import { UserDTO } from 'src/app/models/userDTO';
import { CommentService } from 'src/app/Services/comments.service';

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
  showFilterDropdown = false;

  categories = [
    { label: 'Help & Advice', value: 'HELP_ADVICE' },
    { label: 'Lost & Found', value: 'LOST_FOUND' },
    { label: 'Success Stories', value: 'SUCCESS_STORIES' }
  ];

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
        this.applyFilters(); // Apply filters after fetching the posts
        this.fetchUserNames();
        this.fetchCommentsCount();
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
  }

  // This method is updated to apply filters and pagination together
  applyFilters(): void {
    let filtered = [...this.posts];

    // Filter by category
    if (this.selectedTypes.length > 0) {
      filtered = filtered.filter(post => this.selectedTypes.includes(post.type));
    }

    // Filter by search text
    if (this.searchText.trim() !== '') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        post.type.toLowerCase().includes(this.searchText.toLowerCase()) ||
        post.content.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (this.userNames.has(post.userId) && this.userNames.get(post.userId)?.toLowerCase().includes(this.searchText.toLowerCase()))
      );
    }

    this.filteredPosts = filtered;
    this.totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    this.currentPage = 1; // Reset to the first page when filters change
    this.paginatePosts(); // Apply pagination after filters are applied
  }

  // Paginate posts based on the current page
  paginatePosts(): void {
    const start = (this.currentPage - 1) * this.postsPerPage;
    const end = start + this.postsPerPage;
    this.filteredPosts = this.filteredPosts.slice(start, end); // Slice based on current page
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
    this.applyFilters(); // Reapply filters when categories change
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
    this.filteredPosts = [...this.filteredPosts]; // Force re-rendering after sorting
    this.paginatePosts(); // Reapply pagination after sorting
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
    this.filteredPosts = [...this.filteredPosts]; // Force re-rendering after sorting
    this.paginatePosts(); // Reapply pagination after sorting
  }

  getCardColor(index: number): string {
    return index % 2 === 0 ? 'light-theme' : 'dark-theme'; // Just a sample card color alternation
  }

  refreshPosts(): void {
    this.sortByDate('latest');
  }

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  applyFilter(filter: string): void {
    this.showFilterDropdown = false;
    switch (filter) {
      case 'latest':
        this.sortByDate('latest');
        break;
      case 'oldest':
        this.sortByDate('oldest');
        break;
      case 'mostLiked':
        this.sortByNumber('mostLiked');
        break;
      case 'mostCommented':
        this.sortByNumber('mostCommented');
        break;
      default:
        break;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginatePosts(); // Reapply pagination when changing page
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
