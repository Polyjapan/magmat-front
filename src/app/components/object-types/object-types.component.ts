import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {CompleteObjectType} from '../../data/object-type';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ObjectsService} from '../../services/objects.service';
import {storageLocationToString} from 'src/app/data/storage-location';
import {externalLoanToString} from 'src/app/data/external-loan';
import {CompleteObject} from '../../data/object';

@Component({
  selector: 'app-object-types',
  templateUrl: './object-types.component.html',
  styleUrls: ['./object-types.component.css']
})
export class ObjectTypesComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  types: Observable<CompleteObjectType[]>;
  typesSource = new MatTableDataSource<CompleteObjectType>();
  filter: string = '';

  constructor(private service: ObjectsService) {
  }

  dataAccessor(o: CompleteObjectType, column: string): string {
    switch (column) {
      case 'inConvStorage':
        return storageLocationToString(o.inconvStorageLocationObject);
      case 'offConvStorage':
        return storageLocationToString(o.storageLocationObject);
      case 'sourceLoan':
        return externalLoanToString(o.partOfLoanObject);
      case 'name':
        return o.objectType.name;
      default:
        return o[column];
    }
  }

  ngOnInit() {
    this.types = this.service.getObjectTypes();
    this.types.subscribe(data => this.typesSource.data = data);
    this.typesSource.sort = this.sort;
    this.typesSource.sortingDataAccessor = this.dataAccessor;
    this.typesSource.filterPredicate = (data: CompleteObjectType, search: string) =>
      ['inConvStorage', 'offConvStorage', 'sourceLoan', 'name']
        .map(s => this.dataAccessor(data, s))
        .join(' ').toLowerCase().includes(search.toLowerCase());
  }

}
