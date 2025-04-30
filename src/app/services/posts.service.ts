import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/Post';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/Components/FrontOffice/user/service_user/user.service';
import { User } from '../Components/FrontOffice/user/models/user_model';

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
  
          let postedUrl: string;
  
          // If the post type is 'lost_found' or 'help_advice', publish it on Facebook
          if (type === 'lost_found' || type === 'help_advice') {
            const defaultImageUrl =
              'https://media.istockphoto.com/id/1226627799/vector/paper-ad-on-the-wall-about-the-missing-dog.jpg?s=612x612&w=0&k=20&c=R9NOIi9IE6dTuMuT0D2b7MMm92irRLNGf8k429aGwJw=';
            const helpImageUrl = 'https://img.freepik.com/vecteurs-libre/mains-personnes-tenant-pancartes-aide-personnes-signes-demandant-aide-dons-illustration-vectorielle-plane-soutien-assistance-concept-caritatif-pour-banniere-conception-sites-web-page-web-destination_74855-26040.jpg?semt=ais_hybrid&w=740';
  
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-GB');
  
            this.userService.getUserById(userId).subscribe({
              next: (user: User) => {
                const userName = user.firstName + ' ' + user.lastName;
  
                // Set the appropriate message prefix based on post type
                let messagePrefix = '';
                if (type === 'lost_found') {
                  messagePrefix = '🚨 LOST PET ALERT 🚨';
                  postedUrl = defaultImageUrl;
                } else if (type === 'help_advice') {
                  messagePrefix = '🚨 SEEKING HELP ALERT 🚨';
                  postedUrl = helpImageUrl;
                }
  
                const message = `${messagePrefix}
  
  👤 Posted by: ${userName}
  📌 Title: ${title}
  📝 Description:
  ${content}
  
  🗓 Date: ${formattedDate}
  
  📍 Check our website for location details and more info!
  🌐 FurreverBuddy.com/blog`;
  
                // Upload to Facebook with the correct image URL
                this.uploadPhotoToFacebook(postedUrl, message).subscribe({
                  next: () => observer.next(createdPost),
                  error: (fbErr: HttpErrorResponse) => {
                    console.error('Facebook photo upload failed', fbErr);
                    observer.next(createdPost); // Proceed even if FB fails
                  }
                });
              },
              error: (err: HttpErrorResponse) => {
                console.error('Failed to fetch user for Facebook post', err);
                observer.next(createdPost); // Proceed even if user fetch fails
              }
            });
          } else {
            // If it's any other type, just return the post normally (no Facebook)
            observer.next(createdPost);
          }
        },
        error: (err: HttpErrorResponse) => observer.error(err)
      });
    });
  }
  
  
  // 🗑 Delete a post
  deletePost(postId: number, title: string, firstName: string, email: string): Observable<any> {
    const params = new HttpParams()
      .set('title', title)
      .set('firstName', firstName)
      .set('email', email);
  
    return this.http.delete(`${this.apiUrl}/${postId}`, { params });
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
  // 🚩 Report a post
reportPost(postId: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${postId}/report`, {});
}

}
