import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServiciosEndpointService {
  private host:string='http://localhost:3001/api/v1/'
  constructor(private http: HttpClient) { }

  getData(url:string|any){
    return this.http.get(this.host+url);
  }

  saveData(url:string|any,body:object|any){
  	return this.http.post(this.host+url, body);
  }

  updateData(url:string|any,body:object|any){
  	return this.http.put(this.host+url, body);
  }

  removeData(url:string|any){
    return this.http.delete(this.host+url);
  }
}
