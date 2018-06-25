import {Component, OnInit} from '@angular/core';
import {Category} from '../shared/models/category';
import {CategoryService} from '../shared/services/category-service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  categories: Category[] = [];
  filteredCategory: Category[] = [];
  isLoaded = false;
  selectedCategory: Category;
  cBoxIds = 0;

  constructor(private cs: CategoryService) {
    this.cs.getCategories()
      .subscribe((cat: Category[]) => {
        this.categories = cat;
        this.isLoaded = true;
        this.selectedCategory = this.categories[0];
        this.filteredCategory = this.categories.filter(c => c.category_parent_id === 0);
        this.cBoxIds = this.filteredCategory.findIndex(e => e.id === this.selectedCategory.id);
      });
  }


  ngOnInit() {
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
  }

  categoryWasEdited(cat: Category) {
    const idx = this.categories.findIndex(e => e.id === cat.id);
    if (idx >= 0) {
      this.categories[idx] = cat;
    } else {
      this.categories.push(cat);
    }
    this.filteredCategory = this.categories.filter(c => c.category_parent_id === 0);
  }
}
