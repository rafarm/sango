import { NgModule } 			from '@angular/core';
import { FormsModule }                  from '@angular/forms';

import { UtilsModule }			from '../../utils/utils.module';

import { GradesRoutingModule }		from './grades-routing.module';

import { GradesComponent }		from './grades.component';
import { GradesTableComponent }		from './grades-table.component';

@NgModule({
    imports: [
	FormsModule,
	UtilsModule,
	GradesRoutingModule
    ],
    declarations: [
	GradesComponent,
	GradesTableComponent
    ]
})

export class GradesModule {}
