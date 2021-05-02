import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProfileService} from '../../../services/profile.service';
import {UserProfile} from '../../../data/user';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Guest} from '../../../data/guest';
import {GuestsService} from '../../../services/guests.service';
import has = Reflect.has;
import {of} from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit {
  @Input() label: string = 'Choisir un utilisateur';
  @Input() userId: number;
  @Input() allowGuests: boolean = true;
  @Output() userIdChange = new EventEmitter<number>();
  @Output() selectedUser = new EventEmitter<(UserProfile | Guest)>();

  currentProfile: UserProfile | Guest;
  autoComplete: Observable<(UserProfile | Guest)[]>;

  selected = new FormControl();

  constructor(private service: ProfileService, private guests: GuestsService) {
  }

  onValueChange(val) {
    console.log(val);
    console.log(typeof val);

    if (typeof val === 'string') {
      this.service.getUserProfile(val).subscribe(data => {
        this.userIdChange.emit(data.id);
        this.selectedUser.emit(data);
        this.currentProfile = data;
        this.selected.setErrors(null);
      }, err => this.selected.setErrors({noProfile: true}));
    } else if (has(val, 'guestId') && this.allowGuests) {
      const guest = val as Guest;
      this.userIdChange.emit(undefined);
      this.selectedUser.emit(guest);
      this.currentProfile = guest;
      this.selected.setErrors(null);
    } else if (has(val, 'id')) {
      const user = val as UserProfile;
      this.userIdChange.emit(user.id);
      this.selectedUser.emit(user);
      this.currentProfile = user;
      this.selected.setErrors(null);
    }
  }

  displayFunc(user: Guest | UserProfile): string {
    if (!user || typeof user !== 'object') {
      return undefined;
    }

    if (has(user, 'guestId')) {
      const guest: Guest = user as Guest;

      return guest.name + (guest.organization ? ' - ' + guest.organization : '') + ' (Invité #' + guest.guestId + ')';
    } else if (has(user, 'id')) {
      user = user as UserProfile;

      return user.details.firstName + ' ' + user.details.lastName + ' (Utilisateur #' + user.id + ' - ' + user.email + ')';
    }
  }

  ngOnInit() {
    this.autoComplete = this.selected.valueChanges
      .pipe(
        startWith(''),
        filter(text => text.length >= 1),
        filter(text => text.match('[0-9]+') !== null || text.length >= 3),
        debounceTime(200),
        distinctUntilChanged(),

        map(value => typeof value === 'string' ? value.toLowerCase() : this.displayFunc(value)),
        switchMap(name => {
          if (name.match('^s?[0-9]+$') !== null) {
            return this.service.getUserProfile(name).pipe(map(profile => [name, [profile] as (UserProfile | Guest)[]]));
          } else {
            return this.service.searchUsers(name).pipe(map(out => [name, out as (UserProfile | Guest)[]]));
          }
        }),
        switchMap(data => {
          const name = (data[0] as string).toLowerCase();
          const users = (data[1] as (UserProfile | Guest)[]);

          if (name.match('^s[0-9]+$') || !this.allowGuests) {
            return of(users);
          } else {
            return this.guests.getGuests().pipe(
              map(guests => {
                if (name.match('^[0-9]+$')) {
                  const id = Number.parseInt(name, 10);
                  return guests.filter(elem => elem.guestId === id);
                } else {
                  return guests.filter(elem => this.displayFunc(elem).toLowerCase().indexOf(name) !== -1);
                }
              }),
              map(guests => guests as (UserProfile | Guest)[]),
              map(guests => {
                const arr = [];
                users.forEach(e => arr.push(e));
                guests.forEach(e => arr.push(e));
                return arr;
              })
            );
          }
        })
      );

    if (this.userId) {
      this.onValueChange(this.userId + '');
      this.selected.setValue('' + this.userId);
      this.selected.disable();
      this.service.getUser(this.userId).subscribe(u => {
        this.selected.setValue(u);
        this.selected.enable();
      });
    }

    /*this.inputObservable
      .pipe(
        filter(text => text.length >= 1),
        filter(text => text.match('[0-9]+') !== null || text.length >= 3),
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe(val => {
        console.log('<> ' + val);

        if (val.match('[0-9]+') !== null) {
          this.onValueChange(val);
        } else {
          this.triggerSearch(val);
        }
    });

    if (this.selectedId) {
      this.selected = '' + this.selectedId;
      this.onValueChange(this.selected);
    }*/
  }

  update($event: string) {
    //this.selectedIdChange.emit(undefined);
    this.selectedUser.emit(undefined);
    this.currentProfile = undefined;
    // this.inputSubscriber.next($event);
  }

  public reset() {
    this.selected.reset();
    this.update('');
  }

  private triggerSearch(val: string) {
    this.autoComplete = this.service.searchUsers(val);
  }
}
