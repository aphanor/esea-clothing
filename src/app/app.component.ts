import { Component } from '@angular/core';
import { HttpService } from './http.service';
import { FormsModule, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Data } from './data'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	// Any variables e.g. JSON objects and arrays
	public results:any;

	// Checking user authentication
	public authenticated:boolean = false;

	// Normal strings definition	
	public cookie:string = "Session=";
	public email:string;
	public email_register:string;
	public error:string;
	public password:string;
	public password_register:string;

	// Numbers
	public step:number = 0;

	constructor(private httpRequest: HttpService, public storage:Data) {
	}

	init(arg) {
		this.setCookie(arg);
		this.authenticated = true;
	}

	setCookie(time) {
		var date = new Date();
		date.setTime(time);
		var expire = "; expires=" + date.toUTCString();

		document.cookie = this.cookie + 'LoggedIn' + expire + "; path/";
	}

	removeCookie() {
		document.cookie = this.cookie + "; expires= Thu, 01 Jan 1970 00:00:01 GMT";
	}

	signUp(email, pass) {
		this.httpRequest.signUp(email, pass).subscribe(data => {

			if(data.uid) {
				this.setStorage(data.stsTokenManager.accessToken,data.stsTokenManager.expirationTime)
				this.init(data.stsTokenManager.expirationTime);
			}

			if(this.results.errorMessage) {
				this.error = this.results.errorMessage;
			}
		})
	}

	setStorage(token, expiry) {

		this.storage.authtoken = token
		this.storage.expiry = expiry
	}

	login(a, b) {
		this.httpRequest.register(a,b).subscribe(data => {
			this.results = data;

			if(this.results.uid) {
				localStorage.setItem("authtoken",this.results.stsTokenManager.accessToken);
				localStorage.setItem("expiration",this.results.stsTokenManager.expirationTime);

				this.setStorage(this.results.stsTokenManager.accessToken,this.results.stsTokenManager.expirationTime)

				this.init(data.stsTokenManager.expirationTime);
			}

			if(this.results.errorMessage) {
				this.error = this.results.errorMessage;
			}
        },
        error => console.error('An error occured.'));
	}

	signOut() {
		this.removeCookie();
		this.authenticated = false;
		this.httpRequest.signOut().subscribe(data => {
			localStorage.removeItem("authtoken");
			localStorage.removeItem("expiration");
		});
	}

	setStep(index: number) {
		this.step = index;
	}

	nextStep() {
		this.step++;
	}

	prevStep() {
		this.step--;
	}

	ngOnInit() {
		// if(this.storage.authtoken == undefined && this.storage.expiry == undefined) {
		// 	this.authenticated = false;
		// 	this.removeCookie()
		// }

		if(document.cookie.indexOf('Session=') != -1) {
			this.authenticated = true;
		}
	}
}
