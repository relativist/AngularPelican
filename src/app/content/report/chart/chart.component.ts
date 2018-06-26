import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input()  data;
  @Input()  legend;
  @Input()  height = 260;
  @Input()  width = 400;
  constructor() { }

  ngOnInit() {
  }

}
