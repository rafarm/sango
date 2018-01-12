import { Component }				from '@angular/core';

import {AssessmentsDividerBaseComponent }	from '../assessments-divider-base.component';

@Component({
    template: `
	<nav-divider [items]="assessments"></nav-divider>
	<router-outlet></router-outlet>
    `
})
export class GradesComponent extends AssessmentsDividerBaseComponent {

}
