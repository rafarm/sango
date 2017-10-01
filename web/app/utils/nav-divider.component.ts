import { Component, Input } 	from '@angular/core';
import { Observable }		from 'rxjs/Observable';

export class NavItem {
    constructor(
	public _id: string,
	public name: string
    ) {}
}

@Component({
    moduleId: module.id,
    selector: 'nav-divider', 
    templateUrl: './nav-divider.component.html'
})
export class NavDividerComponent {
    @Input()
    items: Observable<NavItem[]>;
    @Input()
    togglerId: string;
    @Input()
    toggleLabel: string;
}
