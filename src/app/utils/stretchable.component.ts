import { Component, HostListener, AfterContentChecked } from '@angular/core';

@Component({
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
        this.stretchElements();
    }

    private stretchElements() {
	let contentElem = document.getElementById('content');
	let containerHeight = document.getElementById('container').offsetHeight;
	if (containerHeight == contentElem.offsetHeight) {
	    return;
        }

	for (var i=0; i<this.stretchables.length; i++) {
	    let element = <HTMLElement>this.stretchables.item(i);
	    let elementPosition = window.getComputedStyle(element).position;
	    let newHeight = 0;

	    if (elementPosition === 'absolute' || elementPosition === 'fixed') {
		if (element.classList.contains('sidebar')) {
		    newHeight = containerHeight - element.getBoundingClientRect().top - parseInt(window.getComputedStyle(contentElem).paddingBottom);
		}
            }
	    else {
		element.style.height = containerHeight + 'px';
		newHeight = 2 * containerHeight - contentElem.offsetHeight;
	    }
	    element.style.height = newHeight + 'px';
	}
    }
}
