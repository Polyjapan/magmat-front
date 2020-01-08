import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Event} from '../data/event';

@Injectable({providedIn: 'root'})
export class EventsService {
  private currentEvent = new BehaviorSubject<Event>(null);
  private lastPull = 0;

  constructor(private http: HttpClient) {
  }

  getCurrentEvent(): Observable<Event> {
    this.pullIfNeeded();
    return this.currentEvent;
  }

  private pullIfNeeded() {
    const now = Date.now();

    if (now - this.lastPull > (60 * 60 * 1000)) {
      this.http.get<Event>(environment.apiurl + '/events/current').subscribe(res => {
        this.currentEvent.next(res);
      });
      this.lastPull = now;
    }
  }
}
