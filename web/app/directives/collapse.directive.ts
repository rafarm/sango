import { Directive, ElementRef } from '@angular/core';

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
    trigger: any = null;
    target: any = null;
    isTransitioning: boolean = false;

    constructor( el: ElementRef ) {
	this.target = el.nativeElement;
	this.trigger = document.querySelector('[data-target="#' + this.target.id + '"]');

	let isOpen = this.target.classList.contains(ClassName.SHOW);
	this.target.setAttribute('aria-expanded', isOpen);

	if (this.trigger) {
	    
	    let toggle = () => {
		if (this.target.classList.contains(ClassName.SHOW)) {
		    this.hide();
		}
		else {
		    this.show();
		}
	    }
	    
	    this.trigger.addEventListener('click', toggle);
	    
	    if (isOpen) {
		this.trigger.classList.remove(ClassName.COLLAPSED);
	    }
	    else {
		this.trigger.classList.add(ClassName.COLLAPSED);
	    }

	    this.trigger.setAttribute('aria-expanded', isOpen);
	}
    }

    show() {
        if (this.isTransitioning) {
	    return;
	}

	let classList = this.target.classList;

	classList.remove(ClassName.COLLAPSE);
	classList.add(ClassName.COLLAPSING);

	let dimension = 'height';

	this.target.style[dimension] = 0;
	this.target.setAttribute('aria-expanded', true);

	if (this.trigger) {
	    this.trigger.classList.remove(ClassName.COLLAPSED);
            this.trigger.setAttribute('aria-expanded', true);
	}

	this.isTransitioning = true;

	let complete = () => {
	    classList.remove(ClassName.COLLAPSING);
	    classList.add(ClassName.COLLAPSE);
	    classList.add(ClassName.SHOW);

	    this.target.style[dimension] = '';
	    this.target.removeEventListener("transitionend", complete, true);
	    this.isTransitioning = false;
	}

	this.target.addEventListener("transitionend", complete, true);

	let capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
	let scrollSize = 'scroll' + capitalizedDimension;
	
	this.target.style[dimension] = this.target[scrollSize] + 'px';
    }

    hide() {
	if (this.isTransitioning) {
            return;
        }
	
	let classList = this.target.classList;

	let dimension = 'height';
	let offsetDimension = 'offsetHeight';

	this.target.style[dimension] = this.target[offsetDimension] + 'px';
	this.target.offsetHeight;

	classList.add(ClassName.COLLAPSING);
        classList.remove(ClassName.COLLAPSE);
        classList.remove(ClassName.SHOW);

	this.target.setAttribute('aria-expanded', false);

	if (this.trigger) {
	    this.trigger.classList.add(ClassName.COLLAPSED);
            this.trigger.setAttribute('aria-expanded', false);
	}

	this.target.style[dimension] = this.target[offsetDimension] + 'px';

	this.isTransitioning = true;
        
	let complete = () => {
	    this.isTransitioning = false;

            classList.remove(ClassName.COLLAPSING);
            classList.add(ClassName.COLLAPSE);

	    this.target.removeEventListener("transitionend", complete, true);
        }

	this.target.addEventListener("transitionend", complete, true);
        
	this.target.style[dimension] = '';
    }
}

