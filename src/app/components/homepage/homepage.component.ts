import {Component, OnInit} from '@angular/core';
import {CompleteObject} from '../../data/object';
import {StorageLocation} from '../../data/storage-location';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  quickLoanTag: string;
  quickLoanObject: CompleteObject;

  quickMoveStorage: number;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  redirectTo($event: CompleteObject) {
    if (!isNullOrUndefined($event) && !isNullOrUndefined($event.object)) {
      this.router.navigate(['/', 'objects', $event.object.objectId]);
    }
  }
}
