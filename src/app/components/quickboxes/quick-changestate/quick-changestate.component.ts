import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Swal from 'sweetalert2';
import {CompleteObject, ObjectStatus, statusToString} from '../../../data/object';
import {UserProfile} from '../../../data/user';
import {ObjectsService} from '../../../services/objects.service';
import {MatDialog} from '@angular/material';
import {SignatureModalComponent} from '../../selectors/signature-modal/signature-modal.component';

@Component({
  selector: 'app-quick-changestate',
  templateUrl: './quick-changestate.component.html',
  styleUrls: ['./quick-changestate.component.css']
})
export class QuickChangestateComponent implements OnInit {
  @Input() object: CompleteObject;
  @Output() update = new EventEmitter();

  statusToString = statusToString;
  ObjectStatus = ObjectStatus;
  lendTo: UserProfile;
  sending = false;

  constructor(private service: ObjectsService, private dialog: MatDialog) {
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

  private changeState(targetState: ObjectStatus) {
    if (!this.lendTo) {
      return;
    }

    if (this.sending) {
      return;
    }
    this.sending = true;

    // May require signature
    if (this.object.objectType.requiresSignature) {
      if (targetState === ObjectStatus.IN_STOCK || targetState === ObjectStatus.OUT) {
        // Retour en stock ou sortie de stock.
        const text = (targetState === ObjectStatus.IN_STOCK ? "Retour" : "Emprunt") + ' de ' + this.object.objectType.name + ' ' + this.object.object.suffix;
        this.dialog.open(SignatureModalComponent, {data: text})
          .afterClosed()
          .subscribe(res => {
            if (res && typeof res === 'string') {
              this.doChangeState(targetState, res);
            } else {
              Swal.fire('Eh non!', 'Impossible de faire ça, il te faut signer mon dude.', 'error');
              this.sending = false;
            }
          });
      } else {
        this.doChangeState(targetState);
      }
    } else {
      this.doChangeState(targetState);
    }
  }

  private doChangeState(targetState: ObjectStatus, signature?: string) {
    const userId = this.lendTo.id;

    Swal.fire({
      titleText: 'Confirmer le changement d\'état',
      html: 'Voulez vous confirmer le passage de l\'objet à l\'état <b>' + statusToString(targetState) + '</b> pour l\'utilisateur <b>' +
        this.lendTo.details.firstName + ' ' + this.lendTo.details.lastName + '</b> ?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then(data => {
      if (data.value) {
        this.service
          .changeState(this.object.object.objectId, targetState, userId, signature)
          .subscribe(succ => {
            Swal.fire({
              titleText: 'Changement réussi',
              html: 'L\'objet est désormais <b>' + statusToString(targetState) + '</b> par <b>' + this.lendTo.details.firstName + ' ' +
                this.lendTo.details.lastName + '</b>',
              icon: 'success'
            });
            this.sending = false;
            this.update.emit();
          }, err => {
            this.sending = false;
            Swal.fire('Oups', 'Une erreur s\'est produite pendant le changement d\'état. Réessayez plus tard', 'error');
          });
      } else {
        this.sending = false;
      }
    }, err => this.sending = false);
  }

  ngOnInit(): void {
  }
}
