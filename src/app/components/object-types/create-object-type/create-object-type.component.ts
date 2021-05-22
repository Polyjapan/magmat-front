import {Component, Inject, OnInit} from '@angular/core';
import {ObjectsService} from '../../../services/objects.service';
import {StorageLocationsService} from '../../../services/storage-locations.service';
import {LoansService} from '../../../services/loans.service';
import {ObjectType, ObjectTypeAncestry} from '../../../data/object-type';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {ObjectTypesService} from '../../../services/object-types.service';
import {Storage} from '../../../data/storage-location';


@Component({
  selector: 'app-create-object-type',
  templateUrl: './create-object-type.component.html',
  styleUrls: ['./create-object-type.component.css']
})
export class CreateObjectTypeComponent {
  objectType: ObjectType;
  parent: ObjectTypeAncestry;

  sending = false;

  constructor(private objects: ObjectsService, private objectTypes: ObjectTypesService, private storagesService: StorageLocationsService, private loansService: LoansService,
              private dialog: MatDialog, private route: ActivatedRoute, private router: Router,
              private dialogRef: MatDialogRef<CreateObjectTypeComponent>, @Inject(MAT_DIALOG_DATA) private data?: ObjectType) {

    if (data) {
      if (data.parentObjectTypeId) {
        const s = this.objectTypes.getObjectTypeWithParents(data.parentObjectTypeId).subscribe(r => {
          this.parent = r;
          this.objectType = data;
          s.unsubscribe()
        })
      } else {
        this.objectType = data;
      }
    } else {
      this.objectType = new ObjectType();
    }
  }

  get isUpdate(): boolean {
    return this.objectType.objectTypeId !== null && this.objectType.objectTypeId !== undefined;
  }


  create(next: 'stay' | 'scan' | 'list' | 'page') {
    if (this.sending) {
      return;
    }

    this.sending = true;
    this.objectTypes.createOrUpdateObjectType(this.objectType).subscribe(id => {

      switch (next) {
        case 'stay':
          Swal.fire({title: 'Objet ajouté', icon: 'success', timer: 3000, timerProgressBar: true}).then(() => {
            this.sending = false;
            this.objectType = new ObjectType();
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
