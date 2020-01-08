import {Component, OnInit} from '@angular/core';
import {StorageLocation} from '../../../data/storage-location';
import {MatDialogRef} from '@angular/material';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-storage-location',
  templateUrl: './create-storage-location.component.html',
  styleUrls: ['./create-storage-location.component.css']
})
export class CreateStorageLocationComponent implements OnInit {
  storageLocation: StorageLocation;
  sending: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateStorageLocationComponent>,
    private service: StorageLocationsService
  ) {
  }

  ngOnInit() {
    this.storageLocation = new StorageLocation();
    this.storageLocation.inConv = false;
  }

  submit($event) {
    if (!this.sending) {
      this.sending = true;
    } else {
      return;
    }

    this.service.createStorage(this.storageLocation)
      .subscribe(succ => {
        this.service.forceRefreshLocations();
        this.dialogRef.close();
        Swal.fire('Emplacement créé', 'L\'emplacement de stockage a bien été créé.', 'success');
      }, err => {
        Swal.fire('Oups', 'Une erreur s\'est produite', 'error');
        this.sending = false;
      })

  }

}
