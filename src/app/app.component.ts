import { Component,
	 ElementRef,
	 AfterContentChecked,
	 HostListener }		from '@angular/core';

import { StretchableComponent }	from './utils/stretchable.component';
import { ConfigService }        from './core/config.service';

declare var _user:string;

@Component({
    templateUrl: './app.component.html'
})
export class AppComponent extends StretchableComponent {
    private schoolName: string;
    private user: string;

    constructor(private configService: ConfigService) {
	super();
	this.schoolName = configService.schoolName;
	this.user = _user;
    }
}
