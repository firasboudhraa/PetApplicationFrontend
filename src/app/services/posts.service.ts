import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/Post';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { UserDTO } from 'src/app/models/userDTO';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private fbAccessToken = environment.FACEBOOK_ACCESS_TOKEN;
  private fbApiUrl = `https://graph.facebook.com/me/feed`;
  private apiUrl = 'http://localhost:8082/posts';

  constructor(
    private http: HttpClient,
    private userService: UserService // ✅ Injected UserService
  ) {}

  // 🌐 Facebook status posting
  publishToFacebook(message: string): Observable<any> {
    const body = {
      message: message,
      access_token: this.fbAccessToken
    };
    return this.http.post(this.fbApiUrl, body);
  }

  // 📷 Facebook photo upload
  uploadPhotoToFacebook(imageUrl: string, caption: string): Observable<any> {
    const fbPhotoUploadUrl = `https://graph.facebook.com/me/photos`;
    const body = {
      url: imageUrl,
      caption: caption,
      access_token: this.fbAccessToken
    };
    return this.http.post(fbPhotoUploadUrl, body);
  }

  // ➕ Add a new post
  addPost(postData: any, userId: number): Observable<Post> {
    return new Observable<Post>((observer) => {
      this.http.post<Post>(`${this.apiUrl}/${userId}`, postData).subscribe({
        next: (createdPost) => {
          let title: string, content: string, type: string;

          if (postData instanceof FormData) {
            title = postData.get('title') as string;
            content = postData.get('content') as string;
            type = postData.get('type') as string;
          } else {
            title = postData.title;
            content = postData.content;
            type = postData.type;
          }

          if (type === 'lost_found') {
            const defaultImageUrl =
              'https://media.istockphoto.com/id/1226627799/vector/paper-ad-on-the-wall-about-the-missing-dog.jpg?s=612x612&w=0&k=20&c=R9NOIi9IE6dTuMuT0D2b7MMm92irRLNGf8k429aGwJw=';

            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-GB');

            this.userService.getUserById(userId).subscribe({
              next: (user: UserDTO) => {
                const userName = user.name;

                const message = `🚨 LOST PET ALERT 🚨

👤 Posted by: ${userName}
📌 Title: ${title}
📝 Description:
${content}

🗓 Date: ${formattedDate}

📍 Check our website for location details and more info!
🌐 furreverbuddy.com/blog`;

                this.uploadPhotoToFacebook(defaultImageUrl, message).subscribe({
                  next: () => observer.next(createdPost),
                  error: (fbErr: HttpErrorResponse) => {
                    console.error('Facebook photo upload failed', fbErr);
                    observer.next(createdPost);
                  }
                });
              },
              error: (err: HttpErrorResponse) => {
                console.error('Failed to fetch user for Facebook post', err);
                observer.next(createdPost);
              }
            });
          } else {
            observer.next(createdPost);
          }
        },
        error: (err: HttpErrorResponse) => observer.error(err)
      });
    });
  }

  // 🗑 Delete a post
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`);
  }

  // 🗑 Delete a post without email
  deletePostWithoutMail(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-without-mail/${postId}`);
  }

  // 🔍 Get post by ID
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // 🧡 Like a post
  likePost(postId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${postId}/like/${userId}`, {});
  }

  // 🔄 Update a post
  updatePost(postId: number, postData: FormData, userId: number): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${userId}/${postId}`, postData);
  }

  // 📚 Get all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }
}
