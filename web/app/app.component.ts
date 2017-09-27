import { Component,
	 ElementRef,
	 AfterContentChecked,
	 HostListener }		from '@angular/core';

import { StretchableComponent }	from './utils/stretchable.component';
import { ConfigService }        from './core/config.service';

@Component({
    moduleId: module.id,
    selector: 'aa-app',
    templateUrl: './app.component.html'
})
export class AppComponent extends StretchableComponent {
    private schoolName: string;

    constructor(private configService: ConfigService) {
	super();
	this.schoolName = configService.schoolName;
    }
}

