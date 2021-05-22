import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, OperatorFunction} from 'rxjs';
import {ObjectType} from '../data/object-type';
import {StorageLocationsService} from './storage-locations.service';
import {environment} from '../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {CompleteObject, CompleteObjectWithUser, ObjectCreateResult, ObjectStatus, SingleObject} from '../data/object';
import {ObjectLogWithObject, ObjectLogWithUser} from '../data/object-log';
import {TidyingTree} from '../data/tidying';
import {CompleteObjectComment} from '../data/object-comment';
import {EventsService} from './events.service';
import {StorageTree} from '../data/storage-location';
import {LoansService} from './loans.service';

@Injectable({providedIn: 'root'})
export class ObjectsService {
  private storagesWithParents: Observable<Map<number, StorageTree>>;
  private embedExternalLoan: OperatorFunction<ObjectType[], ObjectType[]>;
  private embedStorageListInObject: OperatorFunction<CompleteObject[], CompleteObject[]>;
  private embedStorageInObject: OperatorFunction<CompleteObject, CompleteObject>;


  constructor(private http: HttpClient, private events: EventsService, private storages: StorageLocationsService, private loans: LoansService) {
    this.storagesWithParents = storages.getStoragesWithParents();
    this.embedExternalLoan = switchMap(objects => this.loans.getLoansMap().pipe(map(loans => objects.map(obj => {
      if (obj.partOfLoan) {
        obj.partOfLoanObject = loans.get(obj.partOfLoan);
      }
      return obj;
    }))));

    this.embedStorageListInObject = switchMap(objects => this.storagesWithParents.pipe(map(locations => objects.map(obj => {
      if (obj.object.storageLocation) {
        obj.storageLocationObject = locations.get(obj.object.storageLocation);
      }
      if (obj.object.inconvStorageLocation) {
        obj.inconvStorageLocationObject = locations.get(obj.object.inconvStorageLocation);
      }
      return obj;
    }))));

    this.embedStorageInObject = switchMap(obj => this.storagesWithParents.pipe(map(locations => {
      if (obj.object.storageLocation) {
        obj.storageLocationObject = locations.get(obj.object.storageLocation);
      }
      if (obj.object.inconvStorageLocation) {
        obj.inconvStorageLocationObject = locations.get(obj.object.inconvStorageLocation);
      }
      return obj;
    })));
  }


  getObjectTypes(): Observable<ObjectType[]> {
    return this.events.getCurrentEventId().pipe(switchMap(evId => {
      const param = evId ? '?eventId=' + evId : '';
      return this.http.get<ObjectType[]>(environment.apiurl + '/objects/types/complete' + param);
    }), this.embedExternalLoan);
  }

  getTidyingData(inverted: boolean, leftDepth: number, rightDepth: number): Observable<TidyingTree[]> {
    return this.http.get<TidyingTree[]>(environment.apiurl + '/objects/tidying?inverted=' + inverted + '&leftDepth=' + leftDepth + '&rightDepth=' + rightDepth);
  }

  createOrUpdateObjectType(type: ObjectType): Observable<number> {
    if (type.objectTypeId) {
      const id = type.objectTypeId;
      return this.http.put(environment.apiurl + '/objects/types/' + type.objectTypeId, type).pipe(map(u => id));
    } else {
      return this.http.post<number>(environment.apiurl + '/objects/types', type);
    }
  }

  getObjectType(id: number): Observable<ObjectType> {
    return this.http.get<ObjectType>(environment.apiurl + '/objects/types/' + id)
      .pipe(switchMap(obj => this.loans.getLoansMap().pipe(map(loans => {
        if (obj.partOfLoan) {
          obj.partOfLoanObject = loans.get(obj.partOfLoan);
        }
        return obj;
      }))));
  }

  updateObject(object: CompleteObject): Observable<void> {
    return this.http.put<void>(environment.apiurl + '/objects/' + object.object.objectId, object.object);
  }

  deleteObjectType(id: number): Observable<void> {
    return this.http.delete<void>(environment.apiurl + '/objects/types/' + id);
  }

  getSimpleObjectType(id: number): Observable<ObjectType> {
    return this.http.get<ObjectType>(environment.apiurl + '/objects/types/' + id);
  }

  // Objects
  getObjectsForType(typeId: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-type/complete/' + typeId)
      .pipe(this.embedStorageListInObject);
  }

  getObjectsLoanedToUser(userId: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/loanedTo/' + userId)
      .pipe(this.embedStorageListInObject);
  }

  getObjectsLoaned(): Observable<CompleteObjectWithUser[]> {
    return this.http.get<CompleteObjectWithUser[]>(environment.apiurl + '/objects/loaned/')
      .pipe(switchMap(objects => this.storagesWithParents.pipe(map(locations => objects.map(obj => {
        if (obj.object.object.storageLocation) {
          obj.object.storageLocationObject = locations.get(obj.object.object.storageLocation);
        }
        if (obj.object.object.inconvStorageLocation) {
          obj.object.inconvStorageLocationObject = locations.get(obj.object.object.inconvStorageLocation);
        }
        return obj;
      })))));
  }

  getLoansHistoryForUser(userId: number): Observable<ObjectLogWithObject[]> {
    return this.http.get<ObjectLogWithObject[]>(environment.apiurl + '/objects/history/' + userId);
  }

  getObjectsForImpreciseLocation(room: string, space?: string) {
    const extra = space ? ('&space=' + space) : '';
    return this.http.get<ObjectLogWithObject[]>(environment.apiurl + '/objects/complete?room=' + room + extra);
  }

  getObjects(): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/complete')
      .pipe(this.embedStorageListInObject);
  }

  getObjectsForLocation(location: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-location/complete/' + location)
      .pipe(this.embedStorageListInObject);
  }

  getObjectsForLoan(loan: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-loan/complete/' + loan)
      .pipe(this.embedStorageListInObject);
  }

  getObjectLogs(typeId: number): Observable<ObjectLogWithUser[]> {
    return this.events.getCurrentEventId().pipe(switchMap(id => this.http.get<ObjectLogWithUser[]>(environment.apiurl + '/objects/logs/' + typeId)));
  }

  getNextSuffix(typeId: number, prefix: string): Observable<number> {
    return this.http.get<number>(environment.apiurl + '/objects/nextSuffix/' + typeId + '?prefix=' + prefix);
  }

  getObjectById(objectId: number): Observable<CompleteObject> {
    return this.http.get<CompleteObject>(environment.apiurl + '/objects/complete/' + objectId)
      .pipe(this.embedStorageInObject);
  }

  createObjects(objects: SingleObject[]): Observable<ObjectCreateResult> {
    return this.http.post<ObjectCreateResult>(environment.apiurl + '/objects/', objects);
  }

  changeState(objectId: number, targetState: ObjectStatus, user: number, signature?: string): Observable<void> {
    return this.http.put<void>(environment.apiurl + '/objects/state/' + objectId,
      {targetState, userId: user, signature});
  }

  getObjectComments(objectId: number): Observable<CompleteObjectComment[]> {
    return this.http.get<CompleteObjectComment[]>(environment.apiurl + '/objects/comments/' + objectId);
  }

  postObjectComment(objectId: number, comment: string): Observable<void> {
    return this.http.post<void>(environment.apiurl + '/objects/comments/' + objectId, comment, {headers: {'Content-Type': 'text/plain; charset=UTF-8'}});
  }

  getObjectByTag(tag: string): Observable<CompleteObject> {
    return this.http.get<CompleteObject>(environment.apiurl + '/objects/by-tag/' + tag)
      .pipe(this.embedStorageInObject);
    ;
  }
}
