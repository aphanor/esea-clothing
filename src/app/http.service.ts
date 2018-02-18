import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class HttpService {

	constructor(private http: Http) { }

	register(a,b) {
		var headers = new Headers();
        headers.append("Content-Type", 'application/json');

		return this.http.post('/login?email='+ a + '&password=' + b , {
			headers: headers
		}).map(resp => resp.json());
	}

	signUp(x,y) {
		var headers = new Headers();
        headers.append("Content-Type", 'application/json');

        var body = JSON.stringify({'email': x, 'password': y});

        return this.http.post('/create', body, {
        	headers: headers
        }).map(resp => resp.json());
	}

	signOut() {
		return this.http.get('/signout').map(resp => resp.json());
	}

}
