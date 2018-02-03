import { Component } from '@angular/core';

declare var _user: string;

@Component({
  selector: 'sango-navbar',
  templateUrl: './sango-navbar.component.html',
  styleUrls: ['./sango-navbar.component.css']
})
export class SangoNavbarComponent {
    user: string;

    constructor() {
	this.user = _user;
    }
}
