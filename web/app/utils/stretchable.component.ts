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
        this.stretchElements();
    }

    private stretchElements() {
	let debug = {}
        let wH = window.innerHeight;
        let cH = document.getElementById('content').offsetHeight;
	debug['window'] = wH;
	debug['content'] = cH;

        for (var i=0; i<this.stretchables.length; i++) {
                let el = <HTMLElement>this.stretchables.item(i);
		debug['element'] = el.offsetHeight
		let top = el.getBoundingClientRect().top;
		//let newH = el.offsetHeight + wH - cH;
		let newH = wH - top;
		debug['newHeight'] = newH;
                el.style.height = newH + 'px';
		console.log(debug);
        }
    }
}
