import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Plan} from '../../shared/models/plan';

@Component({
  selector: 'app-show-plan',
  templateUrl: './show-plan.component.html',
  styleUrls: ['./show-plan.component.scss']
})
export class ShowPlanComponent implements OnInit {

  @Input() selectedCat: Plan;
  @Input() categories: Plan[] = [];
  @Output() onPlanSelect = new EventEmitter<Plan>();

  constructor() {
  }

  ngOnInit() {
  }

  selectPlan(cat: Plan) {
    this.onPlanSelect.emit(cat);
  }

  filterGrandPlansAndFinished(plan: Plan) {
    return plan.isGrand && plan.isFinished;
  }

  filterNotFinished(plan: Plan) {
    return !plan.isFinished ;
  }

}
