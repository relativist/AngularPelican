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
import {AuthService} from '../../shared/services/auth.service';
import PelicanUtils from '../../shared/pelicanUtils';

@Component({
  selector: 'app-day-description',
  templateUrl: './day-description.component.html',
  styleUrls: ['./day-description.component.scss']
})
export class DayDescriptionComponent implements OnInit, OnDestroy {

  @Input() selectedProgressDay: ProgressDay;
  @Input() categories: Category[] = [];
  @Input() events: EventApp[] = [];
  public parentCategories: Category[] = [];
  public childCategories: Category[] = [];

  // message: Message;
  dropDownCategoryIdx = 0;
  score_to_add = 1;
  @Output() onEventEdit = new EventEmitter<EventApp>();
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;

  constructor(private eventService: EventService,
              private cs: CategoryService,
              private authService: AuthService) {
    // this.message = new Message('success', '');
  }

  ngOnInit() {
    this.parentCategories = this.categories.filter(e => e.parent === null);
    this.childCategories = this.categories.filter(e => e.parent !== null);
  }

  onSubmit(form: NgForm) {
    const {score} = form.value;
    const cat: Category = this.childCategories[this.dropDownCategoryIdx];

    if (cat === null) {
      return;
    }

    if (cat.disposable) {
      if (score >= cat.disposableCapacity) {
        cat.deprecated = true;
      }

      const deltaDone: number = score - cat.disposableDone;
      cat.disposableDone = score;

      const event: EventApp = new EventApp(deltaDone, cat, this.selectedProgressDay.date, this.authService.user);

      this.sub2 = combineLatest(
        this.cs.updateCategory(cat),
        this.eventService.createEvent(event)
      ).subscribe((data: [Category, EventApp]) => {
        this.onEventEdit.emit(data[1]);
      });

    } else {
      const event: EventApp = new EventApp(score, cat, this.selectedProgressDay.date, this.authService.user);
      this.sub3 = this.eventService.createEvent(event).subscribe((ev: EventApp) => {
        this.onEventEdit.emit(ev);
      });
    }


  }

  onCreateNewEvent() {

  }

  onParentSelect(event) {
    const parentIdx = event.target.value;
    const parent = this.parentCategories[parentIdx];
    this.childCategories = this.categories
      .filter(e => e.parent !== null)
      .filter(e => e.parent.id === parent.id);
  }

  onChildSelect(event) {
    this.dropDownCategoryIdx = event.target.value;
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
        postfix = ' (' + cat[0].disposableDone + ' of ' + cat[0].disposableCapacity + ')';
      }
      return cat[0].name + postfix;
    }
    return 'undefined';
  }

  updateEvents() {
    for (let i = 0; i < this.events.length; i++) {
      this.sub4 = this.eventService.updateEvent(this.events[i]).subscribe((event: EventApp) => {
        this.onEventEdit.emit(event);
        // this.message.text = 'Updated.';
        // window.setTimeout(() => this.message.text = '', 1000);
      });
    }
  }

  remove(event: EventApp) {
    console.log('delete event: ', event);
    const idx = this.events.indexOf(event);
    const eventToDelete = this.events[idx];
    if (idx > -1) {
      // this.events.splice(idx, 1);
      event.score = 0;
      this.onEventEdit.emit(event);
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

    if (this.sub5) {
      this.sub5.unsubscribe();
    }
  }

  prettyEventAppConvert(event: EventApp): string {
    return PelicanUtils.prettyCatName(event.category);
  }
}
