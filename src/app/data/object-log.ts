import {ObjectStatus} from './object';
import {UserProfile} from './user';

export class ObjectLog {
  objectId: number;
  eventId: number;
  timestamp: Date;
  changedBy: number;
  user: number;
  sourceState: ObjectStatus;
  targetState: ObjectStatus;
  signature?: string;
}

export class CompleteObjectLog {
  objectLog: ObjectLog;
  user: UserProfile;
  changedBy: UserProfile;
}
