import {Component, OnInit} from '@angular/core';
import {CompleteObject, ObjectStatus, statusToString} from '../../../data/object';
import {ObjectsService} from '../../../services/objects.service';
import {ActivatedRoute} from '@angular/router';
import {storageLocationToString} from '../../../data/storage-location';
import {externalLoanToString} from 'src/app/data/external-loan';
import {CompleteObjectLog, ObjectLog} from '../../../data/object-log';
import {UserProfile} from '../../../data/user';
import Swal from 'sweetalert2';
import {CompleteObjectComment} from '../../../data/object-comment';

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
  comments: CompleteObjectComment[];

  comment: string;
  posting = false;


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
    this.loadComments();
  }

  dateFormat(_log: CompleteObjectLog | CompleteObjectComment) {
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

}
