import {Component, OnInit} from '@angular/core';
import {ExternalLoan, LoanState, LoanStates, loanStateToText} from '../../../data/external-loan';
import {isNullOrUndefined} from 'util';
import {ExternalLender} from '../../../data/external-lender';
import {LoansService} from '../../../services/loans.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {EventsService} from '../../../services/events.service';

@Component({
  selector: 'app-create-external-loan',
  templateUrl: './create-external-loan.component.html',
  styleUrls: ['./create-external-loan.component.css']
})
export class CreateExternalLoanComponent implements OnInit {
  loan: ExternalLoan;
  lender: ExternalLender;
  eventId: number;

  sending = false;

  constructor(private ls: LoansService, private router: Router, private es: EventsService) {
  }

  get isUpdate(): boolean {
    return !isNullOrUndefined(this.loan.externalLoanId);
  }

  get isValid() {
    console.log(this.loan);
    return this.loan && this.loan.externalLenderId && this.loan.returnTime && this.loan.pickupTime && this.eventId;
  }

  ngOnInit() {
    this.resetLoan();
    this.es.getCurrentEvent().subscribe(ev => {
      if (!isNullOrUndefined(ev)) {
        this.eventId = ev.eventId
      }
    });
  }

  resetLoan() {
    this.loan = new ExternalLoan();
    this.loan.status = LoanState.AWAITING_PICKUP;
  }

  submit(type: 'see' | 'edit-new') {
    if (!this.isValid) {
      return;
    }

    if (this.sending) {
      return;
    }
    this.sending = true;

    this.loan.eventId = this.eventId;

    this.ls.createLoan(this.loan)
      .subscribe(res => {
        if (type === 'see') {
          this.ls.forceRefreshLoans().subscribe(n => this.router.navigate(['/', 'external-loans', res]));
        } else {
          Swal.fire('Prêt créé', undefined, 'success');
          this.resetLoan();
          this.sending = false;
        }
      }, err => {
        Swal.fire('Une erreur s\'est produite', undefined, 'error');
        this.sending = false;
      });
  }

}
