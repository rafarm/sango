import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'aa-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    title = 'Assistent d\'avaluació';

    constructor(
	//private dataService: DataService,
	private router: Router) {}

    /*
    ngOnInit() {
	this.dataService.getSessions().then(sessions => this.sessions = sessions);
    }

    gotoSession(event: any) {
	let value = event.target.value;
	if (value != -1) {
	    let link = ['/session', value];
	    this.router.navigate(link);
	}
    }
    */
}

