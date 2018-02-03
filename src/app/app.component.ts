import { Component,
	 ElementRef,
	 AfterContentChecked,
	 HostListener }		from '@angular/core';

import { ConfigService }        from './core/config.service';

@Component({
    selector: 'sango-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    schoolName: string;

    constructor(private configService: ConfigService) {
	this.schoolName = configService.schoolName;
    }
}

