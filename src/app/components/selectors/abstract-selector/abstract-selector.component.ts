import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {normalizeString} from '../../../utils/normalize.string';

@Component({
  template: '',
  styleUrls: ['./abstract-selector.component.css']
})
export abstract class AbstractSelectorComponent<T> implements OnInit, OnChanges {
  @Input() label: string;
  @Input() emptyLabel: string = 'Aucun';

  @Input() selected: number;
  @Input() selectedObject: T;
  @Output() selectedChange = new EventEmitter<number>();
  @Output() selectedObjectChange = new EventEmitter<T>();

  autoSelect = false;

  possibleValues: [number, T, string][] = [];

  filteredValues: Observable<[number, T][]>;
  searchControl = new FormControl();
  abstract defaultLabel: string;

  abstract toSearchableString(v: T): string

  abstract getPossibleValues(): Observable<T[]>

  abstract getId(v: T | undefined): number | undefined;

  abstract displayValue(val?: [number, T]): string | undefined

  onValueChange(value) {
    if (value && typeof value === 'string') {
      const sanitized = normalizeString(value);
      const foundV = this.possibleValues.find(v => v[2] === sanitized);
      if (foundV) {
        this.selectedObjectChange.emit(foundV[1]);
        this.selectedChange.emit(foundV[0]);
        this.searchControl.setErrors(null);
      } else {
        this.selectedObjectChange.emit(undefined);
        this.selectedChange.emit(undefined);
        this.searchControl.setErrors({notFound: true});
      }
    } else if (value) {
      const [id, stor] = value as [number, T];
      this.selectedObjectChange.emit(stor);
      this.selectedChange.emit(id);
      this.searchControl.setErrors(null);
    } else {
      this.selectedChange.emit(undefined);
      this.selectedObjectChange.emit(undefined);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.firstChange && this.possibleValues.length > 0) {
      console.log('changes selected');
      this.externalChanges(changes.selected.currentValue);
    } else if (changes.selectedObject && changes.selectedObject.firstChange && this.possibleValues.length > 0) {
      this.externalChanges(this.getId(changes.selectedObject.currentValue as T));
    }
  }

  refresh() {
    this.getPossibleValues()
      .subscribe(values => {
        this.possibleValues = values.map(v => [this.getId(v), v, normalizeString(this.toSearchableString(v))]);

        const selected = this.getId(this.selectedObject) ?? this.selected;

        if (selected) {
          this.searchControl.setValue(this.possibleValues.find(v => v[0] === selected));
        }
      });
  }

  ngOnInit() {
    this.refresh();

    this.filteredValues = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => {
          if (!name || name.trim().length === 0) return []

          const base = name && name.length > 0 ? this.possibleValues.filter(t => t[2].indexOf(normalizeString(name)) !== -1) : this.possibleValues;

          return base.sort((a, b) => {
            if (a[2] === name) return -1
            if (b[2] === name) return 1

            if (a[0] == name) return -1
            if (b[0] == name) return 1

            if (a[2].startsWith(name)) {
              if (!b[2].startsWith(name)) {
                return -1
              }
            } else if (b[2].startsWith(name)) {
              return 1
            }
            return -(a.length - b.length)
          }).slice(0, 20).map(l => [l[0], l[1]]);
        })
      );

    this.searchControl.registerOnChange(v => this.onValueChange(v));
  }


  private externalChanges(selectedId: number) {
    if (selectedId !== undefined && selectedId !== null) {
      const [foundId, foundV, _] = this.possibleValues.find(v => v[0] === selectedId);
      this.searchControl.setValue([foundId, foundV]);
    } else {
      this.searchControl.reset();
    }
  }

  reset() {
    this.selectedChange.emit(undefined);
    this.selectedObjectChange.emit(undefined);
    this.searchControl.setValue('');
  }
}


