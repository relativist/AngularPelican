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
  isLoaded = false;
  isSelected = false;
  selectedCategory: Category;

  constructor(private cs: CategoryService) {
    this.cs.getCategories()
      .subscribe((cat: Category[]) => {
        this.categories = cat;
        this.isLoaded = true;
      });
  }

  ngOnInit() {
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
    this.isSelected = true;
  }
}
