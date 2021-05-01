import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CompleteExternalLoan} from '../../../data/external-loan';
import {LoansService} from '../../../services/loans.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ExternalLender} from '../../../data/external-lender';
import {LendersService} from '../../../services/lenders.service';
import { MatDialog } from '@angular/material/dialog';
import {CreateLenderComponent} from '../../external-loans/create-lender/create-lender.component';
import {isNumber} from 'util';

@Component({
  selector: 'app-select-lender',
  templateUrl: './select-lender.component.html',
  styleUrls: ['./select-lender.component.css']
})
export class SelectLenderComponent implements OnInit {
  @Input() label = 'Identité du prêteur';
  @Input() emptyLabel = 'Aucun';
  @Input() allowCreation = false;
  @Input() selected: number;

  @Output() selectedChange = new EventEmitter<number>();
  @Output() selectedLenderChange = new EventEmitter<ExternalLender>();

  lenders: ExternalLender[] = [];
  constructor(private service: LendersService, private dialog: MatDialog) { }

  ngOnInit() {
    this.service.getLenders().subscribe(lenders => {
      this.lenders = lenders;
    });
  }

  displayLender(lender?: ExternalLender): string | undefined {
    return lender ? lender.name + ' (' + lender.location + ')' : undefined;
  }

  changeValue($event) {
    this.selectedChange.emit($event);
    this.selectedLenderChange.emit(this.lenders.filter(l => l.externalLenderId === $event)[0]);
  }

  create() {
    this.dialog.open(CreateLenderComponent).afterClosed().subscribe(res => {
      if (isNumber(res)) {
        let messages = 0;
        const subscriber = this.service.getLenders().subscribe(ans => {
          messages ++;
          if (messages === 2) {
            subscriber.unsubscribe();
            this.selected = res;
            this.changeValue(res);
          }
        });
        this.service.forceRefreshLenders();
      }
    });
  }
}
