import { Component }				from '@angular/core';

import { AssessmentsDividerBaseComponent } 	from '../assessments-divider-base.component';

@Component({
    moduleId: module.id,
    template: `
	<nav-divider [items]="assessments" [togglerId]="'toggleableSidebar'" [toggleLabel]="'Toggle side navigation bar'"></nav-divider>
	<router-outlet></router-outlet>
    `
})
export class StudentsComponent extends AssessmentsDividerBaseComponent {

}
