import {ExternalLender} from './external-lender';

export enum LoanState {
  AWAITING_PICKUP = 'AwaitingPickup',
  AWAITING_RETURN = 'AwaitingReturn',
  RETURNED = 'Returned'
}

export const LoanStates = [LoanState.AWAITING_RETURN, LoanState.AWAITING_PICKUP, LoanState.RETURNED];

export function loanStateToText(loanState: LoanState) {
  switch (loanState) {
    case LoanState.AWAITING_PICKUP:
      return 'Non récupéré';
    case LoanState.AWAITING_RETURN:
      return 'Récupéré, non retourné';
    case LoanState.RETURNED:
      return 'Retourné et clos';
    default:
      return 'Etat inconnu ' + loanState;
  }
}

export function externalLoanToString(loan: CompleteExternalLoan, defaultValue: string = '') {
  if (loan) {
    return loan.lender.name + ' (' + loan.lender.location + ')';
  }
  return defaultValue;
}

export class ExternalLoan {
  externalLoanId: number;
  externalLender?: number;
  eventId: number;
  pickupTime: Date;
  returnTime: Date;
  pickupPlace: string;
  returnPlace: string;
  status: LoanState;
}

export class CompleteExternalLoan {
  externalLoan: ExternalLoan;
  lender: ExternalLender;
}
