import {Component, OnInit} from '@angular/core';
import {ObjectsService} from '../../services/objects.service';
import {TopTidyingTree} from '../../data/tidying';
import {CompleteObject} from '../../data/object';

@Component({
  selector: 'app-tidying',
  templateUrl: './tidying.component.html',
  styleUrls: ['./tidying.component.css']
})
export class TidyingComponent implements OnInit {
  tree: TopTidyingTree;

  invert = false;

  constructor(private os: ObjectsService) {
  }

  reload() {
    this.tree = undefined;
    this.os.getTidyingData(this.invert).subscribe(tree => this.tree = tree);
  }

  ngOnInit() {
    this.reload();
  }

  displayObject(item: CompleteObject) {
    return item.objectType.name + ' ' + item.object.suffix;
  }
}
