import {Component, Input, OnInit} from '@angular/core';
import {Category} from '../../shared/models/category';

@Component({
  selector: 'app-show-category',
  templateUrl: './show-category.component.html',
  styleUrls: ['./show-category.component.scss']
})
export class ShowCategoryComponent implements OnInit {

  @Input() categories: Category[] = [];
  constructor() { }

  ngOnInit() {
  }

}
