import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProgressDay} from '../../shared/models/progress-day';
import {EventApp} from '../../shared/models/event-app';
import {Message} from '../../shared/models/message';
import {NgForm} from '@angular/forms';
import {Category} from '../../shared/models/category';

@Component({
  selector: 'app-day-description',
  templateUrl: './day-description.component.html',
  styleUrls: ['./day-description.component.scss']
})
export class DayDescriptionComponent implements OnInit {

  @Input() selectedProgressDay: ProgressDay;
  @Input() categories: Category[] = [];
  @Input() events: EventApp[] = [];
  message: Message;
  dropDownCategoryIdx = 0;
  score_to_add = 0;

  // @Output() onEventEdit = new EventEmitter<EventApp>();

  constructor() {
    this.message = new Message('success', '');
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {

  }

  onCreateNewEvent() {

  }

  onCategoryChange() {
  }

  prettyCatName(cat: Category): string {
    let prefix = '';
    if (cat.category_parent_id !== 0) {
      const idx = this.categories.findIndex(e => e.id === cat.category_parent_id);
      prefix = this.categories[idx].name + ': ';
    }
    return prefix + cat.name;
  }

  isSimpleCategory(): boolean {
    return this.categories[this.dropDownCategoryIdx].simple;
  }


}
