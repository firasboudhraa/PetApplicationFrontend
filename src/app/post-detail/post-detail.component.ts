import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import { CommentService } from 'src/app/services/comments.service';
import { Post } from 'src/app/models/Post';
import { Comment } from 'src/app/models/Comment';
import { UserDTO } from 'src/app/models/userDTO';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  authorName: string = 'Unknown';
  comments: Comment[] = [];
  commentAuthors: Map<number, string> = new Map(); // Stocker les auteurs des commentaires

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private userService: UserService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));

    if (postId) {
      // 🔹 Récupération du post
      this.postService.getPostById(postId).subscribe((post: Post) => {
        if (post) {
          this.post = post;

          // 🔹 Récupération du nom de l'auteur du post
          this.userService.getUserById(post.userId).subscribe((user: UserDTO) => {
            this.authorName = user.name;
          });

          // 🔹 Récupération des commentaires
          this.commentService.getCommentsByPostId(postId).subscribe((comments: Comment[]) => {
            this.comments = comments;
            this.fetchCommentAuthors(); // Récupérer les noms des auteurs des commentaires
          });
        }
      });
    }
  }

  // 🔹 Récupération des noms des auteurs des commentaires
  fetchCommentAuthors(): void {
    this.comments.forEach(comment => {
      this.userService.getUserById(comment.userId).subscribe(
        (user: UserDTO) => {
          this.commentAuthors.set(comment.userId, user.name);
        },
        (error) => {
          console.error('Erreur lors de la récupération de l’auteur du commentaire', error);
        }
      );
    });
  }
}
