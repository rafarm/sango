import { Component, HostListener, AfterContentChecked } from '@angular/core';

@Component({
    moduleId: module.id,
    template: ``
})
export class ResizableHeightComponent /*implements AfterViewChecked*/ {
    private measurables: HTMLCollection;
    private resizables: HTMLCollection;

    constructor() {
	this.measurables = document.getElementsByClassName('measurable');
	this.resizables = document.getElementsByClassName('resizable');
    }

    ngAfterContentChecked() {
	this.resizeElements();
    }

@HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.resizeElements();
    }

    resizeElements() {
	if (this.resizables.length > 0) {
	    let mHeight: number = 0;
	    for (var i=0; i<this.measurables.length; i++) {
		let el = <HTMLElement>this.measurables.item(i);
		mHeight += el.offsetHeight * 1;
	    }
	    let newHeight = window.innerHeight - mHeight;
	    
	    for (var i=0; i<this.resizables.length; i++) {
		let el = <HTMLElement>this.resizables.item(i);
		el.style.height = newHeight + 'px';
	    }
	    /*
	    let values = {};
	    values['measurables'] = this.measurables.length;
	    values['resizables'] = this.resizables.length;
	    values['newHeight'] = newHeight;
	    console.log(values);
	    */
        }
    }
}
