import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {objectHasParentLocation, Storage, storageLocationToString, StorageTree} from '../../../data/storage-location';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {EventsService} from '../../../services/events.service';

@Component({
  selector: 'app-select-storage',
  templateUrl: './select-storage.component.html',
  styleUrls: ['./select-storage.component.css']
})
export class SelectStorageComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() emptyLabel: string = 'Aucun';
  @Input() selected: number;
  @Input() excludeChildrenOf: number;
  @Input('inconv') inconv: boolean = undefined;

  @Output() selectedChange = new EventEmitter<number>();
  @Output() selectLocation = new EventEmitter<StorageTree>();

  locations: [number, StorageTree, string][] = [];

  filteredLocations: Observable<[number, StorageTree][]>;
  searchControl = new FormControl();

  constructor(private service: StorageLocationsService) {
  }


  onValueChange(value) {
    console.log("CHANGE")
    console.log(value)

    if (value && typeof value === 'string') {
      const sanitized = SelectStorageComponent.normalizeString(value)
      const loc = this.locations.find(loc => loc[2] === sanitized)
      if (loc) {
        this.selectLocation.emit(loc[1]);
        this.selectedChange.emit(loc[0]);
        this.searchControl.setErrors(null);
      } else {
        this.selectLocation.emit(undefined);
        this.selectedChange.emit(undefined)
        this.searchControl.setErrors({notFound: true});
      }
    } else if (value) {
      const [id, stor] = value as [number, StorageTree]
      this.selectLocation.emit(stor)
      this.selectedChange.emit(id)
      this.searchControl.setErrors(null);
    } else {
      this.selectedChange.emit(undefined);
      this.selectLocation.emit(undefined)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.firstChange && this.locations.length > 0) {
      if (changes.selected.currentValue !== undefined && changes.selected.currentValue !== null) {
        const [foundId, foundLoc, _] = this.locations
          .find(loc => loc[0] === changes.selected.currentValue && (!this.excludeChildrenOf || !objectHasParentLocation(loc[1], this.excludeChildrenOf)))
        this.searchControl.setValue([foundId, foundLoc]);
      } else {
        this.searchControl.reset();
      }
    } else if (changes.inConv !== undefined) {
      this.searchControl.setValue(this.searchControl.value)
    }
  }

  ngOnInit() {
    this.service.getStoragesWithParents(this.inconv)
      .subscribe(locations => {
        this.locations = Array.from(locations.entries())
          .map(loc => [loc[0], loc[1], SelectStorageComponent.normalizeString(storageLocationToString(loc[1]))]);

        if (this.selected) {
          this.searchControl.setValue(this.locations.filter(loc => loc[0] === this.selected)[0]);
        }
      });


    this.filteredLocations = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => {
          let base = this.locations
              .filter(el => !this.excludeChildrenOf || !objectHasParentLocation(el[1], this.excludeChildrenOf))

          base = name && name.length > 0 ? base.filter(t => t[2].indexOf(SelectStorageComponent.normalizeString(name)) !== -1) : base

          return base.map(l => [l[0], l[1]])
        })
      );

    this.searchControl.registerOnChange(v => this.onValueChange(v))
  }

  private static normalizeString(str): string {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
  }

  displayLocation(location?: [number, StorageTree]): string | undefined {
    return location ? storageLocationToString(location[1], undefined) : undefined;
  }

}
