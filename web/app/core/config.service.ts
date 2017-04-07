import { Injectable } from '@angular/core';

/*
 * Configuration service.
 *
 * Put your custom configuration here.
 */
@Injectable()
export class ConfigService {

    // Change this value...
    private _backendUrl = 'http://localhost:3000/api/';
    get backendUrl(): string {
	return this._backendUrl;
    }

}
