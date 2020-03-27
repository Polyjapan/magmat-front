import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {StorageLocation, storageLocationToString} from '../../../data/storage-location';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {ObjectType} from '../../../data/object-type';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-select-storage',
  templateUrl: './select-storage.component.html',
  styleUrls: ['./select-storage.component.css']
})
export class SelectStorageComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() emptyLabel: string = 'Aucun';
  @Input() type: 'select' | 'input' = 'input';
  @Input() selected: number;
  @Output() selectedChange = new EventEmitter<number>();
  @Input('inconv') inconv: boolean = undefined;

  locations: StorageLocation[] = [];
  filteredLocations: Observable<StorageLocation[]>;
  searchControl = new FormControl();

  constructor(private service: StorageLocationsService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.firstChange && this.locations.length > 0) {
      if (!isNullOrUndefined(changes.selected.currentValue)) {
        this.searchControl.setValue(this.locations.filter(loc => loc.storageLocationId === changes.selected.currentValue)[0]);
      } else {
        this.searchControl.reset();
      }
    }
  }

  ngOnInit() {
    this.service.getStorageLocations(this.inconv).subscribe(locations => {
      this.locations = locations;

      if (this.selected) {
        this.searchControl.setValue(this.locations.filter(loc => loc.storageLocationId === this.selected)[0]);
      }
    });


    this.filteredLocations = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name && name.length > 0 ?
          this.locations.filter(t => storageLocationToString(t).toLowerCase().indexOf(name.toLowerCase()) === 0) : this.locations)
      );

    this.searchControl.valueChanges.subscribe(v => {
      if (typeof v === 'object' && v.storageLocationId) {
        this.selectedChange.emit((v as StorageLocation).storageLocationId);
      } else {
        this.selectedChange.emit(undefined);
      }
    });
  }

  displayLocationById(location: number): Observable<string> {
    return this.service.getStorageLocation(location).pipe(map(el => this.displayLocation(el)));
  }

  displayLocation(location?: StorageLocation): string | undefined {
    return storageLocationToString(location, undefined);
  }
}
