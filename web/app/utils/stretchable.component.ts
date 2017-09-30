import { Component, HostListener, AfterContentChecked } from '@angular/core';

@Component({
    moduleId: module.id,
    template: ``
})
export class StretchableComponent implements AfterContentChecked {
    private stretchables: HTMLCollection;

    constructor() {
	this.stretchables = document.getElementsByClassName('stretchable');
    }
    
    ngAfterContentChecked() {
        this.stretchElements();
    }

@HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.stretchElements(/*true*/);
    }

    private stretchElements() {
	let contentElem = document.getElementById('content');
	let windowHeight = window.innerHeight;
        if (windowHeight == contentElem.offsetHeight) {
            return;
        }

	for (var i=0; i<this.stretchables.length; i++) {
	    let element = <HTMLElement>this.stretchables.item(i);
	    let elementPosition = window.getComputedStyle(element).position;
	    let newHeight = 0;

	    if (elementPosition === 'absolute' || elementPosition === 'fixed') {
		if (element.classList.contains('sidebar')) {
		    newHeight = windowHeight - element.getBoundingClientRect().top - parseInt(window.getComputedStyle(contentElem).paddingBottom);
		}
            }
	    else {
	    	element.style.height = windowHeight + 'px';
	    	newHeight = 2 * windowHeight - contentElem.offsetHeight;
	    }
	    element.style.height = newHeight + 'px';
	}
    }
}
