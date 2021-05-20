import {Component, OnInit} from '@angular/core';
import {ObjectsService} from '../../../services/objects.service';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {LoansService} from '../../../services/loans.service';
import {ObjectType} from '../../../data/object-type';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-create-object-type',
  templateUrl: './create-object-type.component.html',
  styleUrls: ['./create-object-type.component.css']
})
export class CreateObjectTypeComponent implements OnInit {
  type = new ObjectType();
  sending = false;

  constructor(private objects: ObjectsService, private storagesService: StorageLocationsService, private loansService: LoansService,
              private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
  }

  get isUpdate(): boolean {
    return this.type.objectTypeId !== null && this.type.objectTypeId !== undefined;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      if (map.has('typeId')) {
        this.type = undefined;
        this.objects.getSimpleObjectType(Number.parseInt(map.get('typeId'), 10)).subscribe(tpe => this.type = tpe);
      } else {
        this.type.requiresSignature = false;
      }
    });
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
}
