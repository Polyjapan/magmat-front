import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {CompleteObjectType, ObjectType} from '../../data/object-type';
import {MatTableDataSource} from '@angular/material';
import {ObjectsService} from '../../services/objects.service';
import { storageLocationToString } from 'src/app/data/storage-location';
import { externalLoanToString } from 'src/app/data/external-loan';

@Component({
  selector: 'app-object-types',
  templateUrl: './object-types.component.html',
  styleUrls: ['./object-types.component.css']
})
export class ObjectTypesComponent implements OnInit {
  types: Observable<CompleteObjectType[]>;
  typesSource = new MatTableDataSource<CompleteObjectType>();
  storageLocationToString = storageLocationToString;
  externalLoanToString = externalLoanToString;

  constructor(private service: ObjectsService) { }

  ngOnInit() {
    this.types = this.service.getObjectTypes();
    this.types.subscribe(data => this.typesSource.data = data);
  }

}
