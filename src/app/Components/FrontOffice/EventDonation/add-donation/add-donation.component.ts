import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/Services/user.service';

declare var paypal: any;

@Component({
  selector: 'app-add-donation',
  templateUrl: './add-donation.component.html',
  styleUrls: ['./add-donation.component.css']
})
export class AddDonationComponent implements OnInit, OnDestroy {
  amount: number = 0;
  eventId: number | null = null;
  loading: boolean = false;
  paymentCompleted: boolean = false;
  error: string | null = null;
  donationId: string | null = null;
  private paypalButtons: any;

  private readonly paypalClientId = 'YOUR_CLIENT_ID';
  private readonly apiBaseUrl = 'http://localhost:8010';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadPayPalScript();
      } else {
        this.showErrorAlert('Event information is missing. Please try again.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paypalButtons) {
      this.paypalButtons.close();
    }
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#e7515a',
    });
  }

  private showSuccessAlert(message: string): Promise<any> {
    return Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#4361ee',
      timer: 3000,
      timerProgressBar: true,
    });
  }

  public loadPayPalScript(): void {
    this.loading = true;
    
    if (typeof paypal !== 'undefined') {
      this.loading = false;
      this.initPayPalButton();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}&currency=USD`;
    script.async = true;
    script.onload = () => {
      this.loading = false;
      this.initPayPalButton();
    };
    script.onerror = () => {
      this.loading = false;
      this.showErrorAlert('Failed to load PayPal SDK. Please refresh the page.');
    };
    document.body.appendChild(script);
  }

  private initPayPalButton(): void {
    try {
      const container = document.getElementById('paypal-button-container');
      if (!container || !this.eventId) return;

      container.innerHTML = '';

      this.paypalButtons = paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal'
        },
        createOrder: (data: any, actions: any) => {
          return this.createOrder();
        },
        onApprove: async (data: any, actions: any) => {
          await this.captureOrder(data.orderID);
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          this.showErrorAlert('An error occurred with PayPal. Please try another payment method.');
        }
      });

      this.paypalButtons.render('#paypal-button-container');
    } catch (error) {
      console.error('PayPal init error:', error);
      this.showErrorAlert('Failed to initialize PayPal. Please refresh the page.');
    }
  }

  private getCurrentUserId(): number {
    return this.userService.getCurrentUserId();
  }

  private async createOrder(): Promise<string> {
    const userId = this.userService.getCurrentUserId();
    if (!this.eventId) {
      throw new Error('Event ID is required');
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiBaseUrl}/payment/create-order`,
        {
          amount: this.amount,
          eventId: this.eventId,
          userId: userId // Assurez-vous que cette propriété est bien envoyée
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ).toPromise();

      this.donationId = response.donationId;
      return response.orderId;
    } catch (error) {
      console.error('Create order error:', error);
      this.showErrorAlert('Failed to create payment order');
      throw error;
    }
}

  private async captureOrder(orderId: string): Promise<void> {
    try {
      if (!this.donationId) {
        throw new Error('Donation ID not found');
      }

      const response = await this.http.post<any>(
        `${this.apiBaseUrl}/payment/capture-order`,
        {
          orderId: orderId,
          donationId: this.donationId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ).toPromise();

      this.paymentCompleted = true;
      this.error = null;
      
      this.router.navigate(['/event-detail', this.eventId]);
    } catch (error) {
      console.error('Capture error:', error);
      this.showErrorAlert('Payment processing failed. Please try again.');
      this.paymentCompleted = false;
    }
  }

  public onAmountChange(): void {
    this.error = null;
    this.paymentCompleted = false;
    
    if (this.amount > 0 && typeof paypal !== 'undefined') {
      this.initPayPalButton();
    }
  }
}