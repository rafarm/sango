import { AfterViewInit, Component } from '@angular/core';

import { DataService } from './data.service';


@Component({
	selector: 'ingest',
	templateUrl: 'app/ingest.component.html'
})
export class IngestComponent implements AfterViewInit {
    IngestState = {
	SELECT  : 'select',
	UPLOAD  : 'upload',
	PROCESS : 'process'
    }

    private state = this.IngestState.SELECT;
    private fileToUpload: File;
    private response: any;
    private progress_value: number;
    private progress_msg: string;
    private progress_bar: any = null;
    private alert_title: string;
    private alert_msg: string;
    private alert_show = false;

    constructor(private dataService: DataService) {}

    ngAfterViewInit() {
	this.progress_bar = document.querySelector(".progress-bar");
    }

    fileChangeEvent(event: any) {
	this.fileToUpload = event.target.files[0];
    }

    upload() {
	this.state = this.IngestState.UPLOAD;
	this.progress_value = 0;
	this.progress_msg = '0%';

	this.alert_show = false;
	
	this.dataService.uploadFile(this.fileToUpload)
	    .subscribe(
		value => this.process_progress(value),
		error => this.process_error(error),
		() => this.process_finished()
	);
    }

    process_progress(value: any) {
	this.progress_value = Math.floor(value);
	this.progress_msg = this.progress_value + '%';

	this.progress_bar.style.width = this.progress_msg;
	this.progress_bar.innerHTML = this.progress_msg;
	this.progress_bar.setAttribute('aria-valuenow', this.progress_value);
    }

    process_error(error: any) {
	this.alert_title = "Error!";
	this.alert_msg = error;
	this.alert_show = true;
    }

    process_finished() {
	// ToDo:
    }
}
