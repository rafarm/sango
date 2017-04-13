import { Component, Input } 	from '@angular/core';
import { Observable }		from 'rxjs/Observable';

import { Assessment } 		from '../model/assessment';

@Component({
    moduleId: module.id,
    templateUrl: './assessments-divider.component.html',
})
export class AssessmentsDividerComponent {
    @Input()
    assessments: Observable<Assessment[]>;
}
