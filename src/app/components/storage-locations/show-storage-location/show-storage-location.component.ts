import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {StorageLocation} from '../../../data/storage-location';
import {CompleteObject, statusToString} from '../../../data/object';
import {ObjectsService} from '../../../services/objects.service';
import {Observable} from 'rxjs';
import Swal from 'sweetalert2';
import {CreateStorageLocationComponent} from '../create-storage-location/create-storage-location.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-show-storage-location',
  templateUrl: './show-storage-location.component.html',
  styleUrls: ['./show-storage-location.component.css']
})
export class ShowStorageLocationComponent implements OnInit {
  id: number;
  location: StorageLocation;
  items: Observable<CompleteObject[]>;
  statusToString = statusToString;


  constructor(private ar: ActivatedRoute, private router: Router, private sl: StorageLocationsService, private obj: ObjectsService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.ar.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('id'), 10);
      this.refresh();
    });
  }

  refresh() {
    this.sl.getStorageLocation(this.id).subscribe(loc => this.location = loc);
    this.items = this.obj.getObjectsForLocation(this.id);
  }

  isInherited(elem: CompleteObject) {
    const isInConv = this.location.inConv;

    if (isInConv) {
      return elem.object.inconvStorageLocation === undefined;
    } else {
      return elem.object.storageLocation === undefined;
    }
  }

  update() {
    this.dialog.open(CreateStorageLocationComponent, {data: this.location});
  }

  delete() {
    Swal.fire({
      titleText: 'Êtes vous sûr ?', text: 'Voulez vous vraiment supprimer cet emplacement de stockage ?',
      showConfirmButton: true, showCancelButton: true, confirmButtonText: 'Oui', cancelButtonText: 'Non'
    }).then(result => {
      if (result && result.value === true) {
        this.location = undefined;

        this.sl.deleteStorage(this.id).subscribe(res => {
          this.sl.forceRefreshLocations();
          this.router.navigate(['..'], {relativeTo: this.ar});
        }, fail => {
          Swal.fire('Oups', 'On dirait que ça n\'a pas marché.', 'error');
          this.refresh();
        });
      }
    });
  }
}
