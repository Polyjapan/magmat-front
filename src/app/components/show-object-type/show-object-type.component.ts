import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ObjectsService} from '../../services/objects.service';
import {CompleteObjectType} from '../../data/object-type';
import {storageLocationToString} from '../../data/storage-location';
import {CompleteObject, ObjectStatus, SingleObject} from '../../data/object';
import {externalLoanToString} from 'src/app/data/external-loan';
import {MatTableDataSource} from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-object-type',
  templateUrl: './show-object-type.component.html',
  styleUrls: ['./show-object-type.component.css']
})
export class ShowObjectTypeComponent implements OnInit {
  objectType: CompleteObjectType;
  storageLocationToString = storageLocationToString;
  externalLoanToString = externalLoanToString;
  objects = new MatTableDataSource<CompleteObject>();
  // Quick object creation
  prefix: string;
  suffixStart: number;
  tags: string;
  sending = false;
  private id: number;

  constructor(private route: ActivatedRoute, private objectsService: ObjectsService) {
  }

  get simulation() {
    const objects = this.createObjects();
    if (!objects) {
      return undefined;
    }

    return objects.map(obj =>
      this.objectType.objectType.name + ' ' + obj.suffix + ' aura le tag ' + obj.assetTag
    ).join('\n');
  }

  postObjects() {
    const objects = this.createObjects();
    if (!objects) {
      return undefined;
    }

    if (this.sending) {
      return;
    } else {
      this.sending = true;
    }

    this.objectsService.createObjects(objects).subscribe(result => {
      if (result.inserted.length !== 0) {
        this.refreshObjects();
      }
      this.sending = false;

      if (result.notInserted.length > 0) {
        const notAdded = result.notInserted.map(ni => ni.assetTag + ' (' + this.objectType.objectType.name + ' ' + ni.suffix + ')')
          .join('\n');

        Swal.fire('Objets non ajoutés', 'Certains objets n\'ont pas été ajoutés :\n' + notAdded, 'warning');
      } else if (result.inserted.length > 0) {
        Swal.fire('Objets ajoutés', 'Les objets ont bien été ajoutés !', 'success');
      } else {
        Swal.fire('Aucun objet ajouté', 'Aucun objet n\'a été ajouté... Peut être avez vous envoyé une requête vide ?', 'question');
      }

      this.suffixStart = this.suffixStart + objects.length;
      this.tags = '';
    }, err => {
      Swal.fire('Une erreur s\'est produite.', err.toString(), 'error');
      this.sending = false;
    });
  }

  createObjects(): SingleObject[] {
    let suffix = this.suffixStart;

    if (!this.tags || !this.suffixStart) {
      return undefined;
    }

    return this.tags.split('\n').map(tag => tag.trim()).filter(tag => tag.length > 0).map(tag => {
      return {
        objectTypeId: this.objectType.objectType.objectTypeId,
        suffix: (this.prefix && this.prefix.length > 0 ? this.prefix + ' ' : '') + (suffix++),
        assetTag: tag,
        status: ObjectStatus.IN_STOCK
      };
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('typeId'), 10);
      this.objectsService.getObjectType(this.id).subscribe(tpe => this.objectType = tpe);
      this.refreshObjects();
    });
  }

  refreshObjects() {
    this.objectsService.getObjectsForType(this.id).subscribe(objs => this.objects.data = objs);
  }
}
