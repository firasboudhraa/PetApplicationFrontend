import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from '../models/Post';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: any;
  userAvatar: string = 'assets/default-avatar.png'; // Replace with actual user avatar URL

  constructor(private route: ActivatedRoute, private postService: PostsService) {}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id')); // Convert string to number
    if (postId) {
      this.postService.getPostById(postId).subscribe(data => {
        this.post = data;
      });
    }
  }
}
