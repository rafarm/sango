import { Component,
	 ElementRef,
	 AfterContentChecked,
	 HostListener }		from '@angular/core';

import { StretchableComponent } from './utils/stretchable.component';
import { ConfigService }        from './core/config.service';

@Component({
    selector: 'sango-app',
    templateUrl: './app.component.html'
})
export class AppComponent extends StretchableComponent {
    schoolName: string;

    constructor(private configService: ConfigService) {
	super();
	this.schoolName = configService.schoolName;
    }
}

