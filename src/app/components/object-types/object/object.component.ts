import {Component, OnInit} from '@angular/core';
import {CompleteObject, ObjectStatus, statusToString} from '../../../data/object';
import {ObjectsService} from '../../../services/objects.service';
import {ActivatedRoute, Router} from '@angular/router';
import {storageLocationToString} from '../../../data/storage-location';
import {externalLoanToString} from 'src/app/data/external-loan';
import {ObjectLogWithUser} from '../../../data/object-log';
import Swal from 'sweetalert2';
import {CompleteObjectComment} from '../../../data/object-comment';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  object: CompleteObject;
  externalLoanToString = externalLoanToString;
  storageLocationToString = storageLocationToString;
  statusToString = statusToString;
  logs: ObjectLogWithUser[];
  comments: CompleteObjectComment[];
  comment: string;
  posting = false;
  private id: number;

  constructor(private service: ObjectsService, private route: ActivatedRoute, private auth: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.id = Number.parseInt(map.get('id'), 10);
      this.refresh();
    });
  }

  refresh() {
    this.service.getObjectById(this.id).subscribe(obj => this.object = obj);
    this.service.getObjectLogs(this.id).subscribe(obj => this.logs = obj);
    this.loadComments();
  }

  dateFormat(_log: ObjectLogWithUser | CompleteObjectComment) {
    const log = _log as any;
    const date = log.objectLog ? log.objectLog.timestamp : log.objectComment.timestamp;

    if (typeof date === 'string') {
      return new Date(Date.parse(date)).toLocaleString();
    } else {
      return date.toLocaleString();
    }
  }

  loadComments() {
    this.comments = undefined;
    this.service.getObjectComments(this.id).subscribe(res => this.comments = res);
  }

  sendComment() {
    if (this.posting) {
      return;
    }

    this.posting = true;
    this.service.postObjectComment(this.id, this.comment).subscribe(success => {
      this.posting = false;
      this.comment = '';
      this.loadComments();
    }, err => this.posting = false);
  }

  delete() {
    Swal.fire({
      titleText: 'Es-tu certain de vouloir faire cela ?',
      html: 'Cette opération placera l\'objet dans un état final "Remisé" dont il ne pourra plus jamais sortir.<br>Il disparaitra également ' +
        'des listes d\'objets, mais pourra toujours être retrouvé avec son asset tag.<br>Son asset tag ne sera pas libéré.',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      showCancelButton: true, showConfirmButton: true
    }).then(res => {
      if (res.value === true) {
        this.service
          .changeState(this.object.object.objectId, ObjectStatus.DELETED, this.auth.getToken().userId)
          .subscribe(succ => {
            Swal.fire(undefined, undefined, 'success');
            this.router.navigate(['/', 'object-types', this.object.object.objectTypeId]);
          }, err => {
            Swal.fire('Erreur inconnue', undefined, 'error');
            console.log(err);
          });
      }
    });
  }
}
