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
  public selectedParent: Category = null;
  public parentCategories: Category[] = null;
  public childCategories: Category[] = null;

  constructor() {
  }

  ngOnInit() {
    this.parentCategories = this.categories.filter(e => e.parent === null);
    this.selectedParent = this.parentCategories[0];
    this.refreshChilds(this.selectedParent);
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

  onChangeParentCategoryModel(cat: Category) {
    this.selectedCat = cat;
    this.onCategorySelect.emit(cat);
    this.refreshChilds(cat);
  }

  private refreshChilds(cat: Category) {
    this.childCategories = this.categories
      .filter(e => e.parent !== null)
      .filter(e => e.parent.id === cat.id);
  }
}
