import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[sgCollapse]'
})
export class CollapseDirective {
    @Input() collapsed = true;
    @Input() targetId: string;

    constructor( el: ElementRef ) {}

    @HostListener('click') onClick() {
	let target = document.getElementById(this.targetId);

	if (target) {
	    this.collapsed = !this.collapsed;

	    if (this.collapsed) {
		target.classList.remove("show");
	    }
	    else {
		target.classList.add("show");
	    }
	}
    }
}

