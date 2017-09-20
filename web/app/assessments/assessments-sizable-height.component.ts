import { Component,
         HostListener,
         AfterViewChecked }                     from '@angular/core';

@Component({
    moduleId: module.id,
    template: ``
})
export class AssessmentsSizableHeightComponent implements AfterViewChecked {
    private offset: number;

    constructor(_offset: number = 0) {
	this.offset = _offset;
    }

    ngAfterViewChecked() {
        this.resizeSizableElement();
    }

@HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.resizeSizableElement();
    }

    private resizeSizableElement() {
        let newHeight = Math.max(200, document.defaultView.innerHeight - (200 + this.offset));
        let tb = document.getElementById('sizable-height');

        if (tb != undefined) {
            tb.style.height= newHeight+'px';
        }
    }

}
