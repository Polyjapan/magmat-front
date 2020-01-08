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

@Injectable({providedIn: 'root'})
export class ObjectsService {
  constructor(private http: HttpClient) {
  }

  getObjectTypes(): Observable<CompleteObjectType[]> {
    return this.http.get<CompleteObjectType[]>(environment.apiurl + '/objects/types/complete');
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

  getObjectsForLocation(location: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-location/complete/' + location);
  }

  getObjectsForLoan(loan: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-loan/complete/' + loan);
  }

  getObjectLogs(typeId: number): Observable<CompleteObjectLog[]> {
    return this.http.get<CompleteObjectLog[]>(environment.apiurl + '/objects/logs/' + typeId);
  }

  getObjectById(objectId: number): Observable<CompleteObject> {
    return this.http.get<CompleteObject>(environment.apiurl + '/objects/complete/' + objectId);
  }

  createObjects(objects: SingleObject[]): Observable<ObjectCreateResult> {
    return this.http.post<ObjectCreateResult>(environment.apiurl + '/objects/', objects);
  }

  changeState(objectId: number, targetState: ObjectStatus, user: number): Observable<void> {
    return this.http.put<void>(environment.apiurl + '/objects/state/' + objectId,
      {targetState, userId: user});
  }
}
