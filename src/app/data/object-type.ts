import {StorageLocation} from './storage-location';
import {CompleteExternalLoan} from './external-loan';

export class ObjectType {
  objectTypeId?: number;
  name: string;
  description?: string;
  storageLocation?: number;
  inconvStorageLocation?: number;
  partOfLoan?: number;
  requiresSignature: boolean;
}

export class CompleteObjectType {
  objectType: ObjectType;
  storageLocationObject?: StorageLocation;
  inconvStorageLocationObject?: StorageLocation;
  partOfLoanObject?: CompleteExternalLoan;
}
