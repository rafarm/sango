import { NgModule } 			from '@angular/core';
import { CommonModule }			from '@angular/common';
import { RouterModule } 		from '@angular/router';

import { CustomMaterialModule }         from '../custom-material/custom-material.module';

import { ComposedSelectorComponent } 	from './composed-selector.component';
import { NavDividerComponent }		from './nav-divider.component';
import { StretchableComponent }		from './stretchable.component';
import { GoogleChartDirective }		from './google-chart.directive';

@NgModule({
    imports: [
	CommonModule,
	RouterModule,
	CustomMaterialModule
    ],
    declarations: [
	ComposedSelectorComponent,
	NavDividerComponent,
	StretchableComponent,
	GoogleChartDirective
    ],
    exports: [
	CommonModule,
	ComposedSelectorComponent,
	NavDividerComponent,
	StretchableComponent,
	GoogleChartDirective
    ]
})

export class UtilsModule {}
