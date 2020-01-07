import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {CompleteObjectType, ObjectType} from '../data/object-type';
import {StorageLocation} from '../data/storage-location';
import {CompleteExternalLoan, ExternalLoan, LoanState} from '../data/external-loan';
import {of} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LoansService {


  private loans = new BehaviorSubject<CompleteExternalLoan[]>([]);
  private lastPull = 0;

  private pullIfNeeded() {
    const now = Date.now();

    if (now - this.lastPull > (60 * 1000)) {
      this.http.get<CompleteExternalLoan[]>(environment.apiurl + '/external-loans/complete').subscribe(res => this.loans.next(res));
      this.lastPull = now;
    }
  }

  forceRefreshLoans() {
    this.lastPull = 0;
    this.pullIfNeeded();
  }

  constructor(private http: HttpClient) {
  }

  getLoans(): Observable<CompleteExternalLoan[]> {
    this.pullIfNeeded();
    return this.loans;
  }

  getLoan(id: number): Observable<CompleteExternalLoan> {
    this.pullIfNeeded();

    return this.loans.pipe(map(loans => loans.filter(loan => loan.externalLoan.externalLoanId === id)[0]));
  }
}
