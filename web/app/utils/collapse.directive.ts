import { Directive, Input, ElementRef } from '@angular/core';

const ClassName = {
    SHOW       : 'show',
    COLLAPSE   : 'collapse',
    COLLAPSING : 'collapsing',
    COLLAPSED  : 'collapsed'
}

const Orientation = {
    VERTICAL	: 'vertical',
    HORIZONTAL 	: 'horizontal'
}

@Directive({
    selector: '[sgCollapse]'
})
export class CollapseDirective {
    @Input()
    orientation: string = Orientation.VERTICAL;
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
	    /*
	    this.target.addEventListener('click', () => {
		if (this.target.classList.contains(ClassName.SHOW)) {
                    this.hide();
                }
	    });
	    */
	}
    }

    show() {
        if (this.isTransitioning) {
	    return;
	}
	
	let classList = this.target.classList;

	classList.remove(ClassName.COLLAPSE);
	classList.add(ClassName.COLLAPSING);

	let isVertical = this.orientation == Orientation.VERTICAL;
	let dimension = isVertical ? 'height' : 'left';
	let dimInitValue = isVertical ? 0 : -this.target.offsetWidth;

	this.target.style[dimension] = dimInitValue + 'px';
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

	    //this.target.style[dimension] = isVertical ? '' : 0 + 'px';
	    this.target.style[dimension] = '';
	    this.target.removeEventListener("transitionend", complete, true);
	    this.isTransitioning = false;
	}

	this.target.addEventListener("transitionend", complete, true);
	
	if (isVertical) {
	    let capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
	    let scrollSize = 'scroll' + capitalizedDimension;
	
	    this.target.style[dimension] = this.target[scrollSize] + 'px';
	}
	else {
	    this.target.style[dimension] = 0 + 'px';
	}
    }

    hide() {
	if (this.isTransitioning) {
            return;
        }
	
	let classList = this.target.classList;

	let isVertical = this.orientation == Orientation.VERTICAL;

        let dimension = isVertical ? 'height' : 'left';
	//let offsetDimension = 'offsetHeight';
	let dimInitValue = isVertical ? this.target.offsetHeight : this.target.getBoundingClientRect().left;

	this.target.style[dimension] = dimInitValue + 'px';
	isVertical ? this.target.offsetHeight : this.target.getBoundingClientRect().left;

	classList.add(ClassName.COLLAPSING);
        classList.remove(ClassName.COLLAPSE);
        classList.remove(ClassName.SHOW);

	this.target.setAttribute('aria-expanded', false);

	if (this.trigger) {
	    this.trigger.classList.add(ClassName.COLLAPSED);
            this.trigger.setAttribute('aria-expanded', false);
	}

	//this.target.style[dimension] = this.target[this.offsetDimension] + 'px';

	this.isTransitioning = true;
        
	let complete = () => {
	    this.isTransitioning = false;

            classList.remove(ClassName.COLLAPSING);
            classList.add(ClassName.COLLAPSE);

	    this.target.removeEventListener("transitionend", complete, true);
        }

	this.target.addEventListener("transitionend", complete, true);
        
	//this.target.style[dimension] = isVertical ? '' : -this.target.offsetWidth + 'px';
	this.target.style[dimension] = '';
    }
}

