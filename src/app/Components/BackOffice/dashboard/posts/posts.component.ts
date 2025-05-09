import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/Services/posts.service';
import { UserService } from 'src/app/Components/FrontOffice/user/service_user/user.service';
import { CommentService } from 'src/app/Services/comments.service';
import { Post } from 'src/app/models/Post';
import { Comment } from 'src/app/models/Comment';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { User } from 'src/app/Components/FrontOffice/user/models/user_model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  authors: { [key: number]: User } = {};
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
  isGeneratingPdf = false;

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
    setTimeout(() => {
      this.showCharts ? this.scrollToStatistics() : this.scrollToTop();
    }, 0);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToStatistics(): void {
    document.getElementById('statisticsSection')?.scrollIntoView({ behavior: 'smooth' });
  }

  loadPosts(): void {
    this.postsService.getPosts().subscribe(posts => {
      this.posts = posts;
      if (this.showCharts) this.updateCharts();

      posts.forEach(post => {
        // Load author data
        if (!this.authors[post.id]) {
          this.userService.getUserById(post.userId).subscribe(user => {
            this.authors[post.id] = user;
            this.userNames.set(post.userId, user.firstName + ' ' + user.lastName);
          });
        }

        // Load comments
        this.commentService.getCommentsByPostId(post.id).subscribe({
          next: comments => {
            this.postComments[post.id] = comments || [];
            this.commentCounts[post.id] = comments.length;

            comments.forEach(comment => {
              if (!this.userNames.has(comment.userId)) {
                this.userService.getUserById(comment.userId).subscribe(user => {
                  this.userNames.set(comment.userId, user.firstName + ' ' + user.lastName);
                });
              }
            });
          },
          error: () => {
            this.postComments[post.id] = [];
            this.commentCounts[post.id] = 0;
          }
        });

        // Likes
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
      const index = this.getDayIndex(new Date(post.createdAt), dates);
      if (index !== -1) postCounts[index]++;
    });

    Object.values(this.postComments).flat().forEach(comment => {
      const index = this.getDayIndex(new Date(comment.createdAt), dates);
      if (index !== -1) commentCounts[index]++;
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

    const topContributors = [...userPostCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.contributorsChartData = {
      labels: topContributors.map(([id]) => this.userNames.get(id) || `User ${id}`),
      datasets: [{
        ...this.contributorsChartData.datasets[0],
        data: topContributors.map(([_, count]) => count)
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
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return new Date(d.setHours(0, 0, 0, 0));
    });
  }

  private getDayIndex(date: Date, dates: Date[]): number {
    return dates.findIndex(d => d.toDateString() === date.toDateString());
  }

  openConfirmModal(postId: number): void {
    this.selectedPostId = postId;
    this.showConfirmModal = true;
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.selectedPostId = null;
  }

  confirmDelete(): void {
    if (this.selectedPostId) {
      const postId = this.selectedPostId;
      this.posts = this.posts.filter(post => post.id !== postId);
      this.isDeleted = true;
      this.showConfirmModal = false;

      setTimeout(() => this.isDeleted = false, 3000);

      this.postsService.deletePost(postId).subscribe({
        next: () => console.log('Post deleted'),
        error: err => console.error('Delete post failed:', err)
      });
    }
  }

  openCommentsPopup(postId: number): void {
    if (!this.showConfirmModal) {
      this.selectedPostId = postId;
    }
  }

  closePopup(): void {
    this.selectedPostId = null;
  }

  deletePost(postId: number): void {
    this.openConfirmModal(postId);
  }

  deleteComment(commentId: number, postId: number): void {
    this.selectedCommentId = commentId;
    this.selectedPostId = postId;
    this.showConfirmModalComment = true;
  }

  confirmDeleteComment(commentId: number, postId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.postComments[postId] = this.postComments[postId].filter(c => c.id !== commentId);
        this.commentCounts[postId] = this.postComments[postId].length;
        this.isDeletedComment = true;
        this.showConfirmModalComment = false;
        setTimeout(() => this.isDeletedComment = false, 3000);
      },
      error: err => console.error('Error deleting comment:', err)
    });
  }

  cancelDeleteComment(): void {
    this.showConfirmModalComment = false;
  }

  generatePdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('List of Posts and Comments', 10, 10);
    let y = 20;

    this.posts.forEach(post => {
      doc.setFont('helvetica', 'bold').setFontSize(16).text(`Post #${post.id}: ${post.title}`, 10, y);
      y += 10;

      doc.setFont('helvetica', 'normal').setFontSize(12);
      doc.text(`Type: ${post.type}`, 10, y);
      doc.text(`Likes: ${this.likeCounts[post.id] || 0}`, 100, y);
      doc.text(`Comments: ${this.commentCounts[post.id] || 0}`, 150, y);
      y += 10;

      const splitText = doc.splitTextToSize(post.content || '', 180);
      doc.text(splitText, 10, y);
      y += splitText.length * 7 + 10;

      const comments = this.postComments[post.id] || [];
      if (comments.length) {
        doc.setFont('helvetica', 'bold').setFontSize(14).text('Comments:', 10, y);
        y += 10;
        comments.forEach(comment => {
          const author = this.userNames.get(comment.userId) || 'Anonymous';
          const commentLines = doc.splitTextToSize(`${author}: ${comment.content}`, 180);
          doc.setFont('helvetica', 'normal').setFontSize(12).text(commentLines, 15, y);
          y += commentLines.length * 7 + 5;
        });
      } else {
        doc.text('No comments available for this post.', 10, y);
        y += 10;
      }

      doc.setDrawColor(0).setLineWidth(1.5).line(10, y, 200, y);
      y += 15;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('Blog-Posts&Comments.pdf');
  }

  async generateStatisticsPdf(): Promise<void> {
    this.isGeneratingPdf = true;

    try {
      if (!this.showCharts) {
        this.showCharts = true;
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      this.updateCharts();
      await new Promise(resolve => setTimeout(resolve, 1000));

      const doc = new jsPDF();
      doc.setFontSize(18).text('Blog Statistics Report', 105, 10, { align: 'center' });

      let y = 30;
      await this.addChartToPdf(doc, 'activityChart', y, 'Recent Activity');
      y += 110;

      await this.addChartToPdf(doc, 'typeChart', y, 'Post Type Distribution');
      y += 110;

      await this.addChartToPdf(doc, 'contributorsChart', y, 'Top Contributors');

      doc.setFontSize(10).setTextColor(100).text(`Generated on ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      doc.save(`Blog_Statistics_${timestamp}.pdf`);
    } catch (error) {
      console.error('Error generating statistics PDF:', error);
      alert('Failed to generate statistics PDF.');
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  private async addChartToPdf(doc: jsPDF, chartId: string, y: number, title?: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          const chart = Chart.getChart(chartId);
          if (!chart) return resolve();

          const canvas = document.getElementById(chartId) as HTMLCanvasElement;
          if (!canvas) return resolve();

          if (title) {
            doc.setFontSize(14).text(title, 105, y - 5, { align: 'center' });
          }

          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width * 2;
          tempCanvas.height = canvas.height * 2;

          const ctx = tempCanvas.getContext('2d');
          if (!ctx) return resolve();

          ctx.scale(2, 2);
          ctx.drawImage(canvas, 0, 0);

          const img = tempCanvas.toDataURL('image/png', 1.0);
          doc.addImage(img, 'PNG', 15, y, 180, 100);
          resolve();
        } catch (error) {
          console.error(`Error rendering chart ${chartId}`, error);
          resolve();
        }
      }, 300);
    });
  }
}
