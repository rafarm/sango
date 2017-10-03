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
    hasSidebar: boolean = false;
    @Input()
    items: Observable<NavItem[]>;

    getClasses(): any {
        let classes = {};

        classes['navbar-toggler'] = true;
        classes['navbar-toggler-hidden'] = !this.hasSidebar;

        return classes;
    }
}
