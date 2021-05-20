import {Component, OnInit} from '@angular/core';
import {StorageLocationsService} from '../../services/storage-locations.service';
import {Observable} from 'rxjs';
import {StorageTree} from '../../data/storage-location';
import {MatDialog} from '@angular/material/dialog';
import {CreateStorageLocationComponent} from './create-storage-location/create-storage-location.component';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-storage-locations',
  templateUrl: './storage-locations.component.html',
  styleUrls: ['./storage-locations.component.css']
})
export class StorageLocationsComponent implements OnInit {
  storageLocations: Observable<StorageTree[]>;

  constructor(private locations: StorageLocationsService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.storageLocations = this.locations.getStorages().pipe(tap(t => console.log(t)));
  }

  create() {
    this.dialog.open(CreateStorageLocationComponent);
  }

  refresh() {
    this.locations.forceRefreshLocations();
  }

}
