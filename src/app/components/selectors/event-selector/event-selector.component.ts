import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {EventsService} from '../../../services/events.service';
import {Event} from '../../../data/event';

@Component({
  selector: 'app-event-selector',
  templateUrl: './event-selector.component.html',
  styleUrls: ['./event-selector.component.css']
})
export class EventSelectorComponent implements OnInit {
  events$: Observable<Event[]>;
  event: Observable<Event>;

  constructor(private events: EventsService) {
    this.events$ = events.getEvents();
    this.event = events.getCurrentEvent();
  }

  ngOnInit() {
  }

  switch(id: number) {
    this.events.switchEvent(id)
      .subscribe(res => window.location.reload());
  }
}
