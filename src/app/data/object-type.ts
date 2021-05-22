import {StorageTree} from './storage-location';
import {CompleteExternalLoan} from './external-loan';

export class ObjectType {
  objectTypeId?: number;
  parentObjectTypeId?: number;
  name: string;
  description?: string;
  partOfLoan?: number;
  partOfLoanObject?: CompleteExternalLoan;
  requiresSignature: boolean = false;
}
