/*
 Copyright (c) 2023, Xgrid Inc, http://xgrid.co

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
/** Angular imports */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {
  constructor(
    // Angular Modules
    private http: HttpClient,
  ) {}

  /**
   * HTTP GET request
   * @param url 
   * @param options 
   * @returns Observable
   */
  public get(url: string, options?: any) {
    return this.http.get(url, options);
  }

  /**
   * HTTP POST request
   * @param url 
   * @param data 
   * @param options 
   * @returns Observable
   */
  public post(url: string, data: any, options?: any) {
    return this.http.post(url, data, options);
  }

/**
 * HTTP PUT request
 * @param url 
 * @param data 
 * @param options 
 * @returns Observable
 */
  public put(url: string, data: any, options?: any) {
    return this.http.put(url, data, options);
  }

  /**
   * HTTP DELETE request
   * @param url 
   * @param options 
   * @returns Observable
   */
  public delete(url: string, options?: any) {
    return this.http.delete(url, options);
  }
}
