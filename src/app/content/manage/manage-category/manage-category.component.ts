import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from '../../shared/models/category';
import {FormGroup, NgForm} from '@angular/forms';
import {CategoryService} from '../../shared/services/category-service';
import {Message} from '../../shared/models/message';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  @Input() cat: Category;
  @Input() categories: Category[] = [];
  @Input() filteredCategories: Category[] = [];
  @Input() dropDownCategoryId = 0;
  @Output() onCategoryEdit = new EventEmitter<Category>();
  createNew = false;
  message: Message;

  constructor(private cs: CategoryService) {
  }

  ngOnInit() {
    this.message = new Message('success', '');
  }

  onSubmit(form: NgForm) {
    const {name, score, disposable_capacity, simple, disposable} = form.value;
    let parentId = 0;
    if (this.dropDownCategoryId !== 0) {
      parentId = +this.dropDownCategoryId;
    }
    let cap = 0;
    if (this.cat.disposable) {
      cap = disposable_capacity;
    }
    const ctg = new Category(parentId,
      name,
      simple,
      score,
      disposable,
      cap,
      this.cat.disposable_done,
      this.cat.id);

    if (this.createNew) {
      ctg.id = undefined;
      this.cs.createCategory(ctg)
        .subscribe((cat: Category) => {
          this.onCategoryEdit.emit(cat);
          // this.message.text = 'Edited.';
          window.setTimeout(() => this.message.text = '', 1000);
        });
      this.createNew = false;
    } else {
      const children = this.categories.filter(e => e.category_parent_id === ctg.id);
      if (children.length > 0) {
        ctg.category_parent_id = 0;
      }
      this.cs.updateCategory(ctg)
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
}
