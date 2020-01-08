import {Component, Inject, OnInit} from '@angular/core';
import {ExternalLender} from '../../../data/external-lender';
import {isNullOrUndefined} from "util";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LendersService} from '../../../services/lenders.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-lender',
  templateUrl: './create-lender.component.html',
  styleUrls: ['./create-lender.component.css']
})
export class CreateLenderComponent implements OnInit {
  lender: ExternalLender;
  sending = false;

  constructor(private dialogRef: MatDialogRef<CreateLenderComponent>, private ls: LendersService, @Inject(MAT_DIALOG_DATA) private data?: ExternalLender) {
    if (data) {
      this.lender = data;
    } else {
      this.lender = new ExternalLender();
    }
  }

  ngOnInit() {
  }

  get isUpdate(): boolean {
    return !isNullOrUndefined(this.lender.externalLenderId);
  }

  submit($event: any) {
    if (this.isUpdate) {
      alert('Not implemented!');
      return;
    }

    if (this.sending) {
      return;
    }
    this.sending = true;

    this.ls.createLender(this.lender).subscribe(res => {
      this.dialogRef.close(res);
    }, err => {
      this.sending = false;
      Swal.fire('Il y a eu un problème', undefined, 'error');
    });
  }
}
