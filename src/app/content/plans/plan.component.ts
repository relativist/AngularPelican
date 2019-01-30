import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../shared/models/user';
import {AuthService} from '../shared/services/auth.service';
import {Plan} from '../shared/models/plan';
import {PlanService} from '../shared/services/plan-service';
import {ScoreService} from '../shared/services/score-service';
import {Score} from '../shared/models/score';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {EventApp} from '../shared/models/event-app';
import {Category} from '../shared/models/category';

@Component({
  selector: 'app-bad-component',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {

  plans: Plan[] = [];
  isLoaded = false;
  selectedPlan: Plan;
  score: Score;
  sub1: Subscription;
  user: User;

  constructor(private planService: PlanService,
              private authService: AuthService,
              private scoreService: ScoreService) {
  }


  ngOnInit() {
    this.sub1 = combineLatest(
      this.planService.getPlans(this.authService.user.id),
      this.scoreService.getScore(this.authService.user.id)
    ).subscribe((data: [Plan[], Score]) => {
      this.score = data[1];
      this.plans = data[0]
        .filter(e => !e.isFinished)
        .sort((a, b) => {

          if (a.isFinished && b.isFinished) {
            return a.name.localeCompare(b.name);
          }

          if (a.isFinished && !b.isFinished) {
            return 1;
          }

          if (!a.isFinished && b.isFinished) {
            return -1;
          }

          return a.name.localeCompare(b.name);

        });
      this.isLoaded = true;
      this.selectedPlan = this.plans[0];
    });
  }

  selectPlan(cat: Plan) {
    this.selectedPlan = cat;
  }

  planWasEdited(cat: Plan) {
    const idx = this.plans.findIndex(e => e.id === cat.id);
    if (idx >= 0) {
      this.plans[idx] = cat;
      this.scoreService.operateScore(this.authService.user.id, cat.score).subscribe((score: Score) => {
        this.score = score;
        this.plans.splice(idx, 1);
      });
    } else {
      this.plans.push(cat);
    }
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }
}
