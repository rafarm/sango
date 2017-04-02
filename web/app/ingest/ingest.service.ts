import { Injectable } 		from '@angular/core';
import { Observable } 		from 'rxjs/Observable';
import { Observer } 		from 'rxjs/Observer';

import { BackendService, CallData } 	from './backend.service';
 
@Injectable()
export class IngestService {

    constructor(private backendService: BackendService) {};

    /*
     * ingestFile
     *
     * Uploads and processes a data file in backend service.
     */
    ingestFile(file: File): Observable<string> {
	let request = new Observable((observer: Observer<string>) => {
	    this.backendService.uploadFile(file)
		.subscribe(
		    (value: CallData) => {
			if (value.state == 4) {
			    if (value.status == 200) {
				this.backendService.processFile(value.data)
				    .subscribe(
					(value: string) => observer.next(value),
					(error: string) => observer.error(value),
					() => observer.complete();
				    );
			    }
			    else {
				observer.error(value.data);
			    }
			}
			else {
			    observer.next(value.data);
    			}
		    }
		);
	});

	return request;
    }

    /*
     * uploadFile
     *
     * Uploads a file to server.
     */
    /*
    uploadFile(file: File): Observable<any> {
        let request = new Observable((observer: Observer<any>) => {
            let formData = new FormData();
            let xhr = new XMLHttpRequest();

            formData.append('upload', file, file.name);

            xhr.upload.onprogress = (event: ProgressEvent) => {
                if (event.lengthComputable) {
                    let completed = event.loaded / event.total * 100;
                    observer.next(completed);
                }
                else {
                    observer.next("Uploading...");
                }
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let name = xhr.response; // Uploaded file name on server returned.

                        let evtSource = new EventSource(this.apiUrl+'ingest/'+name);
                        
                        evtSource.onmessage = (e: any) => {
                                observer.next(e.data);
                        }

                        evtSource.addEventListener("end", (e: any) => {
                            observer.complete();
                            evtSource.close();
                        }, false);

                        evtSource.addEventListener("error", (e: any) => {
                            observer.error(e.data);
                            evtSource.close();
                        }, false);
                    }
                    else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.open('POST', this.apiUrl+'ingest', true);
            xhr.send(formData);
        });

        return request;
    }
    */
}

