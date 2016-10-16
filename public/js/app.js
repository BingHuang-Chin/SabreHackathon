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
        $scope.flightDetails = FlightService.myFlight;
        $scope.hotelDetails = HotelService.myHotel;
        $scope.getFlights = FlightService.getFlights;
        $scope.getHotels = HotelService.getHotels;

        $scope.getHotelCalled = false;
        $scope.getFlightCalled = false;

        $scope.displayFlight = false;
        $scope.displayHotel = false;

        $scope.addFlight = function(selectedFlight){
            FlightService.myFlight.push(selectedFlight);
            fw7.closePanel('right');

            $('.chat-history').append(createBotMessage("Added your Flight to confirmation list! What can I help you with next? Book a hotel?"));
        }

        $scope.addHotel = function(selectedHotel){
            HotelService.myHotel.push(selectedHotel);
            fw7.closePanel('right');

            $('.chat-history').append(createBotMessage("Added your Hotel to confirmation list! What can I help you with next? Find attractions?"));
        }

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
        BotService.sendMessage(message)
        .then(function(result) {
            console.log(result.data.entities);
            switch(result.data.intents[0].intent){
                case "findFlight": {

                    $('.chat-history').append(createBotMessage("Sure! Finding all the available Flights for you now!"));

                    $scope.getFlightCalled = true;
                    $scope.getHotelCalled = false;

                    // // Open Panel
                    fw7.openPanel('right');
                    break;
                }
                case "findHotel":{

                    $('.chat-history').append(createBotMessage("Sure! Finding all the available Hotels for you now!"));

                    $scope.getFlightCalled = false;
                    $scope.getHotelCalled = true;

                    // // Open Panel
                    fw7.openPanel('right');


                }
                case "greetings": {
                    console.log(result.data.intents[0].intent);
                    break;
                }
                case "checkout": {
                    console.log(result.data.intents[0].intent);
                    break;
                }
                case "goWithCount": {
                    console.log(result.data.intents[0].intent);
                    break;
                }
                default:
                $('.chat-history').append(createBotMessage("Sorry, I did not understand that. Could you please repeat yourself?"));
            }
                // fw7.openPanel('right');
            });

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
                url: 'https://api.projectoxford.ai/luis/v1/application?id=75e1eaed-2018-4061-a64d-0bb26ed74483&subscription-key=29c91a956a174549afe70038166ec627&q=' + message + '&timezoneOffset=8.0'
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
        this.getFlights = [
        {
        "Amount": "828.50",
        "ArrivalDateTime": "November 1th 2016, 14:15",
        "CurrencyCode": "SGD",
        "DepartureDate": "2016-11-01",
        "DepartureDateTime": "November 1th 2016, 02:05",
        "FlightNumber": [
          945,
          739
        ],
        "Path": "SIN > DOH > LAX"
      },
      {
        "Amount": "828.50",
        "ArrivalDateTime": "November 2nd 2016, 14:15",
        "CurrencyCode": "SGD",
        "DepartureDate": "2016-11-01",
        "DepartureDateTime": "November 1th 2016, 20:25",
        "FlightNumber": [
          947,
          739
        ],
        "Path": "SIN > DOH > LAX"
      },
      {
        "Amount": "848.40",
        "ArrivalDateTime": "November 2nd 2016, 09:00",
        "CurrencyCode": "SGD",
        "DepartureDate": "2016-11-01",
        "DepartureDateTime": "November 1th 2016, 20:10",
        "FlightNumber": [
          512,
          112
        ],
        "Path": "SIN > MNL > LAX"
      },
      {
        "Amount": "848.40",
        "ArrivalDateTime": "November 1th 2016, 18:35",
        "CurrencyCode": "SGD",
        "DepartureDate": "2016-11-01",
        "DepartureDateTime": "November 1th 2016, 10:30",
        "FlightNumber": [
          502,
          102
        ],
        "Path": "SIN > MNL > LAX"
      },
      {
        "Amount": "848.40",
        "ArrivalDateTime": "November 1th 2016, 18:35",
        "CurrencyCode": "SGD",
        "DepartureDate": "2016-11-01",
        "DepartureDateTime": "November 1th 2016, 14:50",
        "FlightNumber": [
          508,
          102
        ],
        "Path": "SIN > MNL > LAX",
        "Transfer":[
            "SIN > MNL",
            "MNL > LAX"
        ]
      }
    ];

    this.myFlight = [];

    this.fetchFlightDetails = function() {
        var result = $http({
            method: "GET",
            url: "https://sabrehack2016.azurewebsites.net/GetFlightInformation"
        })

        return result;
    }
});


/*
    HotelService contains information needed
    to display details for the hotels
    */
    app.service('HotelService', function() {
        this.getHotels = [
        {
            location: 'Cotulla, Cotulla(TX)',
            hotelName: 'Best Western Cowboy Inn',
            checkIn: 'November 1th 2016, 23:25',
            checkOut: 'November 3rd 2016, 23:25'
        },
        {
            location: '807 W. HWY 117, Dilley, Dilley (TX), United States 78017',
            hotelName: 'Dilley Motor Inn',
            checkIn: 'November 1th 2016, 23:25',
            checkOut: 'November 3rd 2016, 23:25'
        },
        {
            location: '16301 South Ih-35, Dilley, Dilley (TX), United States 78017',
            hotelName: 'Super 8 Dilley',
            checkIn: 'November 1th 2016, 23:25',
            checkOut: 'November 3rd 2016, 23:25'
        },
        {
            location: 'Holiday Inn Express Hotels Cotulla',
            hotelName: '624 Las Palmas, Cotulla, Cotulla (TX), United States 78014',
            checkIn: 'November 1th 2016, 23:25',
            checkOut: 'November 3rd 2016, 23:25'
        }
        ];

        this.myHotel = [];
    });
