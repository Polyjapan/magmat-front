import {Component, Inject, OnInit} from '@angular/core';
import {StorageLocation} from '../../../data/storage-location';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import Swal from 'sweetalert2';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-create-storage-location',
  templateUrl: './create-storage-location.component.html',
  styleUrls: ['./create-storage-location.component.css']
})
export class CreateStorageLocationComponent implements OnInit {
  storageLocation: StorageLocation;
  sending: boolean = false;

  constructor(public dialogRef: MatDialogRef<CreateStorageLocationComponent>,
              private service: StorageLocationsService,
              @Inject(MAT_DIALOG_DATA) private data?: StorageLocation) {
    if (data) {
      this.storageLocation = data;
    } else {
      this.storageLocation = new StorageLocation();
      this.storageLocation.inConv = false;
    }
  }

  get isUpdate(): boolean {
    return this.storageLocation && !isNullOrUndefined(this.storageLocation.storageLocationId);
  }

  ngOnInit() {
  }

  submit($event) {
    if (!this.sending) {
      this.sending = true;
    } else {
      return;
    }

    this.service.createUpdateStorage(this.storageLocation)
      .subscribe(succ => {
        this.service.forceRefreshLocations();
        this.dialogRef.close();
        Swal.fire('Emplacement ' + (this.isUpdate ? 'modifié' : 'créé'), 'L\'emplacement de stockage a bien été ' + (this.isUpdate ? 'modifié' : 'créé') + '.', 'success');
      }, err => {
        Swal.fire('Oups', 'Une erreur s\'est produite', 'error');
        this.sending = false;
      });

  }

}
