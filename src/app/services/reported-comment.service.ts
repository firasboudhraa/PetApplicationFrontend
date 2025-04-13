// reported-comments.service.ts
import { Injectable } from '@angular/core';
import { Comment } from 'src/app/models/Comment';

@Injectable({
  providedIn: 'root'
})
export class ReportedCommentsService {
  private reportedCommentsSet: Set<Comment> = new Set<Comment>();

  // Ajouter un commentaire signalé
  addReportedComment(comment: Comment): void {
    this.reportedCommentsSet.add(comment);
  }

  // Récupérer tous les commentaires signalés
  getReportedComments(): Comment[] {
    return Array.from(this.reportedCommentsSet);
  }

  // Supprimer un commentaire signalé
  removeReportedComment(comment: Comment): void {
    this.reportedCommentsSet.delete(comment);

  }

   // Check if a comment is already reported
   has(comment: Comment): boolean {
    return this.reportedCommentsSet.has(comment);
  }

  // Add a comment to the reported set
  add(comment: Comment): void {
    this.reportedCommentsSet.add(comment);
  }


}
