import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class HttpRequestService  {
  private authorizationToken: string = '-'
  constructor (
    private http: HttpClient,
    private auth:AuthService
  ) {
    this.setAuthorizationTokenValue();
  }

  protected setAuthorizationTokenValue() : void {
    this.authorizationToken = 'Bearer ' + this.auth.getToken();

  }

  protected getOptions(options: any = {}) : any {
    this.setAuthorizationTokenValue();

    let requestHeaders: HttpHeaders;
    var allowHeaders = '*';
    var contentType = 'application/json';
    if(options.headers && (options.headers instanceof HttpHeaders)) {
      requestHeaders = (options.headers as HttpHeaders);
      requestHeaders.append('Access-Control-Allow-Headers', allowHeaders);
      requestHeaders.append('Access-Control-Allow-Origin', allowHeaders);
      requestHeaders.append('Content-Type', contentType);
      requestHeaders.append('Accept', contentType);
      requestHeaders.append('Authorization', this.authorizationToken);
    }
    else {
      requestHeaders = new HttpHeaders({
        'Access-Control-Allow-Headers': allowHeaders,
        'Access-Control-Allow-Origin': allowHeaders,
        'Content-Type': contentType,
        'Accept': contentType,
        'Authorization' : this.authorizationToken
      })
    }
    if(!options.observe) {
      options.observe = 'body'
    }
    options.headers = requestHeaders;
    return options;
  }

  public post<T> (
    url: string,
    body: any,
    options: any = {}
  ) : Observable<any> {
    return this.http.post<T>(url, body, this.getOptions(options));
  }

  public get<T> (
    url: string,
    options: any = {}
  ) : Observable<any> {
    return this.http.get<T>(url, this.getOptions(options));
  }

  public put<T> (
    url: string,
    body: any,
    options: any = {}
  )  : Observable<any> {
    return this.http.put<T>(url, body, this.getOptions(options));
  }

  public delete<T> (
    url: string,
    options: any = {}
  )  : Observable<any> {
    return this.http.delete<T>(url, this.getOptions(options));
  }

  public patch<T> (
    url: string,
    body: any,
    options: any = {}
  )  : Observable<any> {
    return this.http.patch<T>(url, body, this.getOptions(options));
  }

  public head<T> (
    url: string,
    options: any = {}
  )  : Observable<any> {
    return this.http.head<T>(url, this.getOptions(options));
  }

  public options<T> (
    url: string,
    options: any = {}
  )  : Observable<any> {
    return this.http.options<T>(url, this.getOptions(options));
  }

}
