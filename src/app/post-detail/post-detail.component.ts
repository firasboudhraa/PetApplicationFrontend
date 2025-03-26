import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  post: any;
  userAvatar: string = 'https://bootdey.com/img/Content/avatar/avatar7.png';  // Replace with actual user avatar

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');  // Fetch the post ID from the URL
    // Fetch post details from a service or mock data
    this.post = this.getPostDetail(1);  // You will replace this with a real service call
  }

  getPostDetail(postId: number): any {
    // Here you can fetch the post from an API or use mock data for now
    return {
      imageUrl: 'https://www.bootdey.com/image/400x150/FFB6C1/000000',
      author: 'Alexis Clark',
      authorAvatar: 'https://bootdey.com/img/Content/avatar/avatar6.png',
      timeAgo: '3 mins ago',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      likes: 13,
      dislikes: 0,
      comments: [
        { author: 'Diana', text: 'Lorem ipsum dolor sit amet...', avatar: 'https://bootdey.com/img/Content/avatar/avatar7.png' },
        { author: 'John', text: 'Sed do eiusmod tempor incididunt...', avatar: 'https://bootdey.com/img/Content/avatar/avatar1.png' }
      ]
    };
  }
}
