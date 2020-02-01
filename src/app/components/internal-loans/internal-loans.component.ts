import { Component, OnInit } from '@angular/core';
import {UserProfile} from '../../data/user';
import {CompleteObject} from '../../data/object';
import {ObjectsService} from '../../services/objects.service';

@Component({
  selector: 'app-internal-loans',
  templateUrl: './internal-loans.component.html',
  styleUrls: ['./internal-loans.component.css']
})
export class InternalLoansComponent implements OnInit {

  constructor(private backend: ObjectsService) { }

  selectedUser: UserProfile;
  loans: CompleteObject[];

  ngOnInit() {
  }

  onSelect($event: UserProfile) {
    this.selectedUser = $event;
    this.loans = undefined;

    if (this.selectedUser !== undefined) {
      this.backend.getObjectsLoanedToUser(this.selectedUser.id).subscribe(res => this.loans = res);
    }
  }
}
