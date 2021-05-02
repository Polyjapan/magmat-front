import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {StorageLocation} from '../data/storage-location';
import {ExternalLoan, LoanState} from '../data/external-loan';
import {LoansService} from './loans.service';
import {of} from 'rxjs';
import {environment} from '../../environments/environment';
import {map, publishReplay, shareReplay, switchMap, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class StorageLocationsService {
  private refresh$ = new BehaviorSubject(0);
  private locations$: Observable<StorageLocation[]>;
  private lastPull = 0;

  constructor(private http: HttpClient) {
    this.locations$ = this.refresh$.pipe(
      switchMap((_) => this.http.get<StorageLocation[]>(environment.apiurl + '/locations')),
      shareReplay(1)
    );
  }


  forceRefreshLocations() {
    this.lastPull = Date.now();
    this.refresh$.next(0);
  }

  getStorageLocation(num: number): Observable<StorageLocation> {
    this.pullIfNeeded();

    return this.locations$.pipe(map(locations => locations.filter(loc => loc.storageLocationId === num)[0]));
  }

  createUpdateStorage(loc: StorageLocation): Observable<void> {
    if (loc.storageLocationId) {
      return this.http.put<void>(environment.apiurl + '/locations/' + loc.storageLocationId, loc);
    } else {
      return this.http.post<void>(environment.apiurl + '/locations', loc);
    }
  }

  deleteStorage(loc: number): Observable<void> {
    return this.http.delete<void>(environment.apiurl + '/locations/' + loc);
  }

  moveItems(loc: number, items: string[], moveType: boolean, moveAll: boolean): Observable<void> {
    return this.http.post<void>(environment.apiurl + '/locations/move/' + loc, {
      items, moveType, moveAll
    });
  }

  getStorageLocations(inConv?: boolean): Observable<StorageLocation[]> {
    this.pullIfNeeded();

    if (inConv === undefined || inConv == null) {
      return this.locations$;
    } else {
      return this.locations$.pipe(map(locations => locations.filter(loc => loc.inConv === inConv)));
    }
  }

  private pullIfNeeded() {
    const now = Date.now();

    if (now - this.lastPull > (60 * 1000)) {
      this.forceRefreshLocations();
    }
  }
}
