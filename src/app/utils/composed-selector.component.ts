import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatSelectChange } from '@angular/material/select';

export class ComposedSelectorItem {
    constructor(
	public label: string,
	public value: any
    ){}
}

export class ComposedSelectorSelect {
    constructor(
	public id: string,
	public placeholder: string,
	public items: ComposedSelectorItem[],
	public grouped: boolean,
	public selectedValue: any
    ){}
}

export class ComposedSelectorEvent {
    constructor(
	public select_id: string,
	public select_value: any
    ){}
}

@Component({
    selector: 'composed-selector',
    templateUrl: './composed-selector.component.html',
    styleUrls: ['./composed-selector.component.css']
})
export class ComposedSelectorComponent {
    @Input()
    selects: ComposedSelectorSelect[] = null;

    @Output()
    composedSelectorChanged = new EventEmitter<ComposedSelectorEvent>();
    
    selectChangeHandler(change: MatSelectChange) {
	this.composedSelectorChanged.emit(new ComposedSelectorEvent(change.source.id, change.source.value));
    }
}
