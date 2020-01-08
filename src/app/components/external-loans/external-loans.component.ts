import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {CompleteExternalLoan, loanStateToText} from '../../data/external-loan';
import {LoansService} from '../../services/loans.service';

@Component({
  selector: 'app-external-loans',
  templateUrl: './external-loans.component.html',
  styleUrls: ['./external-loans.component.css']
})
export class ExternalLoansComponent implements OnInit {
  loans: Observable<CompleteExternalLoan[]>;

  constructor(private ls: LoansService) { }

  ngOnInit() {
    this.loans = this.ls.getLoans();
  }

  loanStateToText = loanStateToText;

  dateFormat(date) {
    if (typeof date === 'string') {
      return new Date(Date.parse(date)).toLocaleString();
    } else {
      return date.toLocaleString();
    }
  }

}
