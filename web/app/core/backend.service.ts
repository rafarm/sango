import { Injectable } 		from '@angular/core';
import { Observable } 		from 'rxjs/Observable';
import { Observer } 		from 'rxjs/Observer';

import { ConfigService }	from './config.service';

declare var EventSource: any;

export class CallData {
    constructor(
	public state: number,
	public status: number,
	public data: string
    ) {};
}

@Injectable()
export class BackendService {
    private backendUrl: string;

    constructor(private configService: ConfigService) {
	this.backendUrl = configService.backendUrl;
    }

    /*
     * uploadFile
     *
     * Uploads a file to server.
     */
    uploadFile(file: File): Observable<CallData> {
        let request = Observable.create((observer: Observer<CallData>) => {
            let formData = new FormData();
            let xhr = new XMLHttpRequest();

            formData.append('upload', file, file.name);

            xhr.upload.onprogress = (event: ProgressEvent) => {
		let msg = 'Uploading...';
                if (event.lengthComputable) {
                    let completed = event.loaded / event.total * 100;
		    msg = ""+completed;
                }

                observer.next(new CallData(xhr.readyState, xhr.status, msg));
            };

            xhr.onreadystatechange = () => {
		observer.next(new CallData(xhr.readyState, xhr.status, xhr.response));
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
	let request = Observable.create((observer: Observer<string>) => {
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

