import {Component, OnInit} from '@angular/core';
import {CompleteObject, ObjectStatus, statusToString} from '../../data/object';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';
import {FormControl} from '@angular/forms';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ObjectsService} from '../../services/objects.service';
import {forkJoin, Observable, of} from 'rxjs';
import {requestSignature} from '../../services/signature';
import {MatDialog} from '@angular/material';
import Swal from "sweetalert2";

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
    quickLoanTag: string;
    quickLoanObject: CompleteObject;

    quickMoveStorage: number;

    quickLoanMultiUser: number;
    quickLoanMultiTags = new FormControl();
    quickLoanFoundObjects: Observable<CompleteObject[]>;
    quickLoanMultiSending = false;

    ObjectStatus = ObjectStatus;

    private currentFoundObjectsSnapshot: CompleteObject[];
    private requiresSignatureSnapshot: boolean;
    private targetStateSnapshot: ObjectStatus;

    constructor(private router: Router, private objectsService: ObjectsService, private dialog: MatDialog) {
    }

    currentError: Observable<string>;

    hasObjects: Observable<boolean>;

    requiresSignature: Observable<boolean>;

    targetState: Observable<ObjectStatus>;

    ngOnInit() {
        this.quickLoanFoundObjects = this.quickLoanMultiTags.valueChanges
            .pipe(
                map(v => isNullOrUndefined(v) ? [] : v.split('\n').map(o => o.trim()).filter(o => o.length > 0)),
                switchMap(lst =>
                    forkJoin(
                        lst.map(elem => this.objectsService.getObjectByTag(elem)
                            .pipe(catchError(err => of(undefined))) as Observable<CompleteObject>)
                    ) as Observable<CompleteObject[]>
                )
                // map(lst => lst.filter(o => !isNullOrUndefined(o)))
            );

        this.currentError = this.quickLoanFoundObjects.pipe(
            map(lst => {
              const notFound = lst.indexOf(undefined);
              if (notFound !== -1) {
                return 'Un objet de la liste n\'existe pas en position ' + (notFound + 1);
              }
              return undefined;
            })
        );

        this.hasObjects = this.quickLoanFoundObjects.pipe(
            map(lst => { console.log(lst) ; return !isNullOrUndefined(lst) && lst.length > 0; }),
            map(r => { console.log(r) ; return r; })
        );

        this.requiresSignature = this.quickLoanFoundObjects.pipe(
            map(lst => {
                  const targetStatuses = lst.map(e => e.objectType.requiresSignature);
                  return targetStatuses.indexOf(true) !== -1;
                },
                switchMap(reqSign => this.targetState.pipe(map(targetState => reqSign && targetState === ObjectStatus.OUT))))
        );

        this.targetState = this.quickLoanFoundObjects.pipe(
            map(lst => {
              const targetStatuses = new Set(lst
                  .map(e => e ? (e.object.status !== ObjectStatus.IN_STOCK) ? ObjectStatus.OUT : ObjectStatus.IN_STOCK : undefined));

              if (targetStatuses.size > 1) {
                return undefined;
              } else {
                return targetStatuses.values().next().value;
              }
            })
        );

        this.quickLoanFoundObjects.subscribe(lst => this.currentFoundObjectsSnapshot = lst);
        this.requiresSignature.subscribe(v => this.requiresSignatureSnapshot = v);
        this.targetState.subscribe(s => this.targetStateSnapshot = s);
    }


    redirectTo($event: CompleteObject) {
        if (!isNullOrUndefined($event) && !isNullOrUndefined($event.object)) {
            this.router.navigate(['/', 'objects', $event.object.objectId]);
        }
    }

    quickLoan() {
        if (this.quickLoanMultiSending) {
            return;
        }
        this.quickLoanMultiSending = true;

        if (this.requiresSignatureSnapshot) {
            const sgnObjects = this.currentFoundObjectsSnapshot.filter(o => o.objectType.requiresSignature).map(o => o.objectType.name + ' ' + o.object.suffix).join(', ');
            const snapObjects = this.currentFoundObjectsSnapshot;
            const snapState = this.targetStateSnapshot;
            requestSignature(this.dialog, sgnObjects, sgn => this.doChangeState(snapState, snapObjects, sgn), () => this.quickLoanMultiSending = false);
        } else {
            this.doChangeState(this.targetStateSnapshot, this.currentFoundObjectsSnapshot);
        }
    }

    private doChangeState(targetState: ObjectStatus, objects: CompleteObject[], signature?: string) {
      const objList = objects.map(o => o.objectType.name + ' ' + o.object.suffix).join(', ');

      const userId = this.quickLoanMultiUser;

      Swal.fire({
        titleText: 'Confirmer le changement d\'état',
        html: 'Voulez vous confirmer le passage à l\'état <b>' + statusToString(targetState) + '</b> pour les objets ' + objList + ' ?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
      }).then(data => {
        if (data.value) {
          const observables = objects.map(o =>
              this.objectsService
                  .changeState(o.object.objectId, targetState, userId, o.objectType.requiresSignature ? signature : undefined)
                  .pipe(
                      map(res => ({obj: o, success: true})),
                      catchError(err => of({obj: o, success: false}))
                  )
          );

          forkJoin(observables).subscribe(lst => {
            const failed = lst.filter(o => o.success === false).map(o => o.obj.objectType.name + ' ' + o.obj.object);

            if (failed.length === 0) {
              Swal.fire('Changement réussi', undefined, 'success');
              this.quickLoanMultiTags.reset();
              this.quickLoanMultiUser = undefined;
            } else {
              Swal.fire('Changement partiel', 'Le changement a échoué sur les objets suivants : ' + failed.join(', '), 'warning');
            }

            this.quickLoanMultiSending = false;
          });
        } else {
          this.quickLoanMultiSending = false;
        }
      }, err => this.quickLoanMultiSending = false);
    }
}
