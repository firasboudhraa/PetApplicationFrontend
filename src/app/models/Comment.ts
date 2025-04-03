// src/app/models/comment.model.ts

export interface Comment {
    id: number;           // Unique identifier for the comment
    postId: number;       // ID of the post this comment belongs to
    content: string;      // Content of the comment
    author: string;       // Author of the comment
    createdAt: Date,
    userId :number;    // Creation timestamp (can be a string or Date object)
    likes:number;
    likedBy: any[]
  }
  