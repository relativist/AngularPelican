import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BadCategory} from '../../shared/models/bad.category';

@Component({
  selector: 'app-show-bad-category',
  templateUrl: './show-bad.category.component.html',
  styleUrls: ['./show-bad.category.component.scss']
})
export class ShowBadCategoryComponent implements OnInit {

  @Input() selectedCat: BadCategory;
  @Input() categories: BadCategory[] = [];
  @Output() onBadCategorySelect = new EventEmitter<BadCategory>();

  constructor() {
  }

  ngOnInit() {
  }

  selectBadCategory(cat: BadCategory) {
    this.onBadCategorySelect.emit(cat);
  }

}
