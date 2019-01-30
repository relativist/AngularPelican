import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup, NgForm} from '@angular/forms';
import {Message} from '../../shared/models/message';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../shared/services/auth.service';
import {Plan} from '../../shared/models/plan';
import {PlanService} from '../../shared/services/plan-service';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-plan',
  templateUrl: './manage-plan.component.html',
  styleUrls: ['./manage-plan.component.scss']
})
export class ManagePlanComponent implements OnInit, OnDestroy {

  @Input() cat: Plan;
  @Input() categories: Plan[] = [];
  @Input() filteredPlans: Plan[] = [];
  @Output() onPlanEdit = new EventEmitter<Plan>();
  createNew = false;
  message: Message;
  sub1: Subscription;
  sub2: Subscription;

  constructor(private planService: PlanService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.message = new Message('success', '');
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    const {name, score, isGrand, isFinished } = form.value;
    if (this.createNew) {
      const dateToday = moment().format('DD.MM.YYYY');
      const newPlan = new Plan(isFinished, isGrand, score, name, dateToday, this.authService.user);
      newPlan.id = undefined;
      this.sub1 = this.planService.createPlan(newPlan)
        .subscribe((cat: Plan) => {
          this.onPlanEdit.emit(cat);
        });
      this.createNew = false;
    } else {
      this.cat.score = score;
      this.cat.name = name;
      this.cat.isFinished = isFinished;
      this.cat.isGrand = isGrand;
      this.sub2 = this.planService.updatePlan(this.cat)
        .subscribe((cat: Plan) => {
          this.onPlanEdit.emit(cat);
        });
    }
  }

  onPlanChange() {
    // console.log('this.dropDownPlanId', this.dropDownPlanId);
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
