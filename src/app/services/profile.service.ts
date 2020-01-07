import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CompleteObjectType, ObjectType} from '../data/object-type';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {CompleteObject, ObjectCreateResult, SingleObject} from '../data/object';
import {UserProfile} from '../data/user';
import {tryCatch} from 'rxjs/internal-compatibility';

@Injectable({providedIn: 'root'})
export class ProfileService {
  constructor(private http: HttpClient) {
  }

  getUserProfile(input: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(environment.apiurl + '/people/' + input);
  }

  getUser(id: number): Observable<UserProfile> {
    return this.getUserProfile('' + id);
  }
}
