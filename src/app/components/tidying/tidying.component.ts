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

  constructor(private os: ObjectsService) {
  }

  ngOnInit() {
    this.os.getTidyingData().subscribe(tree => this.tree = tree);
  }

  displayObject(item: CompleteObject) {
    return item.objectType.name + ' ' + item.object.suffix;
  }
}
