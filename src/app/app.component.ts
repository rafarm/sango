import { Component,
	 ElementRef,
	 AfterContentChecked,
	 HostListener }		from '@angular/core';

import { StretchableComponent }	from './utils/stretchable.component';
import { ConfigService }        from './core/config.service';

declare var _user:string;

@Component({
    selector: 'aa-app',
    templateUrl: './app.component.html'
})
export class AppComponent extends StretchableComponent {
    schoolName: string;
    user: string;

    constructor(private configService: ConfigService) {
	super();
	this.schoolName = configService.schoolName;
	this.user = _user;
    }
}

