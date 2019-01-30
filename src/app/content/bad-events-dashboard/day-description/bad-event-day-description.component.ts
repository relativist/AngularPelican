import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ProgressDay} from '../../shared/models/progress-day';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../shared/services/auth.service';
import {BadEventService} from '../../shared/services/bad-event-service';
import {BadCategoryService} from '../../shared/services/bad-category-service';
import {BadCategory} from '../../shared/models/bad.category';
import {BadEvent} from '../../shared/models/BadEvent';

@Component({
  selector: 'app-bad-event-day-description',
  templateUrl: './bad-event-day-description.component.html',
  styleUrls: ['./bad-event-day-description.component.scss']
})
export class BadEventDayDescriptionComponent implements OnInit, OnDestroy {

  @Input() selectedProgressDay: ProgressDay;
  @Input() categories: BadCategory[] = [];
  @Input() events: BadEvent[] = [];
  // message: Message;
  dropDownCategoryIdx = 0;
  score_to_add = 1;
  @Output() onEventEdit = new EventEmitter<BadEvent>();
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;

  constructor(private badEventService: BadEventService,
              private badCategoryService: BadCategoryService,
              private authService: AuthService
  ) {
    // this.message = new Message('success', '');
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {

    const cat = this.categories[this.dropDownCategoryIdx];
    const event = new BadEvent(this.selectedProgressDay.date, cat, this.authService.user);

    this.sub3 = this.badEventService.createBadEvent(event).subscribe((ev: BadEvent) => {
      this.onEventEdit.emit(ev);
    });
  }

  onCreateNewEvent() {
  }

  onCategoryChange() {
  }

  remove(event: BadEvent) {
    const idx = this.events.indexOf(event);
    const eventToDelete = this.events[idx];
    if (idx > -1) {
      event.date = '';
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

  prettyBadCategory(cat: BadCategory): string {
    return cat.name + ' (' + cat.score + ')';
  }
}
