import { Component,
         HostListener,
         AfterViewChecked }                     from '@angular/core';

@Component({
    moduleId: module.id,
    template: ``
})
export class ResizableHeightComponent implements AfterViewChecked {

    ngAfterViewChecked() {
        this.resizeElement();
    }

@HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.resizeElement();
    }

    private resizeElement() {
	let measurables = document.getElementsByClassName('measurable');
	let resizable = document.getElementById('resizable');

	if (resizable != undefined) {
	    let newHeight = 0;
	    for (var i=0; i<measurables.length; i++) {
		newHeight += measurables.item(i)['style'].height;
	    }

	    resizable.style.height = Math.max(200, newHeight) + 'px';
        }
    }
}
