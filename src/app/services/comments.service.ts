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

  // Obtenir les commentaires d'un post par son ID
  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }

  // Ajouter un nouveau commentaire
// comment.service.ts

addComment(postId: number, userId: number, commentData: { content: string }): Observable<Comment> {
  const url = `${this.apiUrl}/${postId}/${userId}`; // Utiliser l'URL avec postId et userId
  return this.http.post<Comment>(url, commentData);
}

likeComment(commentId: number, userId: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${commentId}/like/${userId}`, {});
}

// comment.service.ts

deleteComment(commentId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
}



}

