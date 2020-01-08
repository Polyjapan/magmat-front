import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {CompleteObjectType, ObjectType} from '../data/object-type';
import {StorageLocation} from '../data/storage-location';
import {CompleteExternalLoan, ExternalLoan, LoanState} from '../data/external-loan';
import {of} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {ExternalLender} from '../data/external-lender';

@Injectable({providedIn: 'root'})
export class LendersService {
  private lenders = new BehaviorSubject<ExternalLender[]>([]);
  private lastPull = 0;

  private pullIfNeeded() {
    const now = Date.now();

    if (now - this.lastPull > (60 * 1000)) {
      this.http.get<ExternalLender[]>(environment.apiurl + '/external-lenders/').subscribe(res => this.lenders.next(res));
      this.lastPull = now;
    }
  }

  forceRefreshLenders() {
    this.lastPull = 0;
    this.pullIfNeeded();
  }

  constructor(private http: HttpClient) {
  }

  getLenders(): Observable<ExternalLender[]> {
    this.pullIfNeeded();
    return this.lenders;
  }

  getLender(id: number): Observable<ExternalLender> {
    this.pullIfNeeded();

    return this.lenders.pipe(map(lenders => lenders.filter(lender => lender.externalLenderId === id)[0]));
  }

  createLender(lender: ExternalLender): Observable<number> {
    return this.http.post<number>(environment.apiurl + '/external-lenders/', lender);
  }
}
