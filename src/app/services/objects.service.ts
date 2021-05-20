import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, ObservedValueOf, OperatorFunction} from 'rxjs';
import {CompleteObjectType, ObjectType} from '../data/object-type';
import {StorageLocationsService} from './storage-locations.service';
import {environment} from '../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {CompleteObject, CompleteObjectWithUser, ObjectCreateResult, ObjectStatus, SingleObject} from '../data/object';
import {ObjectLogWithObject, ObjectLogWithUser} from '../data/object-log';
import {TopTidyingTree} from '../data/tidying';
import {CompleteObjectComment} from '../data/object-comment';
import {EventsService} from './events.service';
import {StorageTree} from '../data/storage-location';

@Injectable({providedIn: 'root'})
export class ObjectsService {
  private storagesWithParents: Observable<Map<number, StorageTree>>;
  private embedStorageList: OperatorFunction<CompleteObjectType[], CompleteObjectType[]>;
  private embedStorage: OperatorFunction<CompleteObjectType, CompleteObjectType>;
  private embedStorageListInObject: OperatorFunction<CompleteObject[], CompleteObject[]>;
  private embedStorageInObject: OperatorFunction<CompleteObject, CompleteObject>;


  constructor(private http: HttpClient, private events: EventsService, private storages: StorageLocationsService) {
    this.storagesWithParents = storages.getStoragesWithParents();
    this.embedStorageList = switchMap(objects => this.storagesWithParents.pipe(map(locations => objects.map(obj => {
      if (obj.objectType.storageLocation) obj.storageLocationObject = locations.get(obj.objectType.storageLocation);
      if (obj.objectType.inconvStorageLocation) obj.inconvStorageLocationObject = locations.get(obj.objectType.inconvStorageLocation);
      return obj;
    }))));

    this.embedStorage = switchMap(obj => this.storagesWithParents.pipe(map(locations => {
      if (obj.objectType.storageLocation) obj.storageLocationObject = locations.get(obj.objectType.storageLocation);
      if (obj.objectType.inconvStorageLocation) obj.inconvStorageLocationObject = locations.get(obj.objectType.inconvStorageLocation);
      return obj;
    })));

    this.embedStorageListInObject = switchMap(objects => this.storagesWithParents.pipe(map(locations => objects.map(obj => {
      if (obj.object.storageLocation ?? obj.objectType.storageLocation) obj.storageLocationObject = locations.get(obj.object.storageLocation ?? obj.objectType.storageLocation);
      if (obj.object.inconvStorageLocation ?? obj.objectType.inconvStorageLocation) obj.inconvStorageLocationObject = locations.get(obj.object.inconvStorageLocation ?? obj.objectType.inconvStorageLocation);
      return obj;
    }))));

    this.embedStorageInObject = switchMap(obj => this.storagesWithParents.pipe(map(locations => {
      if (obj.object.storageLocation ?? obj.objectType.storageLocation) obj.storageLocationObject = locations.get(obj.object.storageLocation ?? obj.objectType.storageLocation);
      if (obj.object.inconvStorageLocation ?? obj.objectType.inconvStorageLocation) obj.inconvStorageLocationObject = locations.get(obj.object.inconvStorageLocation ?? obj.objectType.inconvStorageLocation);
      return obj;
    })));
  }


  getObjectTypes(): Observable<CompleteObjectType[]> {
    return this.http.get<CompleteObjectType[]>(environment.apiurl + '/objects/types/complete')
      .pipe(this.embedStorageList);
  }

  getTidyingData(inverted: boolean): Observable<TopTidyingTree> {
    return this.http.get<TopTidyingTree>(environment.apiurl + '/objects/tidying?inverted=' + inverted);
  }

  createOrUpdateObjectType(type: ObjectType): Observable<number> {
    if (type.objectTypeId) {
      const id = type.objectTypeId;
      return this.http.put(environment.apiurl + '/objects/types/' + type.objectTypeId, type).pipe(map(u => id));
    } else {
      return this.http.post<number>(environment.apiurl + '/objects/types', type);
    }
  }

  getObjectType(id: number): Observable<CompleteObjectType> {
    return this.http.get<CompleteObjectType>(environment.apiurl + '/objects/types/complete/' + id)
      .pipe(this.embedStorage);
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
        if (obj.object.object.storageLocation) obj.object.storageLocationObject = locations.get(obj.object.object.storageLocation);
        if (obj.object.object.inconvStorageLocation) obj.object.inconvStorageLocationObject = locations.get(obj.object.object.inconvStorageLocation);
        return obj;
      })))));
  }

  getLoansHistoryForUser(userId: number): Observable<ObjectLogWithObject[]> {
    return this.http.get<ObjectLogWithObject[]>(environment.apiurl + '/objects/history/' + userId);
  }

  getObjectsForImpreciseLocation(room: string, space?: string) {
    const extra = space ? ('&space=' + space) : ''
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
      .pipe(this.embedStorageInObject);;
  }
}
