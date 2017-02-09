import { Component } from '@angular/core';

//import { DataService } from './data.service';

@Component({
	selector: 'ingest',
	templateUrl: 'app/ingest.component.html'
})
export class IngestComponent {
    private fileToUpload: File;
    private response: any;
    private uploading: boolean;
    private button_text: string;

    constructor(/*private dataService: DataServicei*/) {
        this.uploading = false;
	this.button_text = 'Upload';
    }

    fileChangeEvent(event: any) {
	this.fileToUpload = event.target.files[0];
    }

    upload() {
	/*
	this.uploading = true;
	this.button_text = 'Uploading...';
	this.dataService.uploadFile(this.fileToUpload)
	    .then(response => this.response = response);
	*/
    }
}
