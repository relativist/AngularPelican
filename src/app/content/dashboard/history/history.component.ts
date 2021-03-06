import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProgressDay} from '../../shared/models/progress-day';
import {Category} from '../../shared/models/category';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  @Input() progresses: ProgressDay[] = [];
  @Output() onDateSelect = new EventEmitter<ProgressDay>();
  @Input() selectedProgressDay: ProgressDay;

  constructor() {
    this.selectedProgressDay = this.progresses[0];
    this.onDateSelect.emit(this.progresses[0]);
  }

  ngOnInit() {
  }


  selectDate(day: ProgressDay) {
    this.selectedProgressDay = day;
    this.onDateSelect.emit(day);
  }

}
