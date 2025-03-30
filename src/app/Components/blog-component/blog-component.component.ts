import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/Post';
import { UserService } from 'src/app/services/user.service';
import { UserDTO } from 'src/app/models/userDTO';

@Component({
  selector: 'app-blog-component',
  templateUrl: './blog-component.component.html',
  styleUrls: ['./blog-component.component.css']
})
export class BlogComponentComponent implements OnInit {
  posts: Post[] = [];  // Array to hold the posts
  userNames: Map<number, string> = new Map();  // Map to store user names
  searchText:string="";

  constructor(private postService: PostsService, private userService: UserService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  // Fetch all posts from the backend
  fetchPosts(): void {
    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data;  // Assign fetched posts to the array
        this.fetchUserNames();  // Fetch user names after posts are loaded
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
  }

  // Fetch user names for each post based on userId
  fetchUserNames(): void {
    this.posts.forEach(post => {
      // Fetch user by userId and map it to the userNames map
      this.userService.getUserById(post.userId).subscribe(
        (user: UserDTO) => {
          this.userNames.set(post.userId, user.name);  // Assuming user has a 'name' field
        },
        (error) => {
          console.error('Error fetching user by ID', error);
        }
      );
    });
  }
}
