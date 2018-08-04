import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class BaseApi {

  private baseUrl = 'http://usque.ru:3000';

  constructor(public http: HttpClient) {

  }

  private getUrl(url: string = ''): string {
    return this.baseUrl + '/' + url;
  }

  public getAll(url: string = ''): Observable<any> {
    return this.http.get<any>(this.getUrl(url));
  }

  public getArray(url: string = ''): Observable<any> {
    return this.getAll(url);
  }

  public get(url: string = ''): Observable<any> {
    const all = this.getAll(url);
    return all[0] ? all[0] : all;
  }

  public post(url: string = '', data: any = {}): Observable<any> {
    const some = this.http.post<any>(this.getUrl(url), data);
    return some[0] ? some[0] : some;
  }

  public put(url: string = '', data: any = {}): Observable<any> {
    const some = this.http.put(this.getUrl(url), data);
    return some[0] ? some[0] : some;
  }
}
