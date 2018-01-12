import { Component }				from '@angular/core';

import { AssessmentsDividerBaseComponent } 	from '../assessments-divider-base.component';

@Component({
    template: `
	<nav-divider [hasSidebar]="true" [items]="assessments"></nav-divider>
	<router-outlet></router-outlet>
    `
})
export class StudentsComponent extends AssessmentsDividerBaseComponent {

}
