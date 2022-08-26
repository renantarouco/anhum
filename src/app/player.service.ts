import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/operator/take';
import 'rxjs/operator/map';

import { AppState } from './model/app-state.model';

export interface InitialResponse {
    index: number
    token: string
    state: AppState
}

export type Message = InitialResponse & { instrument: string };

@Injectable()
export class PlayerService {
    constructor(
        private httpClient: Http
    ) { }

    get initialState(): Observable<InitialResponse> {
        return this.httpClient.get("https://go-getting-started.lemonsea-cc6713b3.brazilsouth.azurecontainerapps.io/initial")
            .take(1)
            .map(res => res.json())
            .map(res => res as InitialResponse);
    }
}