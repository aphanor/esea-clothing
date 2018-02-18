require('dotenv').config()
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	firebase = require('firebase'),
	browser = require('opn'),
	path = require('path');

var PORT = 8080;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist/'));

app.all('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/dist/', '/index.html'));
});

var config = {
	apiKey: process.env.APIKEY,
	authDomain: process.env.AUTHDOMAIN,
	databaseURL: process.env.DATABASEURL
};
firebase.initializeApp(config);

app.post('/create', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	var email = req.body.email,
		password = req.body.password;
	firebase.auth().createUserWithEmailAndPassword(email, password).then((val) => {
		var results = JSON.stringify(val);
		res.send(results);
	}).catch((error) => {
		var errorCode = error.code,
			errorMessage = error.message;
		res.send(JSON.parse({errorMessage: errorMessage}));
	});
});

app.post('/login', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	var email = req.query.email,
		password = req.query.password;

	firebase.auth().signInWithEmailAndPassword(email, password).then((response) => {
		var results = response;
		res.send(results);
	}).catch((error) => {
		var errorCode = error.code,
			errorMessage = error.message;
		res.send({'errorMessage': errorMessage});
	});
});


app.get('/signout', (req, res) => {
	res.setHeader('Content-Type', 'application/json');

	firebase.auth().signOut().then((response) => {
		res.send({'Action': 'Signed out!'})
	}).catch((error) => {
		var errorCode = error.code,
			errorMessage = error.message;
		res.send({'errorMessage': errorMessage});
	})
});

app.listen(PORT, () => {
	console.log('The app is listening on port ' + PORT);
	// browser('http://localhost:' + PORT);
});
