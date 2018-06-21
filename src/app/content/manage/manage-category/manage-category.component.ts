import {Component, Input, OnInit} from '@angular/core';
import {Category} from '../../shared/models/category';
import {FormGroup, NgForm} from '@angular/forms';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  @Input() cat: Category;
  @Input() categories: Category[] = [];
  @Input() currentCategoryId = 1;

  constructor() {
  }

  ngOnInit() {
    // if (this.cat.category_parent_id > 0) {
    //   console.log('>');
    //   this.currentCategoryId = this.categories.findIndex(e => e.id === this.cat.category_parent_id);
    // } else {
    //   console.log('else');
    //   this.currentCategoryId = 1;
    // }
    console.log('constructor: ' + this.currentCategoryId);
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    // let {capacity, name} = form.value;
    // if (capacity < 0) {
    //   capacity = capacity * -1;
    // }
    // const category = new Category(name, capacity, +this.currentCategoryId);
    // this.sub1 = this.catService.updateCategory(category)
    //   .subscribe((cat: Category) => {
    //     this.onCategoryEdit.emit(cat);
    //     this.message.text = 'Edited.';
    //     window.setTimeout(() => this.message.text = '', 1000);
    //   });

  }

  onCategoryChange() {
    console.log(this.currentCategoryId);
  }
}
