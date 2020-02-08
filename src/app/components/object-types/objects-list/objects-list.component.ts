import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {CompleteObject, statusToString} from '../../../data/object';
import { storageLocationToString } from 'src/app/data/storage-location';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-objects-list',
  templateUrl: './objects-list.component.html',
  styleUrls: ['./objects-list.component.css']
})
export class ObjectsListComponent implements OnChanges {
  @Input() objects: CompleteObject[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: MatTableDataSource<CompleteObject> = new MatTableDataSource(this.objects);

  dataAccessor(o: CompleteObject, column: string): string {
    switch (column) {
      case 'status':
        return statusToString(o.object.status);
      case 'inConvStorage':
        return storageLocationToString(o.inconvStorageLocationObject);
      case 'name':
        return o.objectType.name + ' ' + o.object.suffix;
      case 'reservedFor':
        return o.reservedFor ? o.reservedFor.details.firstName + ' ' + o.reservedFor.details.lastName : '';
      default:
        return o.object[column];
    }
  }

  constructor() { }

  ngOnChanges(changes) {
    this.dataSource.data = this.objects;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.dataAccessor;
  }

}
