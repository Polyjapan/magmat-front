import {Component, Input} from '@angular/core';
import {lastChild, objectHasParentObjectType, ObjectTypeAncestry, objectTypeToString} from '../../../data/object-type';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObjectTypesService} from '../../../services/object-types.service';
import {AbstractSelectorComponent} from '../abstract-selector/abstract-selector.component';

@Component({
  selector: 'app-select-object-type',
  templateUrl: '../abstract-selector/abstract-selector.component.html',
  styleUrls: ['./select-object-type.component.css']
})
export class SelectObjectTypeComponent extends AbstractSelectorComponent<ObjectTypeAncestry> {
  @Input() excludeChildrenOf: number;
  defaultLabel: string = 'Choisissez une catégorie d\'objets...';

  constructor(private os: ObjectTypesService) {
    super();
  }

  toString(v: ObjectTypeAncestry): string {
    return objectTypeToString(v, undefined);
  }

  getPossibleValues(): Observable<ObjectTypeAncestry[]> {
    return this.os.getObjectTypesWithParents()
      .pipe(map(m => Array.from(m.values())
        .filter(el => !this.excludeChildrenOf || !objectHasParentObjectType(el, this.excludeChildrenOf))));
  }

  getId(v: ObjectTypeAncestry): number {
    return lastChild(v)?.objectTypeId;
  }

  /*
  @Input() label: string;
  @Input() emptyLabel: string = 'Aucun';

  @Input() selected: number;
  @Input() selectedObject: ObjectType;
  @Output() selectedTypeChange = new EventEmitter<ObjectType>();
  @Output() selectedObjectChange = new EventEmitter<number>();

  types: [number, ObjectTypeAncestry, string][];
  objectTypeSearchControl = new FormControl();
  filteredTypes: Observable<ObjectType[]>;*/

  displayValue(val?: [number, ObjectTypeAncestry]): string {
    return (val ? objectTypeToString(val[1], undefined) : undefined) ?? 'Aucune catégorie sélectionnée';
  }

  /**
   * @deprecated
   */
  refreshTypes() {
    this.refresh();
  }

  /*
  refreshTypes() {
    const s = this.os.getObjectTypesWithParents()
      .subscribe(types => {
        this.types = Array.from(types.entries()).map(e => [e[0], e[1], normalizeString(objectTypeToString(e[1]))]);

        const selected = this.selectedObject?.objectTypeId ?? this.selected;
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
*//*
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

  }*/
}
