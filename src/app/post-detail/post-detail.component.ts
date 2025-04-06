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
  commentAuthors: Map<number, string> = new Map();
  userNames: Map<number, string> = new Map();
  showLikesPopup: boolean = false;
  newCommentContent: string = ''; 
  userId: number = 2; // Remplacer par la récupération dynamique de l'ID utilisateur

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private userService: UserService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      this.loadPost(postId);
    }
  }

  /**
   * Charge les données du post, les commentaires et les auteurs.
   */
  private loadPost(postId: number): void {
    this.postService.getPostById(postId).subscribe(
      (post: Post) => {
        if (post) {
          this.post = post;
          this.loadPostAuthor(post.userId);
          this.loadComments(postId);
          this.loadLikes(post.likedBy);
        }
      },
      (error) => console.error('Erreur lors du chargement du post:', error)
    );
  }

  /**
   * Charge l'auteur du post.
   */
  private loadPostAuthor(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (user: UserDTO) => {
        this.authorName = user.name;
      },
      (error) => console.error('Erreur lors du chargement de l\'auteur du post:', error)
    );
  }

  /**
   * Charge les commentaires et leurs auteurs.
   */
  private loadComments(postId: number): void {
    this.commentService.getCommentsByPostId(postId).subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
        this.loadCommentAuthors();
      },
      (error) => console.error('Erreur lors du chargement des commentaires:', error)
    );
  }

  /**
   * Charge les noms des utilisateurs ayant commenté.
   */
  private loadCommentAuthors(): void {
    this.comments.forEach(comment => {
      if (!this.commentAuthors.has(comment.userId)) {
        this.userService.getUserById(comment.userId).subscribe(
          (user: UserDTO) => {
            this.commentAuthors.set(comment.userId, user.name);
          },
          (error) => console.error('Erreur lors du chargement de l\'auteur du commentaire:', error)
        );
      }
    });
  }

  /**
   * Charge les noms des utilisateurs ayant aimé le post.
   */
  private loadLikes(userIds: number[]): void {
    userIds.forEach(userId => {
      if (!this.userNames.has(userId)) {
        this.userService.getUserById(userId).subscribe(
          (user: UserDTO) => {
            this.userNames.set(userId, user.name);
          },
          (error) => console.error('Erreur lors du chargement des utilisateurs ayant aimé le post:', error)
        );
      }
    });
  }

  /**
   * Ajoute un nouveau commentaire au post.
   */
  addComment(): void {
    if (this.newCommentContent.trim()) {
      const commentData = { content: this.newCommentContent };

      console.log("Ajout du commentaire:", commentData);

      this.commentService.addComment(this.post?.id ?? 0, this.userId, commentData).subscribe(
        (response) => {
          this.comments.push(response); // Ajouter le commentaire à la liste
          this.commentAuthors.set(response.userId, "Vous"); // Afficher directement l'auteur
          this.newCommentContent = '';  // Réinitialiser l'input
        },
        (error) => console.error('Erreur lors de l\'ajout du commentaire:', error)
      );
    }
  }

  /**
   * Like un commentaire.
   */
  likeComment(commentId: number): void {
    this.commentService.likeComment(commentId, this.userId).subscribe(
      () => {
        // Après avoir liké, rechargez les commentaires pour mettre à jour le nombre de likes
        this.loadComments(this.post?.id ?? 0);
      },
      (error) => console.error('Erreur lors du like du commentaire:', error)
    );
  }

  /**
   * Affiche ou masque la popup des likes.
   */
  toggleLikesPopup(): void {
    this.showLikesPopup = !this.showLikesPopup;
  }

  
  likePost(postId: number): void {
    const userId = this.userId; // userId=1 pour le moment
    this.postService.likePost(postId, userId).subscribe({
      next: () => {
        this.loadPost(postId); // recharger depuis le backend
      },
      error: (err) => {
        console.error('Erreur lors du like du post :', err);
      }
    });
  }
  
  
}
