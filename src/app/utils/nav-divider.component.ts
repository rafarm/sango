import { Component, Input, Output, EventEmitter } 	from '@angular/core';
import { Observable }					from 'rxjs/Observable';

export class NavItem {
    constructor(
	public _id: string,
	public name: string
    ) {}
}

@Component({
    selector: 'nav-divider', 
    templateUrl: './nav-divider.component.html',
    styleUrls: ['./nav-divider.component.scss']
})
export class NavDividerComponent {
    @Input()
    icon: string;
    @Input()
    items: Observable<NavItem[]>;

    @Output()
    iconClick = new EventEmitter<NavDividerComponent>();

    onIconClick() {
	this.iconClick.emit(this);
    }
}
