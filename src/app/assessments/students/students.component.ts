import { Component }		from '@angular/core';

import { AssessmentsDividerBaseComponent } 	from '../assessments-divider-base.component';
import { StudentsListComponent }	 	from './students-list.component';

@Component({
    template: `
	<nav-divider [icon]="'menu'" [items]="assessments" (iconClick)="toggle()"></nav-divider>
	<router-outlet (activate)="onActivate($event)" (deactivate)="onDeactivate()"></router-outlet>
    `
})
export class StudentsComponent extends AssessmentsDividerBaseComponent {
    private studentsList: StudentsListComponent;

    onActivate(componentRef: StudentsListComponent) {
	this.studentsList = componentRef;
    }

    onDeactivate() {
	this.studentsList = null;
    }

    toggle() {
	if (this.studentsList) {
	    this.studentsList.drawerOpened = !this.studentsList.drawerOpened;
	}
    }
}
