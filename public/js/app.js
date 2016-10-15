var app = angular.module('app', []);
var fw7 = {};
var mainView = {};
var $$ = Dom7;

/*
	Start instantiating socket.io
	for the application to receive
	updates from the server
*/



/*
	Start running Angular together with Framework7
*/
app.run(function() {
    fw7 = new Framework7({
        pushState: true,
        angular: true
    });
    mainView = fw7.addView('.view-main', {});
});


/*
	Configuration for Angular
*/
app.config(function() {
    window.location.hash = '#!/home.html';
});


/*
	RootController & HomeController is the starting
	page for this whole application
*/
app.controller('RootController', function($scope) {
    $scope.pageTitle = 'Welcome';
});


app.controller('HomeController', function($scope, FirebaseService, UserService, CartService) {
    $scope.pageTitle = 'Sabree';
	$scope.botName = 'Sabre';

    $('#live-chat header').on('click', function() {
            $('.chat').slideToggle(300, 'swing');
    });


    $('#chatForm').submit(function(e) {
    	e.preventDefault();
    	var chatBox = $('#chatInput');
    	var message = chatBox.val();
    	chatBox.val('');
   });


   $scope.flightDetails = CartService.ItemsToPurchase;



   function ConvertDateTime() {

   }

    // FirebaseService.Login()
    // 	.then(function() {
    // 		console.log(UserService.displayName);
    // 		console.log(UserService.uid);
    // 	});

    // Setting of progress bar
    // var progressbar = $$('.demo-progressbar-inline .progressbar');
    // fw7.setProgressbar(progressbar, 50.5);
});


/*
	FirebaseService contains firebase authentication
	service
*/
app.service('FirebaseService', function(UserService) {
    // Configuration for init of firebase
    var config = {
        apiKey: "AIzaSyDzTfFPfYuboWudqi04RyEqncSQ3ELzCzk",
        authDomain: "sabrehackathon-1dcfc.firebaseapp.com",
        databaseURL: "https://sabrehackathon-1dcfc.firebaseio.com/"
    };
    firebase.initializeApp(config);

    // Information which needs to be returned
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');

    // Function to login
    this.Login = function() {
        var authentication = firebase.auth().signInWithPopup(provider).then(function(result) {
            var user = result.user;
            UserService.displayName = user.displayName;
            UserService.uid = user.uid;
        }).catch(function(error) {
            console.log(error);
            fw7.alert('Unable to login to Google account, Please try again.');
        });

        return authentication;
    }
});


/*
	UserService contains all the User
	information needed to display
*/
app.service('UserService', function() {
    this.displayName = '';
    this.userUID = '';
});


/*
	CartService contains all the cart
	information
*/
app.service('CartService', function() {
	this.ItemsToPurchase = [
		{
			departureAirport: 'SIN',
			arrivalAirport: 'DOH',
			departureDateTime: '2016-11-01T20:25:00',
			arrivalDateTime: '2016-11-01T23:25:00,',
			flightNumber: '739',
			flightCode: 'QR'
		}
	];
});









