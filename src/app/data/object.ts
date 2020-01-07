import {StorageLocation} from './storage-location';
import {CompleteExternalLoan} from './external-loan';
import {ObjectType} from './object-type';

export enum ObjectStatus {
  IN_STOCK = 'InStock', OUT = 'Out', LOST = 'Lost', RESTING = 'Resting'
}

export class SingleObject {
  objectId?: number;
  objectTypeId: number;
  suffix: string;
  description?: string;
  storageLocation?: number;
  inconvStorageLocation?: number;
  partOfLoan?: number;
  reservedFor?: number;
  assetTag?: string;
  status: ObjectStatus;
}

export class CompleteObject {
  object: SingleObject;
  objectType: ObjectType;
  storageLocationObject?: StorageLocation;
  inconvStorageLocationObject?: StorageLocation;
  partOfLoanObject?: CompleteExternalLoan;
}

export class ObjectCreateResult {
  inserted: SingleObject[];
  notInserted: SingleObject[];
}
