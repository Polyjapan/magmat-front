import {Component, OnInit} from '@angular/core';
import {ObjectsService} from '../../../services/objects.service';
import {CompleteObject} from '../../../data/object';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-all-objects',
  templateUrl: './all-objects.component.html',
  styleUrls: ['./all-objects.component.css']
})
export class AllObjectsComponent implements OnInit {
  objects$: Observable<CompleteObject[]>;

  constructor(private objects: ObjectsService) {
    this.objects$ = objects.getObjects();
  }

  ngOnInit(): void {
  }

}
