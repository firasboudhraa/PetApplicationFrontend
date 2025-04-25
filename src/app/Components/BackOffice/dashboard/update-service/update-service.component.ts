import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMapsLoaderService } from 'src/app/Services/google-map-loader.service';
import { PetServiceService } from 'src/app/Services/pet-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-service',
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.css']
})
export class UpdateServiceComponent implements AfterViewInit, OnInit {
  serviceForm!: FormGroup;
  loading = false;
  serviceId!: number;
  map: any;
  marker: any;

  constructor(
    private ps: PetServiceService,
    private router: Router,
    private mapsLoader: GoogleMapsLoaderService,
    private route: ActivatedRoute
  ) {
    this.serviceForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      durationInMinutes: new FormControl(null, [Validators.required, Validators.min(10)]),
      address: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required)
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit(): void {
    // Get service ID from route
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch service details from backend
    this.ps.getServiceById(this.serviceId).subscribe({
      next: (service) => {
        // Fill the form with existing service data
        this.serviceForm.setValue({
          name: service.name,
          description: service.description,
          price: service.price,
          durationInMinutes: service.durationInMinutes,
          address: service.address,
          startDate: service.startDate,
          endDate: service.endDate
        });

        // Optionally, set map and marker location based on service address
        this.initMap(service.address);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error fetching service',
          text: 'There was an issue fetching the service details.',
        });
      }
    });
  }

  ngAfterViewInit() {
    this.mapsLoader.load().then(() => this.initMap());
  }

  initMap(address: string = '') {
    const mapElement = document.getElementById('map');
    const inputElement = document.getElementById('autocomplete') as HTMLInputElement;

    if (!mapElement || !inputElement) return;

    const defaultCenter = { lat: 36.8065, lng: 10.1815 }; // Tunis

    const map = new google.maps.Map(mapElement, {
      center: defaultCenter,
      zoom: 12
    });

    let marker: google.maps.Marker | null = null;

    const autocomplete = new google.maps.places.Autocomplete(inputElement);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      map.setCenter(place.geometry.location);
      map.setZoom(14);

      if (marker) marker.setMap(null);
      marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        label: 'Service Location',
      });

      this.serviceForm.controls['address'].setValue(place.formatted_address || inputElement.value);
    });

    if (address) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          map.setZoom(14);

          if (marker) marker.setMap(null);
          marker = new google.maps.Marker({
            map,
            position: location,
            label: 'Service Location',
          });

          this.serviceForm.controls['address'].setValue(results[0].formatted_address);
          inputElement.value = results[0].formatted_address;
        }
      });
    }

    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0].formatted_address;
          if (marker) marker.setMap(null);
          marker = new google.maps.Marker({
            map,
            position: { lat, lng },
            label: 'Selected',
          });
          this.serviceForm.controls['address'].setValue(address);
          inputElement.value = address;
        }
      });
    });
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = new Date(group.get('startDate')?.value);
    const end = new Date(group.get('endDate')?.value);
    if (start && end && end <= start) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  onSubmit() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = { ...this.serviceForm.value, providerId: 1 };

    this.ps.updateService(this.serviceId, formData).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Service Updated',
          text: 'The service has been successfully updated!',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/dashboard/services']);
        });
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'Something went wrong. Please try again later.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}
