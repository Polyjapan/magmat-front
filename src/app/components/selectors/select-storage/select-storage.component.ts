import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {StorageLocation, storageLocationToString, StorageTree} from '../../../data/storage-location';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {Observable} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {ObjectType} from '../../../data/object-type';
import {EventsService} from '../../../services/events.service';

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

  locations: [number, StorageTree][] = [];
  filteredLocations: Observable<[number, StorageTree][]>;
  searchControl = new FormControl();

  constructor(private service: StorageLocationsService, private events: EventsService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected && changes.selected.firstChange && this.locations.length > 0) {
      if (changes.selected.currentValue !== undefined && changes.selected.currentValue !== null) {
        this.searchControl.setValue(this.locations.filter(loc => loc[0] === changes.selected.currentValue)[0]);
      } else {
        this.searchControl.reset();
      }
    }
  }

  ngOnInit() {
    this.events.getCurrentEventId().pipe(switchMap(evId => this.service.getStoragesWithParents(this.inconv, evId ?? undefined)))
      .subscribe(locations => {
      this.locations = Array.from(locations.entries());

      if (this.selected) {
        this.searchControl.setValue(this.locations.filter(loc => loc[0] === this.selected)[0]);
      }
    });


    this.filteredLocations = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name && name.length > 0 ?
          // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
          this.locations.filter(t => storageLocationToString(t[1]).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .indexOf(name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1) : this.locations)
      );

    this.searchControl.valueChanges.subscribe(v => {
      if (typeof v === 'object' && v.name && v.objectTypeId) {
        this.selectedChange.emit((v as StorageLocation).storageLocationId);
      } else {
        this.selectedChange.emit(undefined);
      }
    });
  }

  displayLocation(location?: [number, StorageTree]): string | undefined {
    return storageLocationToString(location[1], undefined);
  }
}
