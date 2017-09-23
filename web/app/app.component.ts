import { Component,
	 ElementRef,
	 AfterContentChecked,
	 HostListener }		from '@angular/core';

import {StretchableComponent }	from './utils/stretchable.component';

@Component({
    moduleId: module.id,
    selector: 'aa-app',
    templateUrl: './app.component.html'
})
export class AppComponent extends StretchableComponent {
    constructor() {
	super();
    }
}

