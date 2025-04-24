import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/Post'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  
private fbAccessToken = '${environments/environment.FACEBOOK_ACCESS_TOKEN}'; 
private fbApiUrl = `https://graph.facebook.com/me/feed`;


  private apiUrl = 'http://localhost:8082/posts'; // Update with your posts service URL

  constructor(private http: HttpClient) { }
//facebook 
publishToFacebook(message: string): Observable<any> {
  const body = {
    message: message,
    access_token: this.fbAccessToken
  };
  return this.http.post(this.fbApiUrl, body);
}

  // Get all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }
  // addPost(postData: any, userId: number): Observable<Post> {
  //   return this.http.post<Post>(`${this.apiUrl}/${userId}`, postData);
  // }
  uploadPhotoToFacebook(imageUrl: string, caption: string): Observable<any> {
    const body = {
      url: imageUrl, // This must be a public URL
      caption: caption,
      access_token: this.fbAccessToken
    };
    return this.http.post(this.apiUrl, body);
  }
  
  addPost(postData: any, userId: number): Observable<Post> {
    return new Observable<Post>((observer) => {
      this.http.post<Post>(`${this.apiUrl}/${userId}`, postData).subscribe({
        next: (createdPost) => {
          const message = `📝 ${postData.title}\n\n${postData.content}`;
          const imageUrl = postData.imageUrl; // Must be a PUBLIC URL
  
          if (imageUrl) {
            this.uploadPhotoToFacebook(imageUrl, message).subscribe({
              next: () => observer.next(createdPost),
              error: (fbErr) => {
                console.error('Facebook photo upload failed', fbErr);
                observer.next(createdPost);
              }
            });
          } else {
            this.publishToFacebook(message).subscribe({
              next: () => observer.next(createdPost),
              error: (fbErr) => {
                console.error('Facebook text post failed', fbErr);
                observer.next(createdPost);
              }
            });
          }
        },
        error: (err) => observer.error(err)
      });
    });
  }
  
  
  
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`); // Just delete the post
  }
  deletePostWithoutMail(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-without-mail/${postId}`);
   } // Delete the post without sending an email
  
  
  // Get a specific post by ID
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }
  
  likePost(postId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${postId}/like/${userId}`, {});
  }
  
  

  // addPost(postData: any, userId: number): Observable<Post> {
  //   return this.http.post<Post>(`${this.apiUrl}/${userId}`, postData);
  // }
  
  updatePost(postId: number, postData: FormData, userId: number): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${userId}/${postId}`, postData);
  }
  
}
