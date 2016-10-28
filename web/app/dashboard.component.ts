import { Component } from '@angular/core';

import { DataService } from './data.service';

@Component({
	selector: 'dashboard',
	templateUrl: 'app/dashboard.component.html'
})
export class DashboardComponent {
    private fileToUpload: File;
    private response: any;
    private uploading: boolean;
    private button_text: string;

    constructor(private dataService: DataService) {
        this.uploading = false;
	this.button_text = 'Upload';
    }

    fileChangeEvent(event: any) {
	this.fileToUpload = event.target.files[0];
    }

    upload() {
	this.uploading = true;
	this.button_text = 'Uploading...';
	this.dataService.uploadFile(this.fileToUpload)
	    .then(response => this.response = response);
    }
}
