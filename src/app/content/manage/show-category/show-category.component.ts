import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from '../../shared/models/category';

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
    let prefix = '';
    if (cat.categoryParentId !== 0) {
      const idx = this.categories.findIndex(e => e.id === cat.categoryParentId);
      prefix = this.categories[idx].name + ': ';
    }
    return prefix + cat.name;
  }

  selectCategory(cat: Category) {
    this.onCategorySelect.emit(cat);
  }

}
