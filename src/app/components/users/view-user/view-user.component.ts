import {Component, OnInit, ViewChild} from '@angular/core';
import {CompleteExternalLoan, LoanState, loanStateToText} from '../../../data/external-loan';
import {ActivatedRoute} from '@angular/router';
import {LoansService} from '../../../services/loans.service';
import {CompleteObject, ObjectStatus, statusToString} from '../../../data/object';
import {ObjectsService} from '../../../services/objects.service';
import {ObjectType} from '../../../data/object-type';
import {StorageLocation, storageLocationToString} from '../../../data/storage-location';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {isNullOrUndefined} from 'util';
import Swal from 'sweetalert2';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {filter, map, startWith, switchMap} from 'rxjs/operators';
import {SelectObjectTypeComponent} from '../../selectors/select-object-type/select-object-type.component';
import {Guest} from '../../../data/guest';
import {GuestsService} from '../../../services/guests.service';
import {ProfileService} from '../../../services/profile.service';
import {UserProfile} from '../../../data/user';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  id: number;
  isGuest: boolean;
  guest$: Observable<Guest>;
  user$: Observable<UserProfile>;

  constructor(private guests: GuestsService,
              private users: ProfileService,
              private ar: ActivatedRoute) {
  }

  ngOnInit() {
    this.ar.paramMap.pipe(
      switchMap(urlParams => this.ar.data.pipe(map(data => [urlParams, data])))
    ).subscribe(params => {
      const paramMap = params[0];
      const data = params[1];

      this.isGuest = (data.isGuest === true);

      this.id = Number.parseInt(paramMap.get('id'), 10);

      if (this.isGuest) {
        this.guest$ = this.guests.getGuest(this.id);
      } else {
        this.user$ = this.users.getUser(this.id);
      }

    });
  }
}
