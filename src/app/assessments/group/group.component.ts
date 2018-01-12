import { Component }				from '@angular/core';

import { AssessmentsDividerBaseComponent } 	from '../assessments-divider-base.component';

@Component({
    moduleId: module.id,
    template: `
	<nav-divider [items]="assessments"></nav-divider>
	<router-outlet></router-outlet>
    `
})
export class GroupComponent extends AssessmentsDividerBaseComponent {

}
