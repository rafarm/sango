import { Injectable } 		from '@angular/core';
import { Observable } 		from 'rxjs/Observable';
import { Observer } 		from 'rxjs/Observer';

import { ConfigService }	from './config/config.service';

declare var EventSource: any;

export class CallData {
    constructor(
	state: number,
	status: number,
	data: string
    );
}

@Injectable()
export class BackendService {
    private backendUrl: string;

    constructor(private configService: ConfigService) {
	this.backendUrl = configService.getBackendUrl();
    }

    /*
     * uploadFile
     *
     * Uploads a file to server.
     */
    uploadFile(file: File): Observable<CallData> {
        let request = new Observable((observer: Observer<CallData>) => {
            let formData = new FormData();
            let xhr = new XMLHttpRequest();

            formData.append('upload', file, file.name);

            xhr.upload.onprogress = (event: ProgressEvent) => {
		let msg = 'Uploading...';
                if (event.lengthComputable) {
                    let completed = event.loaded / event.total * 100;
		    msg = ""+completed;
                }

                observer.next(new CallData(xhr.readyStatge, xhr.status, msg));
            };

            xhr.onreadystatechange = () => {
		observer.next(new CallData(xhr.readyStatge, xhr.status, xhr.response));
		if (xhr.readyState == 4) {
		    observer.complete();
		}
            };

            xhr.open('POST', this.backendUrl+'ingest', true);
            xhr.send(formData);
        });

        return request;
    }

    /*
     * processFile
     *
     * Process data file previously uploaded.
     */
    processFile(name: string): Observable<string> {
	let request = new Observable((observer: Observer<string>) => {
	    let evtSource = new EventSource(this.backendUrl+'ingest/'+name);

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
        });

        return request;
    }
}

