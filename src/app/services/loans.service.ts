import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AsyncSubject, BehaviorSubject, Observable} from 'rxjs';
import {CompleteExternalLoan, ExternalLoan, LoanState} from '../data/external-loan';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LoansService {
  private loans = new BehaviorSubject<CompleteExternalLoan[]>([]);
  private lastPull = 0;

  constructor(private http: HttpClient) {
  }

  forceRefreshLoans(): Observable<void> {
    this.lastPull = 0;
    return this.pullIfNeeded();
  }

  getLoans(): Observable<CompleteExternalLoan[]> {
    this.pullIfNeeded();
    return this.loans;
  }

  getLoan(id: number): Observable<CompleteExternalLoan> {
    this.pullIfNeeded();

    return this.loans.pipe(map(loans => loans.filter(loan => loan.externalLoan.externalLoanId === id)[0]));
  }

  changeState(loan: number, targetState: LoanState): Observable<void> {
    return this.http.put<void>(environment.apiurl + '/external-loans/' + loan + '/state',
      {targetState});
  }

  getLoanDirect(id: number): Observable<CompleteExternalLoan> {
    return this.http.get<CompleteExternalLoan>(environment.apiurl + '/external-loans/complete/' + id);
  }

  createLoan(loan: ExternalLoan): Observable<number> {
    return this.http.post<number>(environment.apiurl + '/external-loans/', loan);
  }

  private pullIfNeeded(): Observable<void> {
    const now = Date.now();
    const update = new AsyncSubject<void>();
    update.next(null);


    if (now - this.lastPull > (60 * 1000)) {
      this.http.get<CompleteExternalLoan[]>(environment.apiurl + '/external-loans/complete').subscribe(res => {
        this.loans.next(res);
        update.complete();
      });
      this.lastPull = now;
    } else {
      update.complete();
    }

    return update;
  }
}
