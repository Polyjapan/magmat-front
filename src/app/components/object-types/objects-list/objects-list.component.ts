import {Component, Input, OnInit} from '@angular/core';
import {CompleteObject} from '../../../data/object';
import { storageLocationToString } from 'src/app/data/storage-location';

@Component({
  selector: 'app-objects-list',
  templateUrl: './objects-list.component.html',
  styleUrls: ['./objects-list.component.css']
})
export class ObjectsListComponent implements OnInit {
  @Input() objects: CompleteObject[];
  storageLocationToString = storageLocationToString;

  constructor() { }

  ngOnInit() {
  }

}
