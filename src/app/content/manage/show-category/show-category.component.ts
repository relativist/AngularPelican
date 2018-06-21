import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from '../../shared/models/category';

@Component({
  selector: 'app-show-category',
  templateUrl: './show-category.component.html',
  styleUrls: ['./show-category.component.scss']
})
export class ShowCategoryComponent implements OnInit {

  @Input() categories: Category[] = [];
  @Output() onCategoryAdd = new EventEmitter<Category>();

  constructor() {
  }

  ngOnInit() {
  }

  prettyCatName(cat: Category): string {
    let prefix = '';
    if (cat.category_parent_id !== 0) {
      const idx = this.categories.findIndex(e => e.id === cat.category_parent_id);
      prefix = this.categories[idx].name + ': ';
    }
    return prefix + cat.name;
  }

  selectCategory(cat: Category) {
    this.onCategoryAdd.emit(cat);
  }

}
