import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import { CommentService } from 'src/app/services/comments.service';
import { Post } from 'src/app/models/Post';
import { UserDTO } from 'src/app/models/userDTO';
import { Comment } from 'src/app/models/Comment';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  // Existing properties
  posts: Post[] = [];
  authors: { [key: number]: UserDTO } = {};
  commentCounts: { [key: number]: number } = {};
  likeCounts: { [key: number]: number } = {};
  userNames: Map<number, string> = new Map();
  postComments: { [key: number]: Comment[] } = {};
  showConfirmModal = false;
  showConfirmModalComment = false;
  selectedCommentId: number | null = null;


  selectedPostId: number | null = null;
  isDeleted = false;
  isDeletedComment = false;

  // Chart properties
  showCharts = false;
  activityChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Posts', backgroundColor: '#3f51b5' },
      { data: [], label: 'Comments', backgroundColor: '#ff4081' }
    ]
  };
  activityChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };
  activityChartType: ChartType = 'bar';

  contributorsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Posts', backgroundColor: '#4caf50' }
    ]
  };
  contributorsChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true
  };

  typeChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
  };
  typeChartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  constructor(
    private postsService: PostsService,
    private userService: UserService,
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    setInterval(() => this.loadPosts(), 3000);
  }

  toggleCharts(): void {
    this.showCharts = !this.showCharts;
    if (this.showCharts) this.updateCharts();
  }

  loadPosts(): void {
    this.postsService.getPosts().subscribe(posts => {
      this.posts = posts;
      if (this.showCharts) this.updateCharts();

      posts.forEach(post => {
        this.userService.getUserById(post.userId).subscribe(user => {
          this.authors[post.id] = user;
          this.userNames.set(post.userId, user.name);
        });

        this.commentService.getCommentsByPostId(post.id).subscribe({
          next: (comments) => {
            this.postComments[post.id] = comments || [];
            this.commentCounts[post.id] = this.postComments[post.id].length;
            
            comments.forEach(comment => {
              if (!this.userNames.has(comment.userId)) {
                this.userService.getUserById(comment.userId).subscribe(user => {
                  this.userNames.set(comment.userId, user.name);
                });
              }
            });
          },
          error: () => {
            this.postComments[post.id] = [];
            this.commentCounts[post.id] = 0;
          }
        });

        this.likeCounts[post.id] = post.likedBy?.length || 0;
      });
    });
  }

  updateCharts(): void {
    this.updateActivityChart();
    this.updateContributorsChart();
    this.updateTypeChart();
  }

  private updateActivityChart(): void {
    const dates = this.getLast7Days();
    const postCounts = new Array(7).fill(0);
    const commentCounts = new Array(7).fill(0);

    this.posts.forEach(post => {
      const dayIndex = this.getDayIndex(new Date(post.createdAt), dates);
      if (dayIndex !== -1) postCounts[dayIndex]++;
    });

    Object.values(this.postComments).flat().forEach(comment => {
      const dayIndex = this.getDayIndex(new Date(comment.createdAt), dates);
      if (dayIndex !== -1) commentCounts[dayIndex]++;
    });

    this.activityChartData = {
      labels: dates.map(d => d.toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [
        { ...this.activityChartData.datasets[0], data: postCounts },
        { ...this.activityChartData.datasets[1], data: commentCounts }
      ]
    };
  }

  private updateContributorsChart(): void {
    const userPostCounts = new Map<number, number>();
    this.posts.forEach(post => {
      userPostCounts.set(post.userId, (userPostCounts.get(post.userId) || 0) + 1);
    });

    const sorted = [...userPostCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.contributorsChartData = {
      labels: sorted.map(([userId]) => this.userNames.get(userId) || `User ${userId}`),
      datasets: [{
        ...this.contributorsChartData.datasets[0],
        data: sorted.map(([_, count]) => count)
      }]
    };
  }

  private updateTypeChart(): void {
    const typeCounts = new Map<string, number>();
    this.posts.forEach(post => {
      typeCounts.set(post.type, (typeCounts.get(post.type) || 0) + 1);
    });

    this.typeChartData = {
      labels: [...typeCounts.keys()],
      datasets: [{
        ...this.typeChartData.datasets[0],
        data: [...typeCounts.values()]
      }]
    };
  }

  private getLast7Days(): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return new Date(date.setHours(0, 0, 0, 0));
    });
  }

  private getDayIndex(date: Date, dates: Date[]): number {
    return dates.findIndex(d => d.toDateString() === date.toDateString());
  }

  // Rest of your existing methods...
  openConfirmModal(postId: number): void {
    this.selectedPostId = postId;
    this.showConfirmModal = true;
  }
  openConfirmModalComment(postId: number): void {
    this.selectedPostId = postId;
    this.showConfirmModal = true;
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.selectedPostId = null;
  }
  cancelDeleteComment(): void {
    this.showConfirmModalComment = false;
  }

  confirmDelete(): void {
    if (this.selectedPostId) {
      const postId = this.selectedPostId;
      this.showConfirmModal = false;
      this.isDeleted = true;
      this.posts = this.posts.filter(post => post.id !== postId);
      
      setTimeout(() => this.isDeleted = false, 3000);
      this.postsService.deletePost(postId).subscribe(
        () => console.log('Post deleted'),
        error => console.error('Error deleting post', error)
      );
    }
  }

  confirmDeleteComment(commentId: number, postId: number): void {
    this.commentService.deleteComment(commentId).subscribe(
      () => {
        this.postComments[postId] = this.postComments[postId].filter(c => c.id !== commentId);
        this.commentCounts[postId] = this.postComments[postId].length;
        this.isDeletedComment = true;
        setTimeout(() => this.isDeletedComment = false, 3000);
        this.showConfirmModalComment = false;

      },
      error => console.error('Error deleting comment', error)
    );
  }

  openCommentsPopup(postId: number): void {
    if (!this.showConfirmModal) this.selectedPostId = postId;
  }

  deletePost(postId: number): void {
    this.openConfirmModal(postId);
  }

  deleteComment(commentId: number, postId: number): void {
    this.selectedCommentId = commentId;
    this.selectedPostId = postId;
    this.showConfirmModalComment = true;
  }
  

  closePopup(): void {
    this.selectedPostId = null;
  }

  generatePdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('List of Posts and Comments', 10, 10);
    let yPosition = 20;
  
    this.posts.forEach(post => {
      // Title Section (Post Title in Bold)
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Post #${post.id}: ${post.title}`, 10, yPosition);
      yPosition += 10;
  
      // Type, Likes, Comments
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Type: ${post.type}`, 10, yPosition);
      doc.text(`Likes: ${this.likeCounts[post.id] || 0}`, 100, yPosition);
      doc.text(`Comments: ${this.commentCounts[post.id] || 0}`, 150, yPosition);
      yPosition += 10;
  
      // Content Section with better spacing
      if (post.content) {
        const splitText = doc.splitTextToSize(post.content, 180);
        doc.setFontSize(12);
        doc.text(splitText, 10, yPosition);
        yPosition += splitText.length * 7 + 10; // Extra padding
      }
  
   
      // Comments Section
      const comments = this.postComments[post.id] || [];
      if (comments.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Comments:', 10, yPosition);
        yPosition += 10;
  
        comments.forEach(comment => {
          // Comment Section with Indentation
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          const userName = this.userNames.get(comment.userId) || 'Anonymous';
          const commentText = `${userName}: ${comment.content}`;
  
          const splitComment = doc.splitTextToSize(commentText, 180);
          doc.text(splitComment, 15, yPosition);  // Indented comments
          yPosition += splitComment.length * 7 + 5; // Extra padding after comment
        });
      } else {
        // If no comments, display this text
        doc.setFontSize(12);
        doc.text('No comments available for this post.', 10, yPosition);
        yPosition += 10;
      }
  
      // Add extra space after each post for clean separation
      yPosition += 5;
         // Adding a dark, bold line for separation after post content (only between posts)
         doc.setDrawColor(0); // Set to black for a dark line
         doc.setLineWidth(1.5); // Bold line width
         doc.line(10, yPosition, 200, yPosition); // Draw the line
         yPosition += 15; // Add space after the line
     
  
      // Check if yPosition exceeds page height and add new page if necessary
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
  
    // Save the document as a PDF file
    doc.save('Blog-Posts&Comments.pdf');
  }

  


}  