import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullEventResponse } from 'src/app/models/donation';
import { EventService } from 'src/app/Services/event-service.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit{

  id!: number;
  event!: FullEventResponse | undefined;;

  constructor(private es: EventService, private Act: ActivatedRoute , private router: Router) {}

  ngOnInit(): void {
    this.id = this.Act.snapshot.params['id'];    
    this.es.getEventById(this.id).subscribe(
      (data) => {
        this.event = data;
      }
    );
  }

}
