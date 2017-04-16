import { NgModule } 			from '@angular/core';
import { CommonModule }			from '@angular/common';
import { RouterModule } 		from '@angular/router';

import { BreadcrumbSelectorComponent } 	from './breadcrumb-selector.component';
import {NavDividerComponent }		from './nav-divider.component';
import { CollapseDirective }		from './collapse.directive';

@NgModule({
    imports: [
	CommonModule,
	RouterModule
    ],
    declarations: [
	BreadcrumbSelectorComponent,
	NavDividerComponent,
	CollapseDirective
    ],
    exports: [
	CommonModule,
	BreadcrumbSelectorComponent,
	NavDividerComponent,
	CollapseDirective
    ]
})

export class UtilsModule {}
