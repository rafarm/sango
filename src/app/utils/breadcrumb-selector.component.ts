import { Component, EventEmitter, Input, Output } from '@angular/core';

export class BreadcrumbSelectorItem {
    constructor(
	public label: string,
	public value: any,
	public isGroup: boolean
    ){}
}

export class BreadcrumbSelectorSelect {
    constructor(
	public id: string,
	public items: BreadcrumbSelectorItem[],
	public selectedValue: any
    ){}
}

export class BreadcrumbSelectorEvent {
    constructor(
	public select_id: string,
	public select_value: any
    ){}
}

@Component({
    selector: 'breadcrumb-selector',
    templateUrl: './breadcrumb-selector.component.html',
    styleUrls: ['./breadcrumb-selector.component.css']
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
