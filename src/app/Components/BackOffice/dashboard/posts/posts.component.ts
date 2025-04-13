import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import { CommentService } from 'src/app/services/comments.service';
import { Post } from 'src/app/models/Post';
import { UserDTO } from 'src/app/models/userDTO';
import { Comment } from 'src/app/models/Comment';

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
  postComments: { [key: number]: Comment[] } = {}; // Stocker les commentaires par post

  constructor(
    private postsService: PostsService,
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  // Chargement des posts et de leurs données associées
  loadPosts(): void {
    this.postsService.getPosts().subscribe(posts => {
      this.posts = posts;

      posts.forEach(post => {
        // Charger l'auteur
        this.userService.getUserById(post.userId).subscribe(user => {
          this.authors[post.id] = user;
          this.userNames.set(post.userId, user.name);
        });

        // Charger les commentaires pour chaque post
        this.commentService.getCommentsByPostId(post.id).subscribe(comments => {
          this.commentCounts[post.id] = comments.length;
          this.postComments[post.id] = comments;
        });

        // Compter les likes
        this.likeCounts[post.id] = post.likedBy?.length || 0;
      });
    });
  }

  // Méthode pour supprimer un post
  deletePost(postId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.postsService.deletePost(postId).subscribe(() => {
        this.posts = this.posts.filter(p => p.id !== postId);
        delete this.postComments[postId];
        delete this.commentCounts[postId];
        delete this.likeCounts[postId];  // Ne pas oublier de supprimer les likes également
      });
    }
  }

  // Méthode pour supprimer un commentaire
  deleteComment(commentId: number, postId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.commentService.deleteComment(commentId).subscribe(() => {
        this.postComments[postId] = this.postComments[postId].filter(c => c.id !== commentId);
        this.commentCounts[postId] = this.postComments[postId].length;
      });
    }
  }
}
