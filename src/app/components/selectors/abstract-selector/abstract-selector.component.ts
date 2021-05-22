import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {normalizeString} from '../../../utils/normalize.string';

@Component({
  selector: 'app-abstract-selector',
  templateUrl: './abstract-selector.component.html',
  styleUrls: ['./abstract-selector.component.css']
})
export abstract class AbstractSelectorComponent<T> implements OnInit, OnChanges {
  @Input() label: string;
  @Input() emptyLabel: string = 'Aucun';
  @Input() excludeChildrenOf: number;

  @Input() selected: number;
  @Input() selectedLocation: T;
  @Output() selectedChange = new EventEmitter<number>();
  @Output() selectLocationChange = new EventEmitter<T>();

  possibleValues: [number, T, string][] = [];

  filteredLocations: Observable<[number, T][]>;
  searchControl = new FormControl();

  abstract display(v: T): string

  abstract getPossibleValues(): Observable<T[]>

  abstract getId(v: T | undefined): number | undefined;

  abstract get defaultLabel(): string;

  onValueChange(value) {
    if (value && typeof value === 'string') {
      const sanitized = normalizeString(value)
      const foundV = this.possibleValues.find(v => v[2] === sanitized)
      if (foundV) {
        this.selectLocationChange.emit(foundV[1]);
        this.selectedChange.emit(foundV[0]);
        this.searchControl.setErrors(null);
      } else {
        this.selectLocationChange.emit(undefined);
        this.selectedChange.emit(undefined)
        this.searchControl.setErrors({notFound: true});
      }
    } else if (value) {
      const [id, stor] = value as [number, T]
      this.selectLocationChange.emit(stor)
      this.selectedChange.emit(id)
      this.searchControl.setErrors(null);
    } else {
      this.selectedChange.emit(undefined);
      this.selectLocationChange.emit(undefined)
    }
  }

  private externalChanges(selectedId: number) {
    if (selectedId !== undefined && selectedId !== null) {
      const [foundId, foundV, _] = this.possibleValues.find(v => v[0] === selectedId)
      this.searchControl.setValue([foundId, foundV]);
    } else {
      this.searchControl.reset();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.firstChange && this.possibleValues.length > 0) {
      this.externalChanges(changes.selected.currentValue);
    } else if (changes.selectedLocation && changes.selectedLocation.firstChange && this.possibleValues.length > 0) {
      this.externalChanges(this.getId(changes.selectedLocation.currentValue as T));
    }
  }

  ngOnInit() {
    this.getPossibleValues()
      .subscribe(values => {
        this.possibleValues = values.map(v => [this.getId(v), v, normalizeString(this.display(v))]);

        if (this.selected) {
          this.searchControl.setValue(this.possibleValues.filter(v => v[0] === this.selected)[0]);
        }
      });

    this.filteredLocations = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => {
          const base = name && name.length > 0 ? this.possibleValues.filter(t => t[2].indexOf(normalizeString(name)) !== -1) : this.possibleValues

          return base.map(l => [l[0], l[1]])
        })
      );

    this.searchControl.registerOnChange(v => this.onValueChange(v))
  }

  displayValue(val?: [number, T]): string | undefined {
    return val ? this.display(val[1]) : this.emptyLabel;
  }

}


