import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ObjectsService} from '../../../services/objects.service';
import {CompleteObjectType} from '../../../data/object-type';
import {storageLocationToString} from '../../../data/storage-location';
import {CompleteObject, ObjectStatus, SingleObject} from '../../../data/object';
import {externalLoanToString} from 'src/app/data/external-loan';
import {MatTableDataSource} from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-object-type',
  templateUrl: './show-object-type.component.html',
  styleUrls: ['./show-object-type.component.css']
})
export class ShowObjectTypeComponent implements OnInit {
  objectType: CompleteObjectType;
  storageLocationToString = storageLocationToString;
  objects: CompleteObject[] = [];
  id: number;

  constructor(private route: ActivatedRoute, private objectsService: ObjectsService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('typeId'), 10);
      this.objectsService.getObjectType(this.id).subscribe(tpe => this.objectType = tpe);
      this.refreshObjects();
    });
  }

  refreshObjects() {
    this.objectsService.getObjectsForType(this.id).subscribe(objs => this.objects = objs);
  }
}
