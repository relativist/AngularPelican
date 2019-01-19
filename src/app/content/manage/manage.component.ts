import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../shared/models/category';
import {CategoryService} from '../shared/services/category-service';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../shared/models/user';
import {AuthService} from '../shared/services/auth.service';

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
        this.categories = cat.sort((a, b) => this.prettyCatName(a).localeCompare(this.prettyCatName(b)));
        this.isLoaded = true;
        this.selectedCategory = this.categories[0];
        this.filteredCategory = this.categories.filter(c => c.parent === null);
        this.cBoxIds = this.filteredCategory.findIndex(e => e.id === this.selectedCategory.id);
      });
  }


  ngOnInit() {
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
  }

  prettyCatName(cat: Category): string {
    let prefix = '';
    if (cat.parent !== null) {
      const idx = this.categories.findIndex(e => e.id === cat.parent.id);
      prefix = this.categories[idx].name + ': ';
    }
    return prefix + cat.name;
  }


  categoryWasEdited(cat: Category) {
    const idx = this.categories.findIndex(e => e.id === cat.id);
    if (idx >= 0) {
      this.categories[idx] = cat;
    } else {
      this.categories.push(cat);
    }
    this.filteredCategory = this.categories.filter(c => c.parent === null);
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }
}
