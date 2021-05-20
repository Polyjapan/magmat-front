import {StorageLocation, StorageTree, StorageWithParents} from './storage-location';
import {CompleteExternalLoan} from './external-loan';

export class ObjectType {
  objectTypeId?: number;
  name: string;
  description?: string;
  storageLocation?: number;
  inconvStorageLocation?: number;
  partOfLoan?: number;
  requiresSignature: boolean = false;
}

export class CompleteObjectType {
  objectType: ObjectType;
  storageLocationObject?: StorageTree;
  inconvStorageLocationObject?: StorageTree;
  partOfLoanObject?: CompleteExternalLoan;
}
