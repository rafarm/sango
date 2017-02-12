import { Component } from '@angular/core';

import { DataService } from './data.service';


@Component({
	selector: 'ingest',
	templateUrl: 'app/ingest.component.html'
})
export class IngestComponent {
    IngestState = {
	SELECT  : 'select',
	UPLOAD  : 'upload',
	PROCESS : 'process'
    }

    private state = this.IngestState.SELECT;
    private fileToUpload: File;
    private response: any;
    private progress_msg: string;

    constructor(private dataService: DataService) {}

    fileChangeEvent(event: any) {
	this.fileToUpload = event.target.files[0];
    }

    upload() {
	this.state = this.IngestState.UPLOAD;
	this.progress_msg = '0%';
	
	this.dataService.uploadFile(this.fileToUpload)
	    .subscribe(
		value => this.process_progress(value),
		error => this.process_error(error),
		() => this.process_finished()
	);
	
	/*
	this.dataService.uploadFile(this.fileToUpload)
	    .then(response => this.response = response);
	*/
    }

    process_progress(value: any) {
	this.progress_msg = Math.floor(value) + '%';
	console.log("Upload completed: " + this.progress_msg);
    }

    process_error(error: any) {
	// ToDo:
    }

    process_finished() {
	// ToDo:
    }
}
