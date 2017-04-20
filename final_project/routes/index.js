var express = require('express');
var mongodb=require("mongodb");
var cors = require('cors');

var router = express.Router();
var MongoClient=mongodb.MongoClient;
var url='mongodb://localhost:27017/finalproject';
var ObjectId = require('mongodb').ObjectID;

router.use(cors());

var NodeGeocoder = require('node-geocoder');

var options = {
	provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyDqfPJtNIq2-Tj-i8B22S5laaN_n_152fs', 
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);
router.get('/', function(req, res, next) {
	MongoClient.connect(url, function(err, db){
		if(err){
			console.log('Unable to connect to server', err);
		}else{
			console.log('Connection Established');
			var collection =db.collection('contacts');
			collection.find({}).toArray(function(err, result){
				if(err){
					res.send(err);
				}else if(result.length){
					res.send(result);
				}else{
					res.send('No documents found. Insert to database first.');
				}
				db.close();
			});
		}
	});
	
});

router.post('/find', function(req, res) {
	console.log(req.body);
	var contactId=req.body.id;
	console.log(contactId);
	MongoClient.connect(url, function(err, db){
		if(err){
			console.log('Unable to connect to server', err);
		}else{
			console.log('Connection Established');
			var collection =db.collection('contacts');
			collection.find({ _id: ObjectId(contactId)}).toArray(function(err, result){
				if(err){
					res.send(err);
				}else{
					console.log("Result: "+result);
					res.send(result);
				}
				db.close();
			});
		}
	});

});

router.post('/update', function(req, res) {
	var con_mail, con_email, con_phone;
	if(req.body.checkbox==undefined){
		con_email=false;
		con_mail=false;
		con_phone=false;
	}else{
		if(req.body.checkbox[1] == 'Email' || req.body.checkbox[2] == 'Email' || req.body.checkbox[0] == 'Email' || req.body.checkbox == 'Email'){
			con_email=true;
		}else{
			con_email=false;
		}
		if(req.body.checkbox[1] == 'Mail' || req.body.checkbox[2] == 'Mail' || req.body.checkbox[0] == 'Mail' || req.body.checkbox == 'Mail'){
			con_mail=true;
		}else{
			con_mail=false;
		}
		if(req.body.checkbox[1] == 'Phone' || req.body.checkbox[2] == 'Phone' || req.body.checkbox[0] == 'Phone' || req.body.checkbox == 'Phone'){
			con_phone=true;
		}else{
			con_phone=false;
		}
	}


	var addContact=[{"fname":req.body.firstname}, {"lname":req.body.lastname}, {"street":req.body.street}, {"city":req.body.city}, {"state":req.body.state}, {"zip":req.body.zip}, {"phone":req.body.phone}, {"email":req.body.email}, {"cmail":con_mail}, {"cphone":con_phone}, {"cemail":con_email}];
	var address=req.body.street+' '+req.body.city+' '+req.body.state;
	getGeoCode(address, function(latitude, longitude){
		var addThis={"salutation":req.body.salutation, "fname":req.body.firstname, "lname":req.body.lastname, "street":req.body.street, "city":req.body.city, "state":req.body.state, "zip":req.body.zip, "phone":req.body.phone, "email":req.body.email, "cmail":con_mail, "cphone":con_phone, "cemail":con_email, "lati" : latitude, "long":longitude};
		console.log(addThis);
		var returnThis={"_id": req.body.oid, "salutation":req.body.salutation, "fname":req.body.firstname, "lname":req.body.lastname, "street":req.body.street, "city":req.body.city, "state":req.body.state, "zip":req.body.zip, "phone":req.body.phone, "email":req.body.email, "cmail":con_mail, "cphone":con_phone, "cemail":con_email, "lati" : latitude, "long":longitude};
		var obj_id=req.body.oid;
		MongoClient.connect(url, function(err, db) {
			db.collection('contacts', {}, function(err, contacts) {
				contacts.update({_id: obj_id}, {$set: addThis}, function(err, result) {
					if (err) {
						console.log(err);
						res.send("Error");
					}else{
						res.send(returnThis);
						db.close();
					}
				});
			});
		});
	});	

});

router.post('/add', function(req, res) {
	var con_mail, con_email, con_phone;
	if(req.body.checkbox==undefined){
		con_email=false;
		con_mail=false;
		con_phone=false;
	}else{
		if(req.body.checkbox[1] == 'Email' || req.body.checkbox[2] == 'Email' || req.body.checkbox[0] == 'Email' || req.body.checkbox == 'Email'){
			con_email=true;
		}else{
			con_email=false;
		}
		if(req.body.checkbox[1] == 'Mail' || req.body.checkbox[2] == 'Mail' || req.body.checkbox[0] == 'Mail' || req.body.checkbox == 'Mail'){
			con_mail=true;
		}else{
			con_mail=false;
		}
		if(req.body.checkbox[1] == 'Phone' || req.body.checkbox[2] == 'Phone' || req.body.checkbox[0] == 'Phone' || req.body.checkbox == 'Phone'){
			con_phone=true;
		}else{
			con_phone=false;
		}
	}


	var addContact=[{"fname":req.body.firstname}, {"lname":req.body.lastname}, {"street":req.body.street}, {"city":req.body.city}, {"state":req.body.state}, {"zip":req.body.zip}, {"phone":req.body.phone}, {"email":req.body.email}, {"cmail":con_mail}, {"cphone":con_phone}, {"cemail":con_email}];
	var address=req.body.street+' '+req.body.city+' '+req.body.state;
	getGeoCode(address, function(latitude, longitude){
		var addThis={"salutation":req.body.salutation, "fname":req.body.firstname, "lname":req.body.lastname, "street":req.body.street, "city":req.body.city, "state":req.body.state, "zip":req.body.zip, "phone":req.body.phone, "email":req.body.email, "cmail":con_mail, "cphone":con_phone, "cemail":con_email, "lati" : latitude, "long":longitude};
		MongoClient.connect(url, function(err, db) {
			db.collection('contacts', {}, function(err, contacts) {
				contacts.insert(addThis, function(err, result) {
					if (err) {
						console.log(err);
						res.send("Error");
					}else{
						res.send(addThis);
						db.close();
					}
				});
			});
		});
	});	

});

router.post('/addfromMailer', function(req, res) {
	var con_mail, con_email, con_phone;
	if(req.body.checkbox==undefined){
		con_email=false;
		con_mail=false;
		con_phone=false;
	}else{
		if(req.body.checkbox[1] == 'Email' || req.body.checkbox[2] == 'Email' || req.body.checkbox[0] == 'Email' || req.body.checkbox == 'Email'){
			con_email=true;
		}else{
			con_email=false;
		}
		if(req.body.checkbox[1] == 'Mail' || req.body.checkbox[2] == 'Mail' || req.body.checkbox[0] == 'Mail' || req.body.checkbox == 'Mail'){
			con_mail=true;
		}else{
			con_mail=false;
		}
		if(req.body.checkbox[1] == 'Phone' || req.body.checkbox[2] == 'Phone' || req.body.checkbox[0] == 'Phone' || req.body.checkbox == 'Phone'){
			con_phone=true;
		}else{
			con_phone=false;
		}
	}


	var addContact=[{"fname":req.body.firstname}, {"lname":req.body.lastname}, {"street":req.body.street}, {"city":req.body.city}, {"state":req.body.state}, {"zip":req.body.zip}, {"phone":req.body.phone}, {"email":req.body.email}, {"cmail":con_mail}, {"cphone":con_phone}, {"cemail":con_email}];
	var address=req.body.street+' '+req.body.city+' '+req.body.state;
	getGeoCode(address, function(latitude, longitude){
		var addThis={"salutation":req.body.salutation, "fname":req.body.firstname, "lname":req.body.lastname, "street":req.body.street, "city":req.body.city, "state":req.body.state, "zip":req.body.zip, "phone":req.body.phone, "email":req.body.email, "cmail":con_mail, "cphone":con_phone, "cemail":con_email, "lati" : latitude, "long":longitude};
		MongoClient.connect(url, function(err, db) {
			db.collection('contacts', {}, function(err, contacts) {
				contacts.insert(addThis, function(err, result) {
					if (err) {
						console.log(err);
						res.send("Error");
					}else{
						res.send('Thank You for filling up the form');
						db.close();
					}
				});
			});
		});
	});	

});




router.post('/delete', function(req, res) {
	console.log(req.body);
	var contactId=req.body.id;
	console.log(contactId);
	var MongoClient=mongodb.MongoClient;
	var ObjectId = require('mongodb').ObjectID;
	var url='mongodb://localhost:27017/finalproject';
	MongoClient.connect(url, function(err, db) {
		db.collection('contacts', {}, function(err, contacts) {
			contacts.remove({_id: ObjectId(contactId)}, function(err, result) {
				if (err) {
					console.log(err);
					res.send("Error");
				}else{
					res.send("Deleted");
					db.close();
				}
			});
		});
	});

});

function getGeoCode(address, callback){
	geocoder.geocode(address, function(err, res) {//req.body.street+' '+req.body.city+' '+req.body.state
		//console.log(res);
		if(!res[0]){
			latitude =0.00000;
			longitude = 0.00000;
		}else{
			latitude=res[0].latitude;
			longitude=res[0].longitude;
		}
		callback(latitude, longitude);
	});
}

module.exports = router;
