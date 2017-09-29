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
        let contentHeight = contentElem.offsetHeight;
        if (windowHeight == contentHeight) {
            return;
        }

	for (var i=0; i<this.stretchables.length; i++) {
	    let element = <HTMLElement>this.stretchables.item(i);
	    element.style.height = windowHeight + 'px';
	    let newHeight = 2 * windowHeight - contentElem.offsetHeight;
	    element.style.height = newHeight + 'px';
	}
    }

    /*
    private stretchElements(resizing: boolean = false) {
	let cElement = document.getElementById('content');
        let wH = window.innerHeight;
	let origCH = cElement.offsetHeight;
	if (wH == origCH) {
	    return;
	}
	
	let debug = {}
	debug['window'] = wH;

	// For every stretchable element compute its new height
        for (var i=0; i<this.stretchables.length; i++) {
		let cH = cElement.offsetHeight;
		if (cH > origCH && resizing) {
		    cH = origCH;
		}
                let el = <HTMLElement>this.stretchables.item(i);
		let element = {};
		element['content'] = cH;
		element['offset'] = el.offsetHeight
		let top = el.getBoundingClientRect().top;
		element['top'] = top;
		let newH = el.offsetHeight + wH - cH;
		element['newHeight'] = newH;
                el.style.height = newH + 'px';
		debug['element'+i] = element;
        }
	//console.log(debug);
    }
    */
}
