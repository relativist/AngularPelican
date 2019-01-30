import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../shared/models/user';
import {AuthService} from '../shared/services/auth.service';
import {BadCategory} from '../shared/models/bad.category';
import {BadCategoryService} from '../shared/services/bad-category-service';

@Component({
  selector: 'app-bad-component',
  templateUrl: './bad.categories.component.html',
  styleUrls: ['./bad.categories.component.scss']
})
export class BadCategoriesComponent implements OnInit, OnDestroy {

  badCategories: BadCategory[] = [];
  // filteredBadCategory: BadCategory[] = [];
  isLoaded = false;
  selectedBadCategory: BadCategory;
  cBoxIds = 0;
  sub1: Subscription;
  user: User;

  constructor(private cs: BadCategoryService,
              private authService: AuthService) {
    this.sub1 = this.cs.getBadCategories(authService.user.id)
      .subscribe((cat: BadCategory[]) => {
        this.badCategories = cat;
        this.badCategories = cat.sort((a, b) => a.name.localeCompare(b.name));
        this.isLoaded = true;
        this.selectedBadCategory = this.badCategories[0];
        // this.filteredBadCategory = this.plans.filter(c => c.parent === null);
        // this.cBoxIds = this.filteredBadCategory.findIndex(e => e.id === this.selectedBadCategory.id);
      });
  }


  ngOnInit() {
  }

  selectBadCategory(cat: BadCategory) {
    this.selectedBadCategory = cat;
  }

  badCategoryWasEdited(cat: BadCategory) {
    const idx = this.badCategories.findIndex(e => e.id === cat.id);
    if (idx >= 0) {
      this.badCategories[idx] = cat;
    } else {
      this.badCategories.push(cat);
    }
    // this.filteredBadCategory = this.plans.filter(c => c.parent === null);
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }
}
