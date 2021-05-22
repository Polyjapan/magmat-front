import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {lastChild, ObjectType, ObjectTypeAncestry, objectTypeToString} from '../../../data/object-type';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ObjectsService} from '../../../services/objects.service';
import {ObjectTypesService} from '../../../services/object-types.service';
import {normalizeString} from '../../../utils/normalize.string';

@Component({
  selector: 'app-select-object-type',
  templateUrl: './select-object-type.component.html',
  styleUrls: ['./select-object-type.component.css']
})
export class SelectObjectTypeComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() emptyLabel: string = 'Aucun';

  @Input() selected: number;
  @Input() selectedType: ObjectType;
  @Output() selectedTypeChange = new EventEmitter<ObjectType>();
  @Output() selectedChange = new EventEmitter<number>();

  types: [number, ObjectTypeAncestry, string][];
  objectTypeSearchControl = new FormControl();
  filteredTypes: Observable<ObjectType[]>;

  constructor(private os: ObjectTypesService) { }

  refreshTypes() {
    const s = this.os.getObjectTypesWithParents()
      .subscribe(types => {
        this.types = Array.from(types.entries()).map(e => [e[0], e[1], normalizeString(objectTypeToString(e[1]))]);

        const selected = this.selectedType?.objectTypeId ?? this.selected;
        if (selected) {
          this.objectTypeSearchControl.setValue(this.types.find(tpe => tpe[0] === selected));
        }

        s.unsubscribe()
      });
  }

  ngOnInit() {

   /* this.filteredTypes = this.objectTypeSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.types.filter(t => t.name.toLowerCase().indexOf(name.toLowerCase()) === 0) : this.types)
      );
*/
    this.objectTypeSearchControl.valueChanges.subscribe(v => {
      if (typeof v === 'object' && v.name && v.objectTypeId) {
        this.selectedTypeChange.emit(v as ObjectType);
      } else {
        this.selectedTypeChange.emit(undefined);
      }
    });

    this.refreshTypes();
  }


  displayFunc(tpe?: ObjectTypeAncestry | null): string {
    const child = lastChild(tpe);
    return tpe === null ? this.emptyLabel : objectTypeToString(tpe) + ' (#' + child.objectTypeId + ')';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedType && changes.selectedType.firstChange) {
      if (changes.selectedType.currentValue !== undefined && changes.selectedType.currentValue !== null) {
        this.objectTypeSearchControl.setValue(changes.selectedType.currentValue as ObjectType);
      } else {
        this.objectTypeSearchControl.reset();
      }
    }
  }


  onValueChange($event: any) {

  }
}
