import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {ObjectType} from '../../data/object-type';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ObjectsService} from '../../services/objects.service';
import {externalLoanToString} from 'src/app/data/external-loan';

@Component({
  selector: 'app-object-types',
  templateUrl: './object-types.component.html',
  styleUrls: ['./object-types.component.css']
})
export class ObjectTypesComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  types: Observable<ObjectType[]>;
  typesSource = new MatTableDataSource<ObjectType>();
  filter: string = '';

  constructor(private service: ObjectsService) {
  }

  dataAccessor(o: ObjectType, column: string): string {
    switch (column) {
      case 'sourceLoan':
        return externalLoanToString(o.partOfLoanObject);
      case 'name':
        return o.name;
      default:
        return o[column];
    }
  }

  ngOnInit() {
    this.types = this.service.getObjectTypes();
    this.types.subscribe(data => this.typesSource.data = data);
    this.typesSource.sort = this.sort;
    this.typesSource.sortingDataAccessor = this.dataAccessor;
    this.typesSource.filterPredicate = (data: ObjectType, search: string) =>
      ['sourceLoan', 'name']
        .map(s => this.dataAccessor(data, s))
        .join(' ').toLowerCase().includes(search.toLowerCase());
  }

}
