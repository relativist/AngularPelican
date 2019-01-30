import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from '../../shared/models/category';
import PelicanUtils from '../../shared/pelicanUtils';
import {Plan} from '../../shared/models/plan';

@Component({
  selector: 'app-show-category',
  templateUrl: './show-category.component.html',
  styleUrls: ['./show-category.component.scss']
})
export class ShowCategoryComponent implements OnInit {

  @Input() selectedCat: Category;
  @Input() categories: Category[] = [];
  @Output() onCategorySelect = new EventEmitter<Category>();

  constructor() {
  }

  ngOnInit() {
  }

  prettyCatName(cat: Category): string {
    return PelicanUtils.prettyCatName(cat);
  }

  selectCategory(cat: Category) {
    this.onCategorySelect.emit(cat);
  }

  isNotDeprecated(cat: Category) {
    return !cat.deprecated;
  }

  isDeprecated(cat: Category) {
    return cat.deprecated;
  }
}
