import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ObjectsService} from '../../../services/objects.service';
import {ObjectType} from '../../../data/object-type';
import {storageLocationToString} from '../../../data/storage-location';
import {CompleteObject} from '../../../data/object';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-object-type',
  templateUrl: './show-object-type.component.html',
  styleUrls: ['./show-object-type.component.css']
})
export class ShowObjectTypeComponent implements OnInit {
  objectType: ObjectType;
  storageLocationToString = storageLocationToString;
  objects: CompleteObject[] = [];
  id: number;
  deleting: boolean;

  constructor(private route: ActivatedRoute, private objectsService: ObjectsService, private router: Router) {
  }

  get objectTypeData(): [string, string, (string | number)[]?][] {
    const objectType = this.objectType;

    const arr: [string, string, (string | number)[]?][] = [
      objectType.description ? ['DESCRIPTION', objectType.description] : undefined,
      objectType.partOfLoanObject ? ['EMPRUNT PARENT', objectType.partOfLoanObject?.externalLoan?.loanTitle, ['/', 'external-loans', objectType.partOfLoan]] : undefined,
      objectType.requiresSignature ? ['PARTICULARITÉS', 'Signature obligatoire'] : undefined
    ];

    return arr.filter(e => e);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('typeId'), 10);
      this.objectsService.getObjectType(this.id).subscribe(tpe => this.objectType = tpe);
      this.refreshObjects();
    });
  }

  refreshObjects() {
    this.objectsService.getObjectsForType(this.id).subscribe(objs => this.objects = objs);
  }

  delete() {
    Swal.fire({
      titleText: 'Voulez vous vraiment faire cela ?',
      text: 'Le type d\'objet sera caché des listes, et tous les objets encore dans cet objet passeront à l\'état remisé (supprimé - irréversible !).',
      icon: 'warning',
      confirmButtonText: 'Oui, je le veux',
      cancelButtonText: 'Non surtout pas !',
      showConfirmButton: true,
      showCancelButton: true
    }).then(res => {
      if (res.value === true) {
        if (this.deleting) {
          return;
        }
        this.deleting = true;

        this.objectsService.deleteObjectType(this.id)
          .subscribe(_ => {
            this.router.navigate(['..'], {relativeTo: this.route});
          }, _ => {
            Swal.fire('Oups', 'On dirait que ça ne fonctionne pas. Réessayez plus tard', 'error');
            this.deleting = false;
          });
      }
    });
  }
}
