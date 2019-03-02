import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../shared/models/category';
import {CategoryService} from '../shared/services/category-service';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../shared/models/user';
import {AuthService} from '../shared/services/auth.service';
import PelicanUtils from '../shared/pelicanUtils';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  filteredCategory: Category[] = [];
  isLoaded = false;
  selectedCategory: Category;
  cBoxIds = 0;
  sub1: Subscription;
  user: User;

  constructor(private cs: CategoryService,
              private authService: AuthService) {
    this.sub1 = this.cs.getCategories(authService.user.id)
      .subscribe((cat: Category[]) => {
        this.categories = cat;
        this.categories = cat.sort((a, b) => {
          if (a.deprecated && !b.deprecated) {
            return 1;
          }

          if (!a.deprecated && b.deprecated) {
            return -1;
          }
          return PelicanUtils.prettyCatName(a).localeCompare(PelicanUtils.prettyCatName(b));
        });
        this.isLoaded = true;
        this.selectedCategory = this.categories[0];
        this.filteredCategory = this.categories.filter(c => c.parent === null);
        const emptyCategory = new Category(null, 'NO PARENT', false, 0, false, 0, 0, false,
          null, false, 0);
        this.filteredCategory.push(emptyCategory);
        this.cBoxIds = this.filteredCategory.findIndex(e => e.id === this.selectedCategory.id);
      });
  }


  ngOnInit() {
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
  }

  categoryWasEdited(cat: Category) {
    console.log('cat:', cat);
    console.log('cats:', this.categories);

    const idx = this.categories.findIndex(e => e.id === cat.id);
    if (idx >= 0) {
      this.categories[idx] = cat;
    } else {
      this.categories.push(cat);
    }
    this.filteredCategory = this.categories.filter(c => c.parent === null);
    const emptyCategory = new Category(null, 'NO PARENT', false, 0, false, 0, 0, false,
      null, false, 0);
    this.filteredCategory.push(emptyCategory);
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }
}
