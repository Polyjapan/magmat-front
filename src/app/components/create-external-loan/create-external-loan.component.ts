import { Component, OnInit } from '@angular/core';
import {ExternalLoan, LoanStates, loanStateToText} from '../../data/external-loan';

@Component({
  selector: 'app-create-external-loan',
  templateUrl: './create-external-loan.component.html',
  styleUrls: ['./create-external-loan.component.css']
})
export class CreateExternalLoanComponent implements OnInit {
  loanStates = LoanStates;
  loanStateToText = loanStateToText;
  loan: ExternalLoan = new ExternalLoan();

  constructor() { }

  ngOnInit() {
  }

}
