import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ObjectType} from '../../../data/object-type';
import {FormControl} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ObjectsService} from '../../../services/objects.service';

@Component({
  selector: 'app-select-object-type',
  templateUrl: './select-object-type.component.html',
  styleUrls: ['./select-object-type.component.css']
})
export class SelectObjectTypeComponent implements OnInit, OnChanges {
  @Input() selectedType: ObjectType;
  @Output() selectedTypeChange = new EventEmitter<ObjectType>();

  types: ObjectType[];
  objectTypeSearchControl = new FormControl();
  filteredTypes: Observable<ObjectType[]>;

  constructor(private os: ObjectsService) { }

  refreshTypes() {
    this.os.getObjectTypes().subscribe(tpes => this.types = tpes.map(o => o.objectType));
  }

  ngOnInit() {
    this.filteredTypes = this.objectTypeSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.types.filter(t => t.name.toLowerCase().indexOf(name.toLowerCase()) === 0) : this.types)
      );

    this.objectTypeSearchControl.valueChanges.subscribe(v => {
      if (typeof v === 'object' && v.name && v.objectTypeId) {
        this.selectedTypeChange.emit(v as ObjectType);
      } else {
        this.selectedTypeChange.emit(undefined);
      }
    });

    this.refreshTypes();
  }


  displayFunc(tpe: ObjectType): string {
    return isNullOrUndefined(tpe) ? '' : tpe.name + ' (#' + tpe.objectTypeId + ')';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedType && changes.selectedType.firstChange) {
      if (!isNullOrUndefined(changes.selectedType.currentValue)) {
        this.objectTypeSearchControl.setValue(changes.selectedType.currentValue as ObjectType);
      } else {
        this.objectTypeSearchControl.reset();
      }
    }
  }


}
