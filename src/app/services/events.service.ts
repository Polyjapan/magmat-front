import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Event} from '../data/event';
import {AuthService} from './auth.service';
import {map, shareReplay, tap} from 'rxjs/operators';
import {LoginResponse} from './login.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class EventsService {
  private event$: Observable<Event>;
  private events$: Observable<Event[]>;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.event$ = this.http.get<Event>(environment.apiurl + '/events/current')
      .pipe(shareReplay({bufferSize: 1, refCount: true}));
    this.events$ = this.http.get<Event[]>(environment.apiurl + '/events')
      .pipe(shareReplay({bufferSize: 1, refCount: true}));
  }

  getCurrentEvent(): Observable<Event> {
    return this.event$;
  }

  getEvents(): Observable<Event[]> {
    return this.events$;
  }

  getCurrentEventId(): number {
    const evId = localStorage.getItem('current_event_id');

    if (evId) {
      return Number.parseInt(evId, 10);
    } else {
      return 0;
    }
  }

  switchEvent(id: number): Observable<void> {
    localStorage.setItem('current_event_id', id ? id.toString(10) : '0');

    return this.http.get<LoginResponse>(environment.apiurl + '/events/switch/' + id)
      .pipe(
        tap(res => this.auth.changeToken(res.session)),
        map(res => undefined)
      );
  }
}
