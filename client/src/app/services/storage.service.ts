/** Angular imports */
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor() { }

    set(key: string, value: string) {
       return localStorage.setItem(key, value);
    }

    get(key: string) {
        return localStorage.getItem(key);
    }

    remove(key)
    {
        return localStorage.removeItem(key)
    }
}