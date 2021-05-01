import { Component, OnInit } from '@angular/core';
import {StorageLocationsService} from '../../services/storage-locations.service';
import {Observable} from 'rxjs';
import {StorageLocation} from '../../data/storage-location';
import { MatDialog } from '@angular/material/dialog';
import {CreateStorageLocationComponent} from './create-storage-location/create-storage-location.component';

@Component({
  selector: 'app-storage-locations',
  templateUrl: './storage-locations.component.html',
  styleUrls: ['./storage-locations.component.css']
})
export class StorageLocationsComponent implements OnInit {
  storageLocations: Observable<StorageLocation[]>;

  constructor(private locations: StorageLocationsService, private dialog: MatDialog) { }

  ngOnInit() {
    this.storageLocations = this.locations.getStorageLocations();
  }

  create() {
    this.dialog.open(CreateStorageLocationComponent);
  }

  refresh() {
    this.locations.forceRefreshLocations();
  }

}
