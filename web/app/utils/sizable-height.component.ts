import { Component,
         HostListener,
         AfterViewChecked }                     from '@angular/core';

@Component({
    moduleId: module.id,
    template: ``
})
export class SizableHeightComponent implements AfterViewChecked {

    ngAfterViewChecked() {
        this.resizeSizableElement();
    }

@HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.resizeSizableElement();
    }

    private resizeSizableElement() {
	let measurable = document.getElementsByClassName('measurable');
	let sizable = document.getElementById('sizable');

	if (sizable != undefined) {
	    let newHeight = 0;
	    for (var i=0; i<measurable.length; i++) {
		newHeight += measurable[i].style.height;
	    }

	    sizable.style.height = Math.max(200, newHeight) + 'px';
        }
    }
}
