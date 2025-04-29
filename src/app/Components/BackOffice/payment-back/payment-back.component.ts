import { Component } from '@angular/core';
import { Payment, PaymentRequest } from 'src/app/models/payment';
import { PaymentService } from 'src/app/Services/payment.service';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-payment-back',
  templateUrl: './payment-back.component.html',
  styleUrls: ['./payment-back.component.css']
})
export class PaymentBackComponent {
  payments: any[] = [];
  paymentHistory: Payment[] = [];
  isLoading: boolean = false;
  error: string = '';
  selectedPayment: Payment | null = null;
  isCreating: boolean = false;
  isUpdating: boolean = false;
  chartType: ChartType = 'radar'; 

  // Propriétés pour les filtres
  status: string | null = null;

  // Liste statique de statuts
  paymentStatuses: string[] = ['Pending', 'Completed', 'Failed'];

  // Déclaration des nouvelles propriétés
  basketId: number | null = null;
  userId: number | null = null;
  paymentMethod: string = 'CreditCard';  // Ajout du mode de paiement

  // Variables pour le graphique
  paymentStatusChartOptions: ChartOptions = {
    responsive: true,
  };
  paymentStatusChartLabels: string[] = ['Pending', 'Completed', 'Failed'];
  paymentStatusChartData: ChartData<'doughnut'> = {
    labels: this.paymentStatusChartLabels,
    datasets: [
      {
        data: [0, 0, 0],  // Ces valeurs vont être mises à jour dynamiquement
        backgroundColor: ['#FFEB3B', '#4CAF50', '#F44336'], // Couleurs pour chaque état
      },
    ],
  };

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.fetchPayments();
    this.fetchPaymentHistory();  // Charger l'historique des paiements au démarrage
  }

  // Méthode pour basculer le formulaire de création/mise à jour
  toggleForm() {
    this.isCreating = !this.isUpdating;
    if (this.selectedPayment) {
      this.selectedPayment.amount = this.selectedPayment.amount || 0;
    }
  }

  // Récupérer tous les paiements
  fetchPayments(): void {
    this.isLoading = true;
    console.log('Fetching payments...');
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        console.log('Payments received:', data);
        this.payments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
        this.error = 'Error retrieving payments.';
        this.isLoading = false;
      }
    });
  }

  // Récupérer l'historique des paiements en fonction du statut
  fetchPaymentHistory(): void {
    this.isLoading = true;
    console.log('Fetching payment history...');
    
    // Créez les paramètres de la requête en fonction du statut
    let statusParam = '';
    if (this.status) {
      statusParam = `status=${this.status}`;
    }

    const url = `http://localhost:8014/api/payment/payments/history?${statusParam}`;
    this.paymentService.getPaymentHistory(url).subscribe(
      (response: any) => {
        console.log('Payment history received:', response);
        this.isLoading = false;
        this.paymentHistory = response;
        this.paymentHistory.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

        // Mettre à jour le graphique avec les statistiques
        this.updatePaymentStatusChart();
      },
      (error) => {
        console.error('Error fetching payment history:', error);
        this.isLoading = false;
        this.error = 'Error fetching payment history';
      }
    );
  }

  // Mettre à jour les données du graphique des statuts des paiements
  updatePaymentStatusChart(): void {
    const statusCounts = [0, 0, 0]; // [Pending, Completed, Failed]
    
    // Calculer les statistiques
    this.paymentHistory.forEach(payment => {
      if (payment.status === 'Pending') statusCounts[0]++;
      else if (payment.status === 'Completed') statusCounts[1]++;
      else if (payment.status === 'Failed') statusCounts[2]++;
    });

    // Mettre à jour les données du graphique
    this.paymentStatusChartData.datasets[0].data = statusCounts;
  }

  // Créer un paiement
  createPayment(): void {
    if (this.basketId === null || this.userId === null) {
      this.error = 'Please provide a valid basket ID and user ID.';
      return;  // Empêcher la suite de l'exécution si les IDs sont null
    }

    // Forcer la conversion de basketId et userId en number si nécessaire
    const validBasketId = this.basketId as number;
    const validUserId = this.userId as number;
    const paymentRequest: PaymentRequest = {
      basketDTO: {
        id_Basket: validBasketId,
        total: 0, // Remplacez par le montant réel
        dateCreation: new Date().toISOString(),
        statut: 'PENDING',
        quantity: 1,
        modePaiement: this.paymentMethod,
        dateValidation: null,
        dateModification: null,
        userId: validUserId,
        productIds: []
      },
      userDTO: { id_User: validUserId }
    };

    this.paymentService.createPayment(paymentRequest).subscribe({
      next: (payment) => {
        this.payments.push(payment);

        // Appel de la méthode de validation du panier après la création du paiement
        this.paymentService.updateBasketStatus(validBasketId).subscribe({
          next: () => {
            // Une fois le panier validé, mettre à jour la session
            this.endSession();  // Mettre fin à la session d'achat

            // Réinitialiser le panier
            this.basketId = null;
            this.userId = null;
            alert('Payment created and basket validated successfully!');
          },
          error: (err) => {
            this.error = 'Error during cart validation';
          }
        });
      },
      error: (err) => {
        this.error = 'Error during payment creation';
      }
    });
  }

  // Terminer la session d'achat
  endSession(): void {
    localStorage.removeItem('shoppingSession');  // Supprime la session en cours
    alert('Shopping session ended. Start a new session by adding items to the basket.');
  }

  // Supprimer un paiement
  deletePayment(paymentId: number): void {
    this.paymentService.deletePayment(paymentId).subscribe({
      next: () => {
        this.payments = this.payments.filter(payment => payment.id_Payment !== paymentId);
        alert('Payment deleted successfully!');
      },
      error: (err) => {
        this.error = 'Error during payment deletion';
      }
    });
  }

  // Mettre à jour un paiement
  updatePayment(paymentId: number): void {
    this.isUpdating = true;
    this.selectedPayment = this.payments.find(payment => payment.id_Payment === paymentId) || null;
    this.toggleForm();
  }

  // Sauvegarder les modifications de paiement
  saveUpdatedPayment(): void {
    if (this.selectedPayment) {
      this.paymentService.updatePayment(this.selectedPayment.id_Payment, this.selectedPayment).subscribe({
        next: (payment) => {
          const index = this.payments.findIndex(p => p.id_Payment === payment.id_Payment);
          if (index !== -1) {
            this.payments[index] = payment;
            alert('Payment updated successfully!');
            this.selectedPayment = null;
            this.isUpdating = false;
          }
        },
        error: (err) => {
          this.error = 'Error during payment update';
        }
      });
    }
  }

  // Annuler la modification
  cancelUpdate(): void {
    this.selectedPayment = null;
    this.isUpdating = false;
  }

  // Méthode pour changer le filtre de statut
  onStatusChange(status: string): void {
    this.status = status;
    this.fetchPaymentHistory(); // Rechercher les paiements avec le nouveau statut
  }
}
