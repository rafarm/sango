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

    stretchElements() {
        let wHeight = window.innerHeight;
        let cHeight = document.getElementById('content').offsetHeight;

        for (var i=0; i<this.stretchables.length; i++) {
                let el = <HTMLElement>this.stretchables.item(i);
                el.style.height = (el.offsetHeight + (wHeight - cHeight)) + 'px';
        }
    }
}
