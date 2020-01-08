import {CompleteObject} from './object';
import {CompleteExternalLoan, ExternalLoan} from './external-loan';

export class TopTidyingTree {
  stored: Map<string, Map<string, Map<string, TidyingLeaf>>>;
  unstored: TidyingLeaf;
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
