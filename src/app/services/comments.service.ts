import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/models/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8083/comments';

  constructor(private http: HttpClient) {}

  // Récupérer les commentaires d'un post
  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }

  // Créer un commentaire
  createComment(postId: number, userId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, { postId, userId, content });
  }
}
