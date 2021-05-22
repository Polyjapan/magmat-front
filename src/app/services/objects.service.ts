import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, OperatorFunction} from 'rxjs';
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
import {ObjectTypesService} from './object-types.service';
import {lastChild} from '../data/object-type';
import {Guest} from '../data/guest';

@Injectable({providedIn: 'root'})
export class ObjectsService {
  private refresh$ = new BehaviorSubject(0);
  private objects$: Observable<CompleteObject[]>;
  private objectsMap$: Observable<Map<number, CompleteObject>>;
  private lastPull = 0;


  private storagesWithParents: Observable<Map<number, StorageTree>>;
  private embedStorageAndTypeInObjects: OperatorFunction<CompleteObject[], CompleteObject[]>;
  private embedStorageAndTypeInObject: OperatorFunction<CompleteObject, CompleteObject>;


  constructor(private http: HttpClient, private events: EventsService, private storages: StorageLocationsService,
              private loans: LoansService, private objectTypes: ObjectTypesService) {
    const refresh = this.refresh$.pipe(switchMap(_ => events.getCurrentEventId()));

    this.storagesWithParents = storages.getStoragesWithParents();


    this.embedStorageAndTypeInObjects = switchMap(objects =>
      this.objectTypes.getObjectTypesWithParents().pipe(switchMap(types =>
        this.loans.getLoansMap().pipe(switchMap(loans =>
          this.storagesWithParents.pipe(map(locations => objects.map(obj => {
            if (obj.object.storageLocation) {
              obj.storageLocationObject = locations.get(obj.object.storageLocation);
            }
            if (obj.object.inconvStorageLocation) {
              obj.inconvStorageLocationObject = locations.get(obj.object.inconvStorageLocation);
            }
            obj.objectTypeAncestry = types.get(obj.object.objectTypeId);
            obj.objectType = lastChild(obj.objectTypeAncestry);
            obj.partOfLoanObject = obj.objectType.partOfLoanObject ?? loans.get(obj.object.partOfLoan ?? -1);

            return obj;
          })))))
      ))
    );

    this.objects$ = refresh.pipe(switchMap(eventId => {
      const getParam = (eventId ? '?eventId=' + eventId : '');

      return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/complete' + getParam)
    }), this.embedStorageAndTypeInObjects);

    this.objectsMap$ = this.objects$.pipe(map(objects => {
      const map = new Map<number, CompleteObject>();
      objects.forEach(o => map.set(o.object.objectId, o));
      return map;
    }))

    this.embedStorageAndTypeInObject = switchMap(obj => this.objectTypes.getObjectTypeWithParents(obj.object.objectTypeId).pipe(switchMap(type => this.storagesWithParents.pipe(map(locations => {
      if (obj.object.storageLocation) {
        obj.storageLocationObject = locations.get(obj.object.storageLocation);
      }
      if (obj.object.inconvStorageLocation) {
        obj.inconvStorageLocationObject = locations.get(obj.object.inconvStorageLocation);
      }
      obj.objectTypeAncestry = type;
      obj.objectType = lastChild(type);
      return obj;
    })))));
  }

  refreshObjects() {
    this.lastPull = Date.now();
    this.refresh$.next(this.lastPull);
  }

  private refreshIfNeeded() {
    if (Date.now() - this.lastPull > (30 * 1000)) {
      this.refreshObjects();
    }
  }

  getTidyingData(inverted: boolean, leftDepth: number, rightDepth: number): Observable<TidyingTree[]> {
    return this.http.get<TidyingTree[]>(environment.apiurl + '/objects/tidying?inverted=' + inverted + '&leftDepth=' + leftDepth + '&rightDepth=' + rightDepth);
  }


  updateObject(object: CompleteObject): Observable<void> {
    return this.http.put<void>(environment.apiurl + '/objects/' + object.object.objectId, object.object);
  }

  // Objects
  getObjectsForType(typeId: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-type/complete/' + typeId)
      .pipe(this.embedStorageAndTypeInObjects);
  }

  getObjectsLoanedToUser(userId: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/loanedTo/' + userId)
      .pipe(this.embedStorageAndTypeInObjects);
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
    this.refreshIfNeeded();
    return this.objects$;
  }

  getObjectsForLocation(location: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-location/complete/' + location)
      .pipe(this.embedStorageAndTypeInObjects);
  }

  getObjectsForLoan(loan: number): Observable<CompleteObject[]> {
    return this.http.get<CompleteObject[]>(environment.apiurl + '/objects/by-loan/complete/' + loan)
      .pipe(this.embedStorageAndTypeInObjects);
  }

  getObjectLogs(typeId: number): Observable<ObjectLogWithUser[]> {
    return this.events.getCurrentEventId().pipe(switchMap(id => this.http.get<ObjectLogWithUser[]>(environment.apiurl + '/objects/logs/' + typeId)));
  }

  getNextSuffix(typeId: number, prefix: string): Observable<number> {
    return this.http.get<number>(environment.apiurl + '/objects/nextSuffix/' + typeId + '?prefix=' + prefix);
  }

  getObjectById(objectId: number): Observable<CompleteObject> {
    return this.http.get<CompleteObject>(environment.apiurl + '/objects/complete/' + objectId)
      .pipe(this.embedStorageAndTypeInObject);
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
      .pipe(this.embedStorageAndTypeInObject);
  }
}
