import {Component, OnInit} from '@angular/core';
import {CompleteObject, ObjectStatus, statusToString} from '../../../data/object';
import {ObjectsService} from '../../../services/objects.service';
import {ActivatedRoute} from '@angular/router';
import {storageLocationToString} from '../../../data/storage-location';
import {externalLoanToString} from 'src/app/data/external-loan';
import {CompleteObjectLog, ObjectLog} from '../../../data/object-log';
import {UserProfile} from '../../../data/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  object: CompleteObject;
  private id: number;
  externalLoanToString = externalLoanToString;
  storageLocationToString = storageLocationToString;
  statusToString = statusToString;
  logs: CompleteObjectLog[];
  ObjectStatus = ObjectStatus;

  lendTo: UserProfile;

  constructor(private service: ObjectsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('id'), 10);
      this.refresh();
    });
  }

  refresh() {
    this.service.getObjectById(this.id).subscribe(obj => this.object = obj);
    this.service.getObjectLogs(this.id).subscribe(obj => this.logs = obj);
  }

  sending = false;

  dateFormat(log: CompleteObjectLog) {
    const date = log.objectLog.timestamp;

    if (typeof date === 'string') {
      console.log(Date.parse(date));
      return new Date(Date.parse(date)).toLocaleString();
    } else {
      return date.toLocaleString();
    }
  }

  private changeState(targetState: ObjectStatus) {
    if (!this.lendTo)
      return;

    if (this.sending) {
      return;
    }
    this.sending = true;
    const userId = this.lendTo.id;

    Swal.fire({
      titleText: 'Confirmer le changement d\'état',
      html: 'Voulez vous confirmer le passage de l\'objet à l\'état <b>' + statusToString(targetState) + '</b> pour l\'utilisateur <b>' + this.lendTo.details.firstName + ' ' + this.lendTo.details.lastName + '</b> ?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then(data => {
      if (data.value) {
        this.service
          .changeState(this.id, targetState, userId)
          .subscribe(succ => {
            Swal.fire({
              titleText: 'Changement réussi',
              html: 'L\'objet est désormais <b>' + statusToString(targetState) + '</b> par <b>' + this.lendTo.details.firstName + ' ' +
                this.lendTo.details.lastName + '</b>',
              icon: 'success'
            });
            this.sending = false;
            this.refresh();
          }, err => {
            this.sending = false;
            Swal.fire('Oups', 'Une erreur s\'est produite pendant le changement d\'état. Réessayez plus tard', 'error')
          });
      } else {
        this.sending = false;
      }
    }, err => this.sending = false);
  }

  declareLoaned() {
    this.changeState(ObjectStatus.OUT);
  }

  declareInStock() {
    this.changeState(ObjectStatus.IN_STOCK);
  }

  declareResting() {
    this.changeState(ObjectStatus.RESTING);
  }

  declareLost() {
    this.changeState(ObjectStatus.LOST);
  }
}
