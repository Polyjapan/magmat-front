import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CompleteObjectType, ObjectType} from '../data/object-type';
import {LoansService} from './loans.service';
import {StorageLocationsService} from './storage-locations.service';
import {of, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {CompleteObject, ObjectCreateResult, ObjectStatus, SingleObject} from '../data/object';
import {CompleteObjectLog} from '../data/object-log';
import {TopTidyingTree} from '../data/tidying';
import {CompleteObjectComment} from '../data/object-comment';

@Injectable({providedIn: 'root'})
export class ObjectsService {
  constructor(private http: HttpClient) {
  }

  getObjectTypes(): Observable<CompleteObjectType[]> {
    return this.http.get<CompleteObjectType[]>(environment.apiurl + '/objects/types/complete');
  }

  getTidyingData(inverted: boolean): Observable<TopTidyingTree> {
    return this.http.get<TopTidyingTree>(environment.apiurl + '/objects/tidying?inverted=' + inverted);
  }

  getObjectTypesForLoan(loan: number): Observable<ObjectType[]> {
    return this.http.get<ObjectType[]>(environment.apiurl + '/objects/types/by-loan/' + loan);
  }

  createOrUpdateObjectType(type: ObjectType): Observable<number> {
    if (type.objectTypeId) {
      const id = type.objectTypeId;
      return this.http.put(environment.apiurl + '/objects/types/' + type.objectTypeId, type).pipe(map(u => id));
    } else {
      return this.http.post<number>(environment.apiurl + '/objects/types', type);
    }
  }

  updateObject(object: CompleteObject): Observable<void> {
    return this.http.put<void>(environment.apiurl + '/objects/' + object.object.objectId, object.object);
  }

  getObjectType(id: number): Observable<CompleteObjectType> {
    return this.http.get<CompleteObjectType>(environment.apiurl + '/objects/types/complete/' + id);
  }

  getSimpleObjectType(id: number): Observable<ObjectType> {
    return this.http.get<ObjectType>(environment.apiurl + '/objects/types/' + id);
  }

  // Objects
  getObjectsForType(typeId: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-type/complete/' + typeId);
  }

  getObjectsLoanedToUser(userId: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/loanedTo/' + userId);
  }

  getObjectsForLocation(location: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-location/complete/' + location);
  }

  getObjectsForLoan(loan: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-loan/complete/' + loan);
  }

  getObjectLogs(typeId: number): Observable<CompleteObjectLog[]> {
    return this.http.get<CompleteObjectLog[]>(environment.apiurl + '/objects/logs/' + typeId);
  }

  getNextSuffix(typeId: number, prefix: string): Observable<number> {
    return this.http.get<number>(environment.apiurl + '/objects/nextSuffix/' + typeId + '?prefix=' + prefix);
  }

  getObjectById(objectId: number): Observable<CompleteObject> {
    return this.http.get<CompleteObject>(environment.apiurl + '/objects/complete/' + objectId);
  }

  createObjects(objects: SingleObject[]): Observable<ObjectCreateResult> {
    return this.http.post<ObjectCreateResult>(environment.apiurl + '/objects/', objects);
  }

  changeState(objectId: number, targetState: ObjectStatus, user: number, signature?: string): Observable<void> {
    return this.http.put<void>(environment.apiurl + '/objects/state/' + objectId,
      {targetState, userId: user, signature});
  }

  getObjects(): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/');
  }

  getObjectComments(objectId: number): Observable<CompleteObjectComment[]> {
    return this.http.get<CompleteObjectComment[]>(environment.apiurl + '/objects/comments/' + objectId);
  }

  postObjectComment(objectId: number, comment: string): Observable<void> {
    return this.http.post<void>(environment.apiurl + '/objects/comments/' + objectId, comment);
  }

  getObjectByTag(tag: string) {
    return this.http.get<CompleteObject>(environment.apiurl + '/objects/by-tag/' + tag);
  }
}
