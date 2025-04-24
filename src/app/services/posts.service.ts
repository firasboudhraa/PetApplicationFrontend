  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Post } from 'src/app/models/Post'; // Adjust the import path as necessary
import { environment } from 'src/environments/environment';

  @Injectable({
    providedIn: 'root'
  })
  export class PostsService {
    
    private fbAccessToken = environment.FACEBOOK_ACCESS_TOKEN;
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
      const fbPhotoUploadUrl = `https://graph.facebook.com/me/photos`;
    
      const body = {
        url: imageUrl,
        caption: caption,
        access_token: this.fbAccessToken
      };
    
      return this.http.post(fbPhotoUploadUrl, body);
    }
    
    
    addPost(postData: any, userId: number): Observable<Post> {
      return new Observable<Post>((observer) => {
        this.http.post<Post>(`${this.apiUrl}/${userId}`, postData).subscribe({
          next: (createdPost) => {
            let title: any, content: any, imageUrl: any, type: any;
    
            if (postData instanceof FormData) {
              title = postData.get('title');
              content = postData.get('content');
              imageUrl = postData.get('image'); // Note: use 'image', not 'imageUrl'
              type = postData.get('type');
            } else {
              title = postData.title;
              content = postData.content;
              imageUrl = postData.imageUrl;
              type = postData.type;
            }
    
            // Only proceed to Facebook if it's a Lost & Found post
            if (type === 'lost_found') {
              const defaultImageUrl = 'https://media.istockphoto.com/id/1226627799/vector/paper-ad-on-the-wall-about-the-missing-dog.jpg?s=612x612&w=0&k=20&c=R9NOIi9IE6dTuMuT0D2b7MMm92irRLNGf8k429aGwJw='; // Replace with your actual public image URL
              const message = `📝 ${title}\n\n${content}\n📍 Check our website for full details (Pet image & last seen !)`;
    
              this.uploadPhotoToFacebook(defaultImageUrl, message).subscribe({
                next: () => observer.next(createdPost),
                error: (fbErr) => {
                  console.error('Facebook upload failed:', fbErr);
                  observer.next(createdPost); // Proceed anyway
                }
              });
            } else {
              observer.next(createdPost); // No Facebook publishing for other types
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
