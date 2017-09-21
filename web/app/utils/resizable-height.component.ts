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
	    let mHeight: number = 0;
	    for (var i=0; i<measurables.length; i++) {
		let el = <HTMLElement>measurables.item(i);
		mHeight += el.offsetHeight*1;
	    }
	    let newHeight = window.innerHeight - mHeight;

	    resizable.style.height = Math.max(400, newHeight) + 'px';
        }
    }
}
