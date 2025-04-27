import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { AuthService } from 'src/app/Components/FrontOffice/user/auth/auth.service';
import { PetServiceService } from 'src/app/Services/pet-service.service';

@Component({
  selector: 'app-stats-profile',
  templateUrl: './stats-profile.component.html',
  styleUrls: ['./stats-profile.component.css']
})
export class StatsProfileComponent implements OnInit {

  totalAppointments: number = 0;
  confirmedAppointments: number = 0;
  canceledAppointments: number = 0;
  pendingAppointments: number = 0; // Add pending appointments counter
  totalServices: number = 0;
  idProvider!: number;  // Replace with actual provider ID you need to fetch stats for

  // Bar chart
  barChartLabels: string[] = ['Confirmed', 'Cancelled', 'Pending']; // Added Pending to the labels
  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [{
      data: [0, 0, 0], // Initial data for confirmed, canceled, and pending appointments
      backgroundColor: ['#4CAF50', '#F44336', '#FFEB3B'], // Green for confirmed, Red for rejected, Yellow for pending
      hoverBackgroundColor: ['#4CAF50', '#F44336', '#FFEB3B'], // Hover color for the bars
    }]
  };
  barChartType: ChartType = 'bar';
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Appointment Status'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'black'
        }
      }
    }
  };

  constructor(private petService: PetServiceService, private authService: AuthService) {}

  ngOnInit() {
    const userId = this.authService.getDecodedToken()?.userId;
    if (userId !== undefined) {
      this.idProvider = userId;
    } else {
      console.error('User ID is undefined');
    }
    this.fetchStats(this.idProvider);
  }

  fetchStats(providerId: number) {
    this.petService.getServicesWithAppointmentsByProviderId(providerId).subscribe(
      (data: any[]) => {
        this.totalServices = data.length;
        this.totalAppointments = 0;
        this.confirmedAppointments = 0;
        this.canceledAppointments = 0;
        this.pendingAppointments = 0; // Reset the pending appointments counter

        data.forEach(service => {
          if (service.appointments) {
            this.totalAppointments += service.appointments.length;
            service.appointments.forEach((appointment: any) => {
              if (appointment.status === 'CONFIRMED') {
                this.confirmedAppointments++;
              } else if (appointment.status === 'CANCELLED') {
                this.canceledAppointments++;
              } else if (appointment.status === 'PENDING') {
                this.pendingAppointments++; // Count pending appointments
              }
            });
          }
        });

        // Update bar chart data
        this.barChartData.datasets[0].data = [this.confirmedAppointments, this.canceledAppointments, this.pendingAppointments];
      },
      error => {
        console.error('Failed to fetch stats', error);
      }
    );
  }
}
