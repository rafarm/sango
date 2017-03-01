import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BreadcrumbSelectorSelect } from './model/breadcrumb-selector/breadcrumb-selector-select';
import { BreadcrumbSelectorEvent } from './model/breadcrumb-selector/breadcrumb-selector-event';

@Component({
    selector: 'breadcrumb-selector',
    templateUrl: 'app/breadcrumb-selector.component.html',
    styleUrls: [ 'app/breadcrumb-selector.component.css' ]
})
export class BreadcrumbSelectorComponent {
    @Input()
    selects: BreadcrumbSelectorSelect[] = null;

    @Output()
    breadcrumbSelectorChanged = new EventEmitter<BreadcrumbSelectorEvent>();
    
    selectChangeHandler(event: any) {
	this.breadcrumbSelectorChanged.emit(new BreadcrumbSelectorEvent(event.target.id, event.target.value));
    }
}
