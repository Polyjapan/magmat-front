import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProfileService} from '../../../services/profile.service';
import {UserProfile} from '../../../data/user';
import {merge, Observable, partition} from 'rxjs';
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

    if (val && typeof val === 'string') {
      this.service.getUserProfile(val).subscribe(data => {
        this.userIdChange.emit(data.id);
        this.selectedUser.emit(data);
        this.currentProfile = data;
        this.selected.setErrors(null);
      }, err => this.selected.setErrors({noProfile: true}));
    } else if (val && has(val, 'guestId') && this.allowGuests) {
      const guest = val as Guest;
      this.userIdChange.emit(undefined);
      this.selectedUser.emit(guest);
      this.currentProfile = guest;
      this.selected.setErrors(null);
    } else if (val && has(val, 'id')) {
      const user = val as UserProfile;
      this.userIdChange.emit(user.id);
      this.selectedUser.emit(user);
      this.currentProfile = user;
      this.selected.setErrors(null);
    } else {
      this.userIdChange.emit(undefined);
      this.selectedUser.emit(undefined);
      this.currentProfile = undefined;
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
    let [complete, resets] = partition(this.selected.valueChanges.pipe(debounceTime(100), distinctUntilChanged()), text => text && typeof text === 'string' && (text.match('[0-9]+') !== null || text.length >= 3));

    resets = resets.pipe(filter(el => !el || typeof el !== 'object'))

    const completeValues = complete.pipe(
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

    this.autoComplete = merge(completeValues, resets.pipe(tap(v => console.log("reseet " + v)), map(r => [])));
    resets.subscribe(reset => this.onValueChange(null))

    if (this.userId) {
      this.onValueChange(this.userId + '');
      this.selected.setValue('' + this.userId);
      this.selected.disable();
      this.service.getUser(this.userId).subscribe(u => {
        this.selected.setValue(u);
        this.selected.enable();
      });
    }
  }

  public reset() {
    this.selected.reset();
    this.onValueChange(null);
  }

  private triggerSearch(val: string) {
    this.autoComplete = this.service.searchUsers(val);
  }
}
