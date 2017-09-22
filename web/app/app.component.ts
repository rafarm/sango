import { Component } 			from '@angular/core';

import {ResizableHeightComponent }	from './utils/resizable-height.component';

@Component({
    moduleId: module.id,
    selector: 'aa-app',
    templateUrl: './app.component.html'
})
export class AppComponent extends ResizableHeightComponent {
    constructor() {
	super();
    }
}

