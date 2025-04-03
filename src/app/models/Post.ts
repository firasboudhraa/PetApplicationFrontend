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
  comments: number;  // Nombre de commentaires
  commentList: Comment[];  // Liste des commentaires

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
    commentList: Comment[] = []  // Initialisation de la liste des commentaires
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
    this.commentList = commentList;  // Initialisation de la liste des commentaires
  }
}
