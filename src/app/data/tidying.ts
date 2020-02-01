import {CompleteObject} from './object';
import {CompleteExternalLoan, ExternalLoan} from './external-loan';

export class TopTidyingTree {
  stored: Map<string, Map<string, Map<string, TidyingLeaf>>>;
  unstored: TidyingLeaf;
  loaned: TopLoanLeaf[];
}

export class TopLoanLeaf {
  loan: CompleteExternalLoan;
  objects: TidyingLeaf;
}

export class TidyingLeaf {
  stored: Map<string, Map<string, Map<string, CompleteObject[]>>>;
  other: CompleteObject[];
  loaned: TidyingLeafLoan[];
}

export class TidyingLeafLoan {
  loan: CompleteExternalLoan;
  objects: CompleteObject[];
}
