import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/Post'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private apiUrl = 'http://localhost:8082/posts'; // Update with your posts service URL

  constructor(private http: HttpClient) { }

  // Get all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // Get a specific post by ID
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }
  
  likePost(postId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${postId}/like/${userId}`, {});
  }
  
  

  addPost(postData: any, userId: number): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${userId}`, postData);
  }
  
}
