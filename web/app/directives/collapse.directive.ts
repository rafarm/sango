import { Directive, /*ElementRef, */HostListener, Input } from '@angular/core';


const ClassName = {
    SHOW       : 'show',
    COLLAPSE   : 'collapse',
    COLLAPSING : 'collapsing',
    COLLAPSED  : 'collapsed'
}

@Directive({
    selector: '[sgCollapse]'
})
export class CollapseDirective {
    @Input('sgCollapse') targetId: string;

    //constructor( el: ElementRef ) {}

    @HostListener('click') onClick() {
	let target = document.getElementById(this.targetId);
	
	if (target) {
	    if (target.classList.contains(ClassName.SHOW)) {
		this.hide(target);
	    }
	    else {
		this.show(target);
	    }
	}
    }

    show(target: any) {
	let classList = target.classList;

	classList.remove(ClassName.COLLAPSE);
	classList.add(ClassName.COLLAPSING);

	let dimension = 'height';

	target.style[dimension] = 0;

	let complete = () => {
	    classList.remove(ClassName.COLLAPSING);
	    classList.add(ClassName.COLLAPSE);
	    classList.add(ClassName.SHOW);

	    target.style[dimension] = '';
	}

	target.addEventListener("transitionend", complete, true);

	let capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
	let scrollSize = 'scroll' + capitalizedDimension;
	console.log(scrollSize);
	target.style[dimension] = /*target.style[scrollSize] +*/ '80px';
	console.log(target.style[scrollSize] + 'px');
    }

    hide(target: any) {
	target.classList.remove("show");
    }
}

