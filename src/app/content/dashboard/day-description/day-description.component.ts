import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ProgressDay} from '../../shared/models/progress-day';
import {EventApp} from '../../shared/models/event-app';
import {Message} from '../../shared/models/message';
import {NgForm} from '@angular/forms';
import {Category} from '../../shared/models/category';
import {EventService} from '../../shared/services/event-service';
import {CategoryService} from '../../shared/services/category-service';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-day-description',
  templateUrl: './day-description.component.html',
  styleUrls: ['./day-description.component.scss']
})
export class DayDescriptionComponent implements OnInit, OnDestroy {

  @Input() selectedProgressDay: ProgressDay;
  @Input() categories: Category[] = [];
  @Input() events: EventApp[] = [];
  message: Message;
  dropDownCategoryIdx = 0;
  score_to_add = 1;
  @Output() onEventEdit = new EventEmitter<EventApp>();
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;

  constructor(private es: EventService, private cs: CategoryService) {
    this.message = new Message('success', '');
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const {score} = form.value;
    const cat = this.categories[this.dropDownCategoryIdx];
    const event = new EventApp(score, cat.id, this.selectedProgressDay.date);

    if (cat.disposable) {
      if (cat.disposable_capacity - (score + cat.disposable_done) > 0) {
        cat.disposable_done += score;
      } else {
        cat.disposable_done = cat.disposable_capacity;
        cat.deprecated = true;
      }
      this.sub1 = this.cs.getCategoryById(cat.id.toString()).subscribe((oCat: Category) => {
        const cTmp = oCat;
        cTmp.disposable_capacity = cat.disposable_capacity;
        cTmp.deprecated = cat.deprecated;
        cTmp.disposable_done = cat.disposable_done;
        this.sub2 = combineLatest(this.cs.updateCategory(cTmp),
          this.es.createEvent(event)).subscribe((data: [Category, EventApp]) => {
          this.onEventEdit.emit(data[1]);
          this.message.text = 'Created.';
          window.setTimeout(() => this.message.text = '', 1000);
        });
      });
    } else {
      this.sub3 = this.es.createEvent(event).subscribe((ev: EventApp) => {
        this.onEventEdit.emit(ev);
        this.message.text = 'Created.';
        window.setTimeout(() => this.message.text = '', 1000);
      });
    }


  }

  onCreateNewEvent() {

  }

  onCategoryChange() {
  }


  isSimpleCategory(): boolean {
    const cat = this.categories[this.dropDownCategoryIdx];
    if (cat) {
      return cat.simple;
    }
    return true;
  }

  isSimpleCategoryById(catId: number): boolean {
    const cat = this.categories.filter(e => e.id === catId);
    if (cat && cat.length > 0) {
      return cat[0].simple;
    }
    return true;
  }


  categoryNameById(catId: number): string {
    const cat = this.categories.filter(e => e.id === catId);
    if (cat && cat.length > 0) {
      let postfix = '';
      if (cat[0].disposable) {
        postfix = ' (' + cat[0].disposable_done + ' of ' + cat[0].disposable_capacity + ')';
      }
      return cat[0].name + postfix;
    }
    return 'undefined';
  }

  updateEvents() {
    console.log('update');
    for (let i = 0; i < this.events.length; i++) {
      this.sub4 = this.es.updateEvent(this.events[i]).subscribe((event: EventApp) => {
        this.onEventEdit.emit(event);
        this.message.text = 'Updated.';
        window.setTimeout(() => this.message.text = '', 1000);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }

    if (this.sub3) {
      this.sub3.unsubscribe();
    }

    if (this.sub4) {
      this.sub4.unsubscribe();
    }
  }
}
