import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {objectHasParentLocation, StorageLocation, storageLocationToString, StorageTree} from '../../../data/storage-location';
import {CompleteObject} from '../../../data/object';
import {ObjectsService} from '../../../services/objects.service';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import Swal from 'sweetalert2';
import {CreateStorageLocationComponent} from '../create-storage-location/create-storage-location.component';
import {MatDialog} from '@angular/material/dialog';
import {map, switchMap, tap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-show-storage-location',
  templateUrl: './show-storage-location.component.html',
  styleUrls: ['./show-storage-location.component.css']
})
export class ShowStorageLocationComponent implements OnInit {
  id: number | null = null;
  inConv: boolean = false;
  eventId?: number = undefined;


  treeWithChildren: Observable<StorageTree>;
  locationWithParents: Observable<StorageTree>;
  items: Observable<CompleteObject[]>;

  dataSource: MatTableDataSource<CompleteObject> = new MatTableDataSource();

  displayAll: boolean = true;

  constructor(private ar: ActivatedRoute, private router: Router, private sl: StorageLocationsService, private obj: ObjectsService, private dialog: MatDialog) {
  }

  ngOnInit() {
    // this.locations.getStorageLocationsByParent(Number.parseInt(params.get('parent')))
    this.ar.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('id'), 10);

      this.treeWithChildren = undefined;
      this.items = undefined;
      this.locationWithParents = undefined;

      this.refresh();
    });
  }

  displayStorageSpace(loc: StorageTree): string {
    console.log(loc)
    return storageLocationToString(loc);
  }

  refresh() {
    this.treeWithChildren = this.sl.getStorageTree(this.id).pipe(tap(loc => {
      this.inConv = loc.event !== undefined;
      this.eventId = loc.event;
    })); // .subscribe(loc => this.location = loc);
    this.items = this.treeWithChildren.pipe(switchMap(v =>
      this.obj.getObjects().pipe(map(allObj => allObj.filter(o => objectHasParentLocation(this.inConv ? o.inconvStorageLocationObject : o.storageLocationObject, v.storageId))))
    ));
    this.locationWithParents = this.sl.getStorageWithParents(this.id);


    this.dataSource.filterPredicate = (obj, f) => {
      return this.displayAll || (this.inConv ? (obj.object.inconvStorageLocation ?? obj.objectType.inconvStorageLocation) === this.id : (obj.object.storageLocation ?? obj.objectType.storageLocation) === this.id);
    };
    this.dataSource.filter = 'true';
    this.items.subscribe(r => this.dataSource.data = r);
  }

  /*
  isInherited(elem: CompleteObject) {
    const isInConv = this.location.inConv;

    if (isInConv) {
      return elem.object.inconvStorageLocation === undefined;
    } else {
      return elem.object.storageLocation === undefined;
    }
  }
  */

  displayChange($event: MatSlideToggleChange) {
    this.dataSource.filter = '' + $event.checked;
  }

  update() {
    this.dialog.open(CreateStorageLocationComponent, {data: this.treeWithChildren});
  }

  delete() {
    Swal.fire({
      titleText: 'Êtes vous sûr ?', text: 'Voulez vous vraiment supprimer cet emplacement de stockage ?',
      showConfirmButton: true, showCancelButton: true, confirmButtonText: 'Oui', cancelButtonText: 'Non'
    }).then(result => {
      if (result && result.value === true) {
        this.treeWithChildren = undefined;

        this.sl.deleteStorage(this.id).subscribe(res => {
          this.sl.forceRefreshLocations();
          this.router.navigate(['..'], {relativeTo: this.ar});
        }, fail => {
          Swal.fire('Oups', 'On dirait que ça n\'a pas marché.', 'error');
          this.refresh();
        });
      }
    });
  }
}
