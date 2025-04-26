import { Component } from '@angular/core';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent {
  services: any[] = [];
  currentPage = 1;
  pageSize = 3;
  totalPages = 0;
  service!: any;
  mapOpened: boolean = false;
  isLoadingMap: boolean = false;

  // Fields for Add/Update service form
  name: string = '';
  description: string = '';
  price: number | undefined;
  durationInMinutes: number | undefined;
  address: string = '';
  startDate: string = '';
  endDate: string = '';
  providerId: number | undefined;

  // Chart variables
  servicesCountChartData: {
    labels: string[];
    datasets: ChartDataset<'doughnut'>[];  // Doughnut chart data type
  } = { labels: [], datasets: [] };
  servicesCountChartType: 'doughnut' = 'doughnut'; // Explicitly set type to 'doughnut'

  servicesPerDayChartData: {
    labels: string[];
    datasets: ChartDataset<'bar'>[];  // Bar chart data type
  } = { labels: [], datasets: [] };

  servicesCountChartOptions: ChartOptions<'doughnut'> = {  // Doughnut chart options
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Total Services Overview',
        font: {
          size: 18
        }
      },
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  servicesPerDayChartOptions: ChartOptions<'bar'> = {  // Bar chart options
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Services Created Per Day',
        font: {
          size: 18
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Services'
        }
      }
    }
  };
  
  mostBookedServicesChartData: {
    labels: string[];
    datasets: ChartDataset<'bar'>[];
  } = { labels: [], datasets: [] };

  mostBookedServicesChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Most Booked Services',
        font: { size: 18 },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Service Name',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Booking Count',
        },
        beginAtZero: true,
      },
    },
  };


  constructor(
    private ps: PetServiceService,
    private mapsLoader: GoogleMapsLoaderService
  ) {}

  ngOnInit(): void {
    this.ps.getServices().subscribe((data) => {
      this.services = data;
      this.totalPages = Math.ceil(this.services.length / this.pageSize);
      this.prepareChartData();
      this.prepareServicesPerDayChart();
      this.prepareMostBookedServicesChart();
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  prepareChartData() {
    const totalServices = this.services.length;

    this.servicesCountChartData = {
      labels: ['Total Services'],
      datasets: [
        {
          data: [totalServices],
          label: 'Services Count',
          backgroundColor: ['#4CAF50'],
        },
      ],
    };
  }

  prepareMostBookedServicesChart() {
    const servicesWithBookings: { name: string; bookingsCount: number }[] = [];
  
    this.services.forEach((service) => {
      console.log('Fetching appointments for service ID:', service.idService);
  
      this.ps.getServiceWithAppointments(service.idService).subscribe((appointmentsData: any) => {
        const numberOfAppointments = Array.isArray(appointmentsData.appointments) 
          ? appointmentsData.appointments.length 
          : 0;
  
        console.log(`Number of appointments for ${service.name}:`, numberOfAppointments);
  
        servicesWithBookings.push({
          name: service.name,
          bookingsCount: numberOfAppointments,
        });
  
        if (servicesWithBookings.length === this.services.length) {
          console.log('All services data fetched:', servicesWithBookings);
          this.updateMostBookedServicesChart(servicesWithBookings);
        }
      });
    });
  }
  
  
  updateMostBookedServicesChart(servicesWithBookings: { name: string, bookingsCount: number }[]) {
    const sortedServices = servicesWithBookings.sort((a, b) => b.bookingsCount - a.bookingsCount);  // Sort by booking count
  
    // Update chart data
    this.mostBookedServicesChartData = {
      labels: sortedServices.map(service => service.name),
      datasets: [{
        label: 'Booking Count',
        data: sortedServices.map(service => service.bookingsCount),
        backgroundColor: '#42A5F5',  // Bar color
      }]
    };
  }
  

  prepareServicesPerDayChart() {
    const servicesByDay: { [date: string]: number } = {};
  
    this.services.forEach((service) => {
      const date = new Date(service.startDate).toISOString().split('T')[0]; // Only YYYY-MM-DD
      if (servicesByDay[date]) {
        servicesByDay[date]++;
      } else {
        servicesByDay[date] = 1;
      }
    });
  
    const sortedDates = Object.keys(servicesByDay).sort(); // Sort dates ascending
  
    // Generate random pastel colors for each bar
    const backgroundColors = sortedDates.map(() => this.getRandomPastelColor());
  
    this.servicesPerDayChartData = {
      labels: sortedDates,
      datasets: [
        {
          data: sortedDates.map((date) => servicesByDay[date]),
          label: 'Services per Day',
          backgroundColor: backgroundColors,
          borderRadius: 8, // Rounded corners
        },
      ],
    };
  }
  
  // Helper function to generate random pastel colors
  getRandomPastelColor(): string {
    const r = Math.round((Math.random() * 127) + 127);
    const g = Math.round((Math.random() * 127) + 127);
    const b = Math.round((Math.random() * 127) + 127);
    return `rgb(${r}, ${g}, ${b})`;
  }
  

    // Delete Service
    deleteService(serviceId: number) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          this.ps.deleteService(serviceId).subscribe(
            () => {
              this.services = this.services.filter(service => service.idService !== serviceId);  // Remove from list
              Swal.fire('Service deleted successfully!', '', 'success');
            },
            error => {
              Swal.fire('Failed to delete service!', 'Please try again.', 'error');
            }
          );
        }
      });
    }
  
    // This method will be triggered when a service is clicked to view its map location
    serviceClicked(service: any) {
      this.service = service; // Set the clicked service
      this.openMap(); // Open the map modal to show the location
    }

    openMap() {
      if (!this.service.address) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '❌ No location available for this service.',
          position: 'top',
          timer: 3000,
          showConfirmButton: false,
          toast: true
        });
        return;
      }
  
      this.mapOpened = true;
      this.isLoadingMap = true;
  
      this.mapsLoader.load().then(() => {
        Swal.fire({
          title: `${this.service.name}'s Location`,
          html: `<div id="swal-map" style="width: 100%; height: 300px;"></div>`,
          width: 600,
          showConfirmButton: true,
          didOpen: () => {
            this.initMap('swal-map');
          }
        });
        this.isLoadingMap = false;
      }).catch(err => {
        console.error('Google Maps failed to load', err);
        this.isLoadingMap = false;
      });
    }
    initMap(elementId: string = 'map') {
      const mapElement = document.getElementById(elementId);
      if (!mapElement || !this.service?.address) return;
  
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: this.service.address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
  
          const map = new google.maps.Map(mapElement, {
            center: location,
            zoom: 14
          });
  
          new google.maps.Marker({
            position: location,
            map: map,
            title: `${this.service.name}'s Location`
          });
        } else {
          console.error('Geocoding failed:', status);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '❌ Failed to find location for the service.',
            position: 'top',
            timer: 3000,
            showConfirmButton: false,
            toast: true
          });
        }
      });
    }
}
