import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {CompleteObjectType, ObjectType} from '../data/object-type';
import {StorageLocation} from '../data/storage-location';
import {ExternalLoan, LoanState} from '../data/external-loan';
import {LoansService} from './loans.service';
import {of} from 'rxjs';
import {environment} from '../../environments/environment';
import {isNullOrUndefined} from 'util';
import {filter, map, switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class StorageLocationsService {
  constructor(private http: HttpClient) {
  }

  private locations = new BehaviorSubject<StorageLocation[]>([]);
  private lastPull = 0;

  private pullIfNeeded() {
    const now = Date.now();

    if (now - this.lastPull > (60 * 1000)) {
      this.http.get<StorageLocation[]>(environment.apiurl + '/locations').subscribe(res => this.locations.next(res));
      this.lastPull = now;
    }
  }

  forceRefreshLocations() {
    this.lastPull = 0;
    this.pullIfNeeded();
  }

  getStorageLocation(num: number): Observable<StorageLocation> {
    this.pullIfNeeded();

    return this.locations.pipe(map(locations => locations.filter(loc => loc.storageLocationId === num)[0]));
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

    if (isNullOrUndefined(inConv)) {
      return this.locations;
    } else {
      return this.locations.pipe(map(locations => locations.filter(loc => loc.inConv === inConv)));
    }
  }
}
