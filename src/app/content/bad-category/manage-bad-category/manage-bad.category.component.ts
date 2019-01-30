import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup, NgForm} from '@angular/forms';
import {Message} from '../../shared/models/message';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../shared/services/auth.service';
import {BadCategory} from '../../shared/models/bad.category';
import {BadCategoryService} from '../../shared/services/bad-category-service';

@Component({
  selector: 'app-manage-bad-category',
  templateUrl: './manage-bad-category.component.html',
  styleUrls: ['./manage-bad-category.component.scss']
})
export class ManageBadBadCategoryComponent implements OnInit, OnDestroy {

  @Input() cat: BadCategory;
  @Input() categories: BadCategory[] = [];
  @Input() filteredCategories: BadCategory[] = [];
  @Output() onBadCategoryEdit = new EventEmitter<BadCategory>();
  createNew = false;
  message: Message;
  sub1: Subscription;
  sub2: Subscription;

  constructor(private badCategoryService: BadCategoryService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.message = new Message('success', '');
  }

  onSubmit(form: NgForm) {
    const {name, score} = form.value;
    if (this.createNew) {
      const ctg = new BadCategory(name, score, this.authService.user);
      ctg.id = undefined;
      this.sub1 = this.badCategoryService.createBadCategory(ctg)
        .subscribe((cat: BadCategory) => {
          this.onBadCategoryEdit.emit(cat);
        });
      this.createNew = false;
    } else {
      this.cat.score = score;
      this.cat.name = name;
      this.sub2 = this.badCategoryService.updateBadCategory(this.cat)
        .subscribe((cat: BadCategory) => {
          this.onBadCategoryEdit.emit(cat);
        });
    }
  }

  onBadCategoryChange() {
    // console.log('this.dropDownBadCategoryId', this.dropDownBadCategoryId);
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
