import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {NgModel} from '@angular/forms';
import {Observable, Subscriber} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {CompleteObject} from '../../../data/object';
import {ObjectsService} from '../../../services/objects.service';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-select-object',
  templateUrl: './select-object.component.html',
  styleUrls: ['./select-object.component.css']
})
export class SelectObjectComponent implements OnInit, OnChanges {
  @Input() label = 'Choisir un objet';
  @Output() selectedObject = new EventEmitter<CompleteObject>();
  @Input() selected: string;
  @Output() selectedChange = new EventEmitter<string>();

  @ViewChild('input', {static: true}) inputElement: NgModel;

  currentObject: CompleteObject;
  private inputSubscriber: Subscriber<string>;
  private inputObservable = new Observable<string>(subscriber => this.inputSubscriber = subscriber);

  constructor(private service: ObjectsService) {
  }

  ngOnInit() {
    this.inputObservable
      .pipe(
        filter(text => !isNullOrUndefined(text)),
        filter(text => text.length >= 1),
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe(val => {
      this.service.getObjectByTag(val).subscribe(data => {
        this.selectedObject.emit(data);
        this.currentObject = data;
        this.inputElement.control.setErrors(null);
      }, err => this.inputElement.control.setErrors({noObject: true}));
    });
  }

  update($event: string) {
    this.selectedChange.emit($event);
    this.selectedObject.emit(undefined);
    this.currentObject = undefined;
    if (this.inputSubscriber) {
      this.inputSubscriber.next($event);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected) {
      this.update(changes.selected.currentValue as string);
    }
  }
}
