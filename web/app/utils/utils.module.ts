import { NgModule } 			from '@angular/core';
import { CommonModule }			from '@angular/common';

import { BreadcrumbSelectorComponent } 	from './breadcrumb-selector.component';
import { CollapseDirective }		from './collapse.directive';

@NgModule({
    imports: [
	CommonModule
    ],
    declarations: [
	BreadcrumbSelectorComponent,
	CollapseDirective
    ],
    exports: [
	CommonModule,
	BreadcrumbSelectorComponent,
	CollapseDirective
    ]
})

export class UtilsModule {}
