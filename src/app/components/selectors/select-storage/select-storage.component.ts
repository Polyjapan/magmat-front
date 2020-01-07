import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StorageLocation} from '../../../data/storage-location';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-select-storage',
  templateUrl: './select-storage.component.html',
  styleUrls: ['./select-storage.component.css']
})
export class SelectStorageComponent implements OnInit {
  @Input('label') label: string;
  @Input('type') type: 'select' | 'input' = 'select';
  @Input('selected') selected: number;
  @Output('selectedChange') selectedChange = new EventEmitter<number>();
  @Input('inconv') inconv: boolean = undefined;

  locations: StorageLocation[] = [];

  constructor(private service: StorageLocationsService) {
  }

  ngOnInit() {
    this.service.getStorageLocations(this.inconv).subscribe(locations => {
      this.locations = locations;
    });
  }

  displayLocationById(location: number): Observable<string> {
    return this.service.getStorageLocation(location).pipe(map(el => this.displayLocation(el)));
  }

  displayLocation(location?: StorageLocation): string | undefined {
    return location ? location.room + ' - ' + location.space + ' - ' + location.location : undefined;
  }
}
