import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CompleteExternalLoan} from '../../../data/external-loan';
import {LoansService} from '../../../services/loans.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-select-loan',
  templateUrl: './select-loan.component.html',
  styleUrls: ['./select-loan.component.css']
})
export class SelectLoanComponent implements OnInit {
  @Input('label') label: string;
  @Input('emptyLabel') emptyLabel: string = 'Aucun';
  @Input('type') type: 'select' | 'input' = 'select';
  @Input('selected') selected: number;
  @Output('selectedChange') selectedChange = new EventEmitter<number>();

  loans: CompleteExternalLoan[] = [];
  constructor(private service: LoansService) { }

  ngOnInit() {
    this.service.getLoans().subscribe(loans => {
      this.loans = loans;
    });
  }

  displayLoanById(loan: number): Observable<string> {
    return this.service.getLoan(loan).pipe(map(el => this.displayLoan(el)));
  }

  displayLoan(loan?: CompleteExternalLoan): string | undefined {
    const name = loan.guest ? loan.guest.name : loan.user.email;
    return loan ? (loan.guest ? 'Prêt ' + loan.externalLoan.loanTitle + ' (' + name + ')' +
      ' récupéré le ' + loan.externalLoan.pickupTime : undefined) : undefined;
  }

}
