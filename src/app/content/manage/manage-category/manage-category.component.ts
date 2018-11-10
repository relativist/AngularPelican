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
  @Input() dropDownCategoryId = 0;
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
    let cap = 0;
    let cap_done = 0;
    if (this.cat.disposable) {
      cap = disposableCapacity;
      cap_done = disposableDone;
    }
    const ctg = new Category(parentId,
      name,
      simple,
      score,
      disposable,
      cap,
      cap_done,
      false,
      this.authService.user.id,
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
      const children = this.categories.filter(e => e.categoryParentId === ctg.id);
      if (children.length > 0) {
        ctg.categoryParentId = 0;
      }
      this.sub2 = this.cs.updateCategory(ctg)
        .subscribe((cat: Category) => {
          this.onCategoryEdit.emit(cat);
          this.message.text = 'Edited.';
          window.setTimeout(() => this.message.text = '', 1000);
        });
    }

  }

  onCategoryChange() {
    // console.log(this.dropDownCategoryId);
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
