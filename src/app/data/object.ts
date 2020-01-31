import {StorageLocation} from './storage-location';
import {CompleteExternalLoan} from './external-loan';
import {ObjectType} from './object-type';
import {UserProfile} from './user';

export enum ObjectStatus {
  IN_STOCK = 'InStock', OUT = 'Out', LOST = 'Lost', RESTING = 'Resting'
}

export function statusToString(status: ObjectStatus) {
  switch (status) {
    case ObjectStatus.IN_STOCK:
      return 'En stock';
    case ObjectStatus.LOST:
      return 'Perdu';
    case ObjectStatus.OUT:
      return 'Prêté';
    case ObjectStatus.RESTING:
      return 'Déposé';
  }
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
  reservedFor?: UserProfile;
}

export class ObjectCreateResult {
  inserted: SingleObject[];
  notInserted: SingleObject[];
}
