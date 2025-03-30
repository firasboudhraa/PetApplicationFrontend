
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/models/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private apiUrl = 'http://localhost:8083/comments'; // Update with your comments service URL

  constructor(private http: HttpClient) { }

  // Get comments for a specific post
  getCommentsForPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?postId=${postId}`);
  }

  // Create a comment
  createComment(postId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, { postId, content });
  }
}
