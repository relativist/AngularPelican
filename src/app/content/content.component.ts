import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})

export class ContentComponent implements OnInit {

  constructor(private title: Title,
              private meta: Meta) {
    title.setTitle('Pelican');
    meta.addTags([
      {name: 'keywords', content: 'content, system, management'},
      {name: 'description', content: 'page for system content'},
    ]);
  }

  ngOnInit(): void {
  }
}
