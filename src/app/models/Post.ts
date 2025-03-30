export class Post {
  id: number;
  title: string;
  content: string;
  likes: number;
  createdAt: string;
  imageUrl: string;
  type: string;
  userId: number;
  likedBy: any[];
  comments: number;  // Add this field to track the number of comments

  constructor(id: number, title: string, content: string, likes: number, createdAt: string, imageUrl: string, type: string, userId: number, likedBy: any[], comments: number) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.likes = likes;
    this.createdAt = createdAt;
    this.imageUrl = imageUrl;
    this.type = type;
    this.userId = userId;
    this.likedBy = likedBy;
    this.comments = comments;
  }
}
