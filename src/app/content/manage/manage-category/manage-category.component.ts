import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Category} from '../../shared/models/category';
import {FormGroup, NgForm} from '@angular/forms';
import {CategoryService} from '../../shared/services/category-service';
import {Message} from '../../shared/models/message';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit, OnDestroy {

  @Input() cat: Category;
  @Input() categories: Category[] = [];
  @Input() filteredCategories: Category[] = [];
  @Input() dropDownCategoryId = 1;
  @Output() onCategoryEdit = new EventEmitter<Category>();
  createNew = false;
  message: Message;
  sub1: Subscription;
  sub2: Subscription;

  constructor(private cs: CategoryService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.message = new Message('success', '');
  }

  onSubmit(form: NgForm) {
    const {name, score, disposableCapacity, simple, disposable, disposableDone} = form.value;
    let parentId = 0;
    if (this.dropDownCategoryId !== 0) {
      parentId = +this.dropDownCategoryId;
    }
    console.log('parentId', parentId);
    console.log('this.dropDownCategoryId', this.dropDownCategoryId);

    const parentCategoryIdx = this.categories.findIndex(e => e.id === parentId);
    let parentCategory = this.categories[parentCategoryIdx];

    let cap = 0;
    let cap_done = 0;
    if (this.cat.disposable) {
      cap = disposableCapacity;
      cap_done = disposableDone;
    }
    if (parentId === 0) {
      parentCategory = null;
    }
    const ctg = new Category(parentCategory,
      name,
      simple,
      score,
      disposable,
      cap,
      cap_done,
      false,
      this.authService.user,
      false,
      this.cat.id);
    if (this.createNew) {
      ctg.id = undefined;
      this.sub1 = this.cs.createCategory(ctg)
        .subscribe((cat: Category) => {
          this.onCategoryEdit.emit(cat);
          // this.message.text = 'Edited.';
          window.setTimeout(() => this.message.text = '', 1000);
        });
      this.createNew = false;
    } else {
      const children = this.categories.filter(e => e.parent !== null && e.parent.id === ctg.id);
      if (children.length > 0) {
        ctg.parent = null;
      }
      console.log('edit cat: ', ctg);
      this.sub2 = this.cs.updateCategory(ctg)
        .subscribe((cat: Category) => {
          this.onCategoryEdit.emit(cat);
          this.message.text = 'Edited.';
          window.setTimeout(() => this.message.text = '', 1000);
        });
    }

  }

  onCategoryChange() {
    // console.log('this.dropDownCategoryId', this.dropDownCategoryId);
  }

  onCreateNewCat() {
    this.createNew = true;
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }

    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
}
