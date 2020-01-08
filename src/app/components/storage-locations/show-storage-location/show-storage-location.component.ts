import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {StorageLocation} from '../../../data/storage-location';
import {CompleteObject, statusToString} from '../../../data/object';
import {ObjectsService} from '../../../services/objects.service';
import {Observable} from 'rxjs';
import Swal from 'sweetalert2';

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


  constructor(private ar: ActivatedRoute, private sl: StorageLocationsService, private obj: ObjectsService) { }

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
}
