import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {StorageLocation} from '../../data/storage-location';
import {CompleteExternalLoan} from '../../data/external-loan';
import {Observable} from 'rxjs';
import {ObjectsService} from '../../services/objects.service';
import {StorageLocationsService} from '../../services/storage-locations.service';
import {LoansService} from '../../services/loans.service';
import {map} from 'rxjs/operators';
import {ObjectType} from '../../data/object-type';
import {NgModel} from '@angular/forms';
import {MatDialog} from '@angular/material';
import Swal from 'sweetalert2';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-create-object-type',
  templateUrl: './create-object-type.component.html',
  styleUrls: ['./create-object-type.component.css']
})
export class CreateObjectTypeComponent implements OnInit, AfterViewInit {
  type = new ObjectType();

  inconvStorages: StorageLocation[] = [];

  @ViewChild('inconvLocationInput', {static: false}) inconvLocationInput: NgModel;
  @ViewChild('locationInput', {static: false}) locationInput: NgModel;
  @ViewChild('loanInput', {static: false}) loanInput: NgModel;
  sending = false;

  constructor(private objects: ObjectsService, private storagesService: StorageLocationsService, private loansService: LoansService,
              private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
  }

  get isUpdate(): boolean {
    return !isNullOrUndefined(this.type.objectTypeId);
  }

  ngOnInit() {
    this.storagesService.getStorageLocations().subscribe(storages => {
      storages.forEach(s => {
        if (s.inConv) {
          this.inconvStorages.push(s);
        } else {
          this.storages.push(s);
        }
        this.storagesMap.set(s.storageLocationId, s);
      });
    });

    this.route.paramMap.subscribe(map => {
      if (map.has('typeId')) {
        this.type = undefined;
        this.objects.getSimpleObjectType(Number.parseInt(map.get('typeId'), 10)).subscribe(tpe => this.type = tpe);
      }
    });
  }

  ngAfterViewInit() {
    this.inconvLocationInput.control.setValidators(this.validator(this.storagesMap));
    this.locationInput.control.setValidators(this.validator(this.storagesMap));
  }



  create(next: 'stay' | 'scan' | 'list' | 'page') {
    if (this.sending) {
      return;
    }

    this.sending = true;
    this.objects.createOrUpdateObjectType(this.type).subscribe(id => {

      switch (next) {
        case 'stay':
          Swal.fire({title: 'Objet ajouté', icon: 'success', timer: 3000, timerProgressBar: true}).then(() => {
            this.sending = false;
            this.type = new ObjectType();
          });
          break;
        case 'scan':
        case 'page':
          this.sending = false;
          this.router.navigate(['object-types', id]);
          break;
        case 'list':
          this.sending = false;
          this.router.navigate(['object-types']);
          break;
      }

    }, () => {
      this.sending = false;
      Swal.fire({
        title: 'Erreur!',
        text: 'Une erreur s\'est produite pendant l\'envoi. Merci de réessayer.',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true
      });
    });
  }

  private validator(map: Map<number, any>) {
    return (control) => control.value && (typeof (control.value) !== 'number' || !map.has(control.value as number)) ? {valid: false} : null;
  }
}
