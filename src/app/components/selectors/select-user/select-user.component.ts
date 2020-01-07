import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProfileService} from '../../../services/profile.service';
import {UserProfile} from '../../../data/user';
import {fromEvent, Observable, Subscriber} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import {tryCatch} from 'rxjs/internal-compatibility';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit {
  @Input() label: string = 'Choisir un utilisateur';
  @Output() selectedId = new EventEmitter<number>();
  @Output() selectedUser = new EventEmitter<UserProfile>();

  selected: string;
  @ViewChild('input', {static: true}) inputElement: NgModel;

  currentProfile: UserProfile;

  private inputObservable = new Observable<string>(subscriber => this.inputSubscriber = subscriber);
  private inputSubscriber: Subscriber<string>;

  constructor(private service: ProfileService) {
  }

  ngOnInit() {
    this.inputObservable
      .pipe(
        filter(text => text.length >= 1),
        filter(text => text.match('[0-9]+') !== null),
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe(val => {
        this.service.getUserProfile(val).subscribe(data => {
          this.selectedId.emit(data.id);
          this.selectedUser.emit(data);
          this.currentProfile = data;
          this.inputElement.control.setErrors(null);
        }, err => this.inputElement.control.setErrors({noProfile : true}));
    });
  }

  update($event: string) {
    this.selectedId.emit(undefined);
    this.selectedUser.emit(undefined);
    this.currentProfile = undefined;
    this.inputSubscriber.next($event);
  }
}
