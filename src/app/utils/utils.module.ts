import { NgModule } 			from '@angular/core';
import { CommonModule }			from '@angular/common';
import { RouterModule } 		from '@angular/router';

import { BreadcrumbSelectorComponent } 	from './breadcrumb-selector.component';
import { NavDividerComponent }		from './nav-divider.component';
import { StretchableComponent }		from './stretchable.component';
import { CollapseDirective }		from './collapse.directive';
import { GoogleChartDirective }		from './google-chart.directive';

@NgModule({
    imports: [
	CommonModule,
	RouterModule
    ],
    declarations: [
	BreadcrumbSelectorComponent,
	NavDividerComponent,
	StretchableComponent,
	CollapseDirective,
	GoogleChartDirective
    ],
    exports: [
	CommonModule,
	BreadcrumbSelectorComponent,
	StretchableComponent,
	NavDividerComponent,
	CollapseDirective,
	GoogleChartDirective
    ]
})

export class UtilsModule {}
