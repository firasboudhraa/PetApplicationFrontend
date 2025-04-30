export class Post {
  id: number;
  title: string;
  content: string;
  likes: number;
  createdAt: Date = new Date();
  imageUrl: string;
  type: string;
  userId: number;
  likedBy: any[];
  comments: number;
  commentList: Comment[] = [];
  latitude: number;  // Latitude pour la carte
  longitude: number; // Longitude pour la carte
  reported?: boolean; // Optional: use `?` if it might not always be returned


  constructor(
    id: number,
    title: string,
    content: string,
    likes: number,
    imageUrl: string,
    type: string,
    userId: number,
    likedBy: any[],
    comments: number,
    commentList: Comment[] = [],
    latitude: number,  // Latitude pour la carte
    longitude: number  // Longitude pour la carte
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.likes = likes;
    this.imageUrl = imageUrl;
    this.type = type;
    this.userId = userId;
    this.likedBy = likedBy;
    this.comments = comments;
    this.commentList = commentList;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
