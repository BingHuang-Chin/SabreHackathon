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


app.controller('HomeController', function($scope, FirebaseService, BotService, UserService, FlightService, HotelService) {
    $scope.pageTitle = 'Sabre';
    $scope.botName = 'Sabre';
    $scope.flightDetails = FlightService.myFlights;
    $scope.hotelDetails = HotelService.myHotels;
    $scope.details = FlightService.myFlights;

	FirebaseService.Login()
		.then(function() {
			console.log(UserService.displayName);
			console.log(UserService.userUid);
		});


    function createUserMessage(val) {
        // 	Start of initialization of chat message element
        var date = new Date(); // for now
        var chatMessage = $('<div></div>').attr({
            class: "chat-message clearfix"
        });
        chatMessage.append('<img src="' +UserService.photoURL + '" alt="" width="32" height="32">' +
				'<div class="chat-message-content clearfix">' +
				'<h5>' + UserService.displayName + '</h5>' +
				'<p>' + val + '</p>' +
				'<span class="chat-time">'+ date.getHours() + ':' + date.getMinutes() + '</span>' +
				'</div>');
        // 	End of initialization of chat message element
        return chatMessage;
    }

    function createBotMessage(val) {
        //  Start of initialization of chat message element
        var date = new Date(); // for now
        var chatMessage = $('<div></div>').attr({
            class: "chat-message clearfix"
        });
        chatMessage.append('<img src="https://bot-framework.azureedge.net/bot-icons-v1/bot-framework-default-7.png" alt="" width="32" height="32">' +
                '<div class="chat-message-content clearfix">' +
                '<h5>Marco Biedermann</h5>' +
                '<p>' + val + '</p>' +
                '<span class="chat-time">'+ date.getHours() + ':' + date.getMinutes() + '</span>' +
                '</div>');
        //  End of initialization of chat message element
        return chatMessage;
    }


    $('#live-chat header').on('click', function() {
        $('.chat').slideToggle(300, 'swing');
    });

    $('#chatForm').submit(function(e) {
        e.preventDefault();
        var chatBox = $('#chatInput');
        var message = chatBox.val();
        chatBox.val('');
        $('.chat-history').append(createUserMessage(message));
        $(".chat-history").animate({ scrollTop: $('.chat-history').prop("scrollHeight")}, 250);

        // Query to Python
        // BotService.sendMessage(message)
        //     .then(function(result) {
        //         console.log(result);
        //     });

        fw7.openPanel('right');
    });
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
            UserService.userUid = user.uid;
			UserService.photoURL = user.photoURL;
        }).catch(function(error) {
            console.log(error);
            fw7.alert('Unable to login to Google account, Please try again.');
        });

        return authentication;
    }
});

app.service('BotService', function($http) {
    this.sendMessage = function(message) {
        var response = $http({
                method: 'GET',
                url: 'http://sabrehacksg-binghuang.rhcloud.com/getFlight'
            });

        return response;
    };
});

/*
	UserService contains all the User
	information needed to display
*/
app.service('UserService', function() {
    this.displayName = '';
    this.userUid = '';
	this.photoURL = '';

    // Adding flight to the database, user's purchased
    // ticket
    this.AddFlight = function() {
        var url = '/AddFlight/' + this.userUid;
    }
});


/*
	FlightService contains all the cart
	information
*/
app.service('FlightService', function($http) {
    this.flightDetails = [];
	this.myFlights = [
		{
			departureAirport: 'SIN',
			arrivalAirport: 'DOH',
			departureDateTime: '2016-11-01T20:25:00',
			arrivalDateTime: '2016-11-01T23:25:00,',
			flightNumber: '739',
			flightCode: 'QR'
		},
        {
            departureAirport: 'LAS',
            arrivalAirport: 'SIN',
            departureDateTime: '2016-11-01T20:25:00',
            arrivalDateTime: '2016-11-01T23:25:00,',
            flightNumber: '739',
            flightCode: 'QR'
        },
        {
            departureAirport: 'LAS',
            arrivalAirport: 'SIN',
            departureDateTime: '2016-11-01T20:25:00',
            arrivalDateTime: '2016-11-01T23:25:00,',
            flightNumber: '739',
            flightCode: 'QR'
        },
        {
            departureAirport: 'LAS',
            arrivalAirport: 'SIN',
            departureDateTime: '2016-11-01T20:25:00',
            arrivalDateTime: '2016-11-01T23:25:00,',
            flightNumber: '739',
            flightCode: 'QR'
        },
        {
            departureAirport: 'LAS',
            arrivalAirport: 'SIN',
            departureDateTime: '2016-11-01T20:25:00',
            arrivalDateTime: '2016-11-01T23:25:00,',
            flightNumber: '739',
            flightCode: 'QR'
        },
        {
            departureAirport: 'LAS',
            arrivalAirport: 'SIN',
            departureDateTime: '2016-11-01T20:25:00',
            arrivalDateTime: '2016-11-01T23:25:00,',
            flightNumber: '739',
            flightCode: 'QR'
        }
	];

    this.fetchFlightDetails = function() {

    }
});


/*
    HotelService contains information needed
    to display details for the hotels
*/
app.service('HotelService', function() {
    this.myHotels = [
        {
            location: 'Princep Street',
            hotelName: 'Marriot Hotel',
            checkIn: '2016-11-01T23:25:00',
            checkOut: '2016-11-01T23:25:00'
        },
        {
            location: 'Princep Street',
            hotelName: 'Marriot Hotel',
            checkIn: '2016-11-01T23:25:00',
            checkOut: '2016-11-01T23:25:00'
        },
        {
            location: 'Princep Street',
            hotelName: 'Marriot Hotel',
            checkIn: '2016-11-01T23:25:00',
            checkOut: '2016-11-01T23:25:00'
        },
        {
            location: 'Princep Street',
            hotelName: 'Marriot Hotel',
            checkIn: '2016-11-01T23:25:00',
            checkOut: '2016-11-01T23:25:00'
        }
    ];
});















