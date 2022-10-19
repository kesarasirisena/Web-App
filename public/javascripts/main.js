const locations = [
    { location:'Location', date:'05-01-2021' },
];

var vueinst = new Vue({
    el: '#app',
    data: {
        login: false,

        //Signup data
        newUserType:"",

        //User Info
        userInfo: {username:"", givenName:"", surname:"", userType:""},

        //Info for editing account
        editAccount:false,
        newUsername: "",
        newGivenName: "",
        newSurname: "",
        googleEmail: "",




        //Data for check-ins
        checkinCode: "",
        checkins: {},
        long: "",
        lat: "",
        cVenues: {},
        warning: "",
        hotspotsVisited: [],


        //Data for hotspots
        showEditHotspot: false,
        editHotspotIndex:-1,
        newHotspot: {},
        newHotspotError: {postcode:false,year:false,month:false,day:false,endYear:false,endMonth:false,endDay:false,endBeforeStart:false},
        hotspots: {},
        showVenues: false,

        //Data for map
        map: {},


        //Data for Venues
        showEditVenue: false,
        editVenueIndex:-1,
        newVenue: {},
        venues: {},

        //Data for Admin
        showEditUser: false,
        editUserIndex:-1,
        newUser: {},
        users: {},

    },

    methods:{

        //Methods for Venues

        getVenues: function(event){
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst._data.venues = JSON.parse(this.responseText);

                }
            };

            xmlhttp.open("GET", "venues/getVenues", true);

            xmlhttp.send();
        },

        addVenue: function(event){

            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getVenues();
                }
            };

            xmlhttp.open("POST", "/venues/addVenue", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify(vueinst._data.newVenue));
        },

        removeVenue: function(event, index){

            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getVenues();
                }
            };

            xmlhttp.open("POST", "venues/removeVenue", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify({"id":vueinst._data.venues[index].v_code}));
        },

        showEditVenueFunc: function(event){
            if(this.showEditVenue==false){
                this.showEditVenue = true;
            }
            else{
                this.showEditVenue = false;
            }

        },

        editVenue: function(event, index){
            this.editVenueIndex = index;
        },

        editVenueSubmit: function(event){

            this.newVenue.v_code = this.venues[this.editVenueIndex].v_code;
            console.log(this.newVenue);

            var xmlhttp = new XMLHttpRequest();


            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst._data.editVenueIndex = -1;
                    vueinst._data.showEditVenue = false;
                    vueinst.getVenues();
                }
            };

            xmlhttp.open("POST", "venues/editVenue", true);


            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify(vueinst._data.newVenue));
        },



        //Methods for Hotspots

        getHotspots: function(event){
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst._data.hotspots = JSON.parse(this.responseText);
                    vueinst.createMap();
                }
            };

            xmlhttp.open("GET", "/getHotspots", true);

            xmlhttp.send();
        },


        addHotspot: function(event){
            this.addHotspotCheck();

            for(i in this.newHotspotError){
                if(this.newHotspotError[i] == true){
                    return;
                }
            }


            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getHotspots();
                    this.newHotspotError = {};
                }
            };

            xmlhttp.open("POST", "admins/addHotspot", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify(vueinst._data.newHotspot));
        },

        showEditHotspotFunc: function(event){
            if(this.showEditHotspot==false){
                this.showEditHotspot = true;
            }
            else{
                this.showEditHotspot = false;
            }

        },

        editHotspot: function(event, index){
            this.editHotspotIndex = index;
        },

        addHotspotCheck: function(event){
            let tempDate = new Date();



            //Test the year
            if(this.newHotspot.year>tempDate.getFullYear()){
                this.newHotspotError.year = true;
                this.year_error = true;
            }
            else{
                this.newHotspotError.year = false;
            }

            //Test the month of the newHotspot
            if(this.newHotspot.month<0||this.newHotspot.month>12){
                this.newHotspotError.month = true;
            }
            else{
                this.newHotspotError.month = false;
            }

            //Test the day of the newHotspot
            if(this.newHotspot.day<0||this.newHotspot.day>31){
                this.newHotspotError.day = true;
            }
            else{
                this.newHotspotError.day = false;
            }
        },

        editHotspotCheck: function(event){
            //Test the end year
            if(this.newHotspot.endYear<this.newHotspot.year){
                this.newHotspotError.endYear = true;
            }
            else{
                this.newHotspotError.endYear = false;
            }

            //Test the end month of the newHotspot
            if(this.newHotspot.endMonth<0||this.newHotspot.endMonth>12){
                this.newHotspotError.endMonth = true;
            }
            else{
                this.newHotspotError.endMonth = false;
            }

            //Test the end day of the newHotspot
            if(this.newHotspot.endDay<0||this.newHotspot.endDay>31){
                this.newHotspotError.endDay = true;
            }
            else{
                this.newHotspotError.endDay = false;
            }

            if( Number(this.newHotspot.year)>Number(this.newHotspot.endYear)
            || (Number(this.newHotspot.year)==Number(this.newHotspot.endYear) && Number(this.newHotspot.month)>Number(this.newHotspot.endMonth))
            || (Number(this.newHotspot.year)==Number(this.newHotspot.endYear) && Number(this.newHotspot.month)==Number(this.newHotspot.endMonth) && Number(this.newHotspot.day)>Number(this.newHotspot.endDay)) )
            {
                this.newHotspotError.endBeforeStart = true;
            }
            else{
                this.newHotspotError.endBeforeStart = false;
            }
        },


        editHotspotSubmit: function(event){

            this.addHotspotCheck();
            this.editHotspotCheck();

            for(i in this.newHotspotError){
                if(this.newHotspotError[i] == true){
                    return;
                }
            }

            this.newHotspot.h_id = this.hotspots[this.editHotspotIndex].h_id;
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst._data.editHotspotIndex = -1;
                    vueinst._data.showEditHotspot = false;
                    vueinst.getHotspots();
                    this.newHotspotError = {};
                }
            };

            xmlhttp.open("POST", "admins/editHotspot", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify(vueinst._data.newHotspot));
        },


        removeHotspot: function(event, index){

            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getHotspots();
                }
            };

            xmlhttp.open("POST", "admins/removeHotspot", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify({"id":vueinst._data.hotspots[index].h_id}));
        },


        //gets all checkins and calls for the map to reload
        getCheckins: function(event){
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst._data.checkins = JSON.parse(this.responseText);
                    vueinst.createCheckinMap();
                }
            };

            xmlhttp.open("GET", "users/getCheckins", true);

            xmlhttp.send();
        },

        //adds a check-in to the database (not working)
        addCheckin: function(event){
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    vueinst.getCheckins();
                    return;
                }
            };

            xmlhttp.open("POST", "users/addCheckin", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify({"checkinCode":vueinst._data.checkinCode}));
        },

        getv_code: function(event){

            console.log(vueinst._data.cVenues);

            var index = 0;
            for (item in vueinst._data.cVenues){
                if (vueinst._data.cVenues[index].longitude.toFixed(3) == vueinst._data.long){
                    if (vueinst._data.cVenues[index].latitude.toFixed(3) == vueinst._data.lat){
                        vueinst._data.checkinCode = vueinst._data.cVenues[index].v_code;
                    }
                }

                index++;
            }

            if (vueinst._data.checkinCode != ""){
                vueinst.addCheckin();
            }
        },

        getv_codes: function(event){
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst._data.cVenues = JSON.parse(this.responseText);
                    vueinst.getv_code();
                }
            };

            xmlhttp.open("GET", "/getLCVenues", true);

            xmlhttp.send();
        },


        //geolocator for check-in
        trackingYou: function(event){

            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(ifSuccessful, ifNot);
            }
            else{
                document.getElementById("locErr").innerHTML = "Browser doesn't support geolocation";
            }

            function ifSuccessful(currentPosition){
                var longitude = currentPosition.coords.longitude.toFixed(3);
                var latitude = currentPosition.coords.latitude.toFixed(3);

                vueinst._data.long = longitude;
                vueinst._data.lat = latitude;

                vueinst.getv_codes();
            }

            function ifNot(){
                document.getElementById("locErr").innerHTML = "Guess some form of error occured";
            }

        },

        //creates a new hotpsot map (called everytime the hotpsots are updated)
        createMap: function(event){
            mapboxgl.accessToken = 'pk.eyJ1IjoiYTE4MDA5OTQiLCJhIjoiY2tvbDNsMGx5MXFlNTJwbWlqa25kZXF3dSJ9._FYmFWhn4eHuqQzb9YMNHg';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [138.6007, -28.5],
                zoom: 2.9
            });

            var index = 0;
            for (item in this.hotspots){
                if (parseInt(this.hotspots[index].latitude) < 90 && parseInt(this.hotspots[index].latitude) > -90){
                    new mapboxgl.Marker({color: 'maroon'}).setLngLat([this.hotspots[index].longitude, this.hotspots[index].latitude]).addTo(map);
                }
                index++;
            }
        },

        //creates a map for the check-in page (includes check-in locations and hotspots)
        createCheckinMap: function(event){
            mapboxgl.accessToken = 'pk.eyJ1IjoiYTE4MDA5OTQiLCJhIjoiY2tvbDNsMGx5MXFlNTJwbWlqa25kZXF3dSJ9._FYmFWhn4eHuqQzb9YMNHg';
            var map = new mapboxgl.Map({
                container: 'checkin_map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [138.6007, -28.5],
                zoom: 2.9
            });

            var hIndex = 0;
            for (i in this.hotspots){
                if(parseInt(this.hotspots[hIndex].latitude) < 90 && parseInt(this.hotspots[hIndex].latitude) > -90){
                    new mapboxgl.Marker({color: 'maroon'}).setLngLat([this.hotspots[hIndex].longitude, this.hotspots[hIndex].latitude]).addTo(map);
                }
                hIndex++;
            }

            var cIndex = 0;
            for (j in this.checkins){
                if(parseInt(this.checkins[cIndex].latitude) < 90 && parseInt(this.checkins[cIndex].latitude) > -90){
                    new mapboxgl.Marker({color: 'blue'}).setLngLat([this.checkins[cIndex].longitude, this.checkins[cIndex].latitude]).addTo(map);
                }
                cIndex++;
            }

            vueinst.checkDanger();

        },

        checkDanger: function(event){


            var hmmm = false;
            var hIndex = 0;
            var cIndex = 0;
            var start;
            var end;
            var cTime;
            this.warningVenues = {};
            this.hotspotsVisited = [];

            //console.log(this.hotspots[1].start_time);

            for (i in this.hotspots){
                start = Date.parse(this.hotspots[hIndex].start_time);
                end = Date.parse(this.hotspots[hIndex].end_time);
                if (!(isNaN(start)) && !(isNaN(end))){

                    for (j in this.checkins){
                        cTime = Date.parse(this.checkins[cIndex].time);

                        if(cTime >= start && cTime <= end){


                            if(this.checkins[cIndex].venue_name == this.hotspots[hIndex].venue_name){

                                hmmm = true;
                                (this.hotspotsVisited).push(this.checkins[hIndex]);
                            }
                        }
                        cIndex++;
                    }
                }
                cIndex = 0;
                hIndex++;
            }



            if (hmmm == true){
                vueinst._data.warning = "!!! Warning: You have been to a COVID hotspot !!!";
            }
            else{
                vueinst._data.warning = "";
            }

        },


        //Method for getting user information
        getUserInfo: function(event){
            xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    var userInfo = JSON.parse(this.responseText);
                    vueinst._data.userInfo.username = userInfo['username'];
                    vueinst._data.userInfo.givenName = userInfo['givenName'];
                    vueinst._data.userInfo.surname = userInfo['surname'];
                    vueinst._data.userInfo.userType = userInfo['userType'];
                    vueinst.getVenues();
                    vueinst.getCheckins();
                    vueinst.checkDanger();

                }
            };

            xmlhttp.open("GET", "users/getUserInfo", true);

            xmlhttp.send();
        },


        //Edit Account Methods

        editAccountFunc: function(event){
            this.editAccount = !this.editAccount;
        },

        editUsername: function(event){

            var xmlhttp = new XMLHttpRequest();


            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getUserInfo();
                }
            };

            xmlhttp.open("POST", "users/editUsername", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify({username: vueinst._data.newUsername}));
        },

        editGivenName: function(event){
            var xmlhttp = new XMLHttpRequest();


            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getUserInfo();
                }
            };

            xmlhttp.open("POST", "users/editGivenName", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify({givenName: vueinst._data.newGivenName}));
        },

        editSurname: function(event){
            var xmlhttp = new XMLHttpRequest();


            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getUserInfo();
                }
            };

            xmlhttp.open("POST", "users/editSurname", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify({surname: vueinst._data.newSurname}));
        },

        addGoogle: function(event){
            var xmlhttp = new XMLHttpRequest();


            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getUserInfo();
                }
            };

            xmlhttp.open("POST", "users/addGoogle", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            xmlhttp.send(JSON.stringify({username: vueinst._data.googleEmail}));
        },

        getUsers: function(event){
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst._data.users = JSON.parse(this.responseText);
                }
            };

            xmlhttp.open("GET", "/admins/getUsers", true);

            xmlhttp.send();
        },

        editUser: function(event, index){
            this.editUserIndex = index;
        },

        editUserSubmit: function(event){

            this.newUser.u_id = this.users[this.editUserIndex].u_id;
            var xmlhttp = new XMLHttpRequest();


            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst._data.editUserIndex = -1;
                    vueinst._data.showEditUser = false;
                    vueinst.getUsers();
                }
            };

            xmlhttp.open("POST", "admins/editUser", true);

            xmlhttp.setRequestHeader("Content-type", "application/json");

            //xmlhttp.send(JSON.stringify(vueinst._data.newUser));
            xmlhttp.send(JSON.stringify(this.newUser));
        },


        makeAdmin: function(event, index){

            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getUsers();
                }
            };

            xmlhttp.open("POST", "admins/makeAdmin", true);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(JSON.stringify({"id":vueinst._data.users[index].u_id}));
        },

        showEditUserFunc: function(event){
            if(this.showEditUser==false){
                this.showEditUser = true;
            }
            else{
                this.showEditUser = false;
                this.editUserIndex = -1;
            }

        },

        removeUser: function(event, index){

            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.getUsers();
                }
            };

            xmlhttp.open("POST", "admins/removeUser", true);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(JSON.stringify({"id":vueinst._data.users[index].u_id}));
        },
    },

    //On page load
    mounted() {
        this.getUserInfo();
        this.getHotspots();
        this.getCheckins();
        this.getUsers(); // <-- This is probably a bad idea.
    }

});

function openMenu()
{
    var nav = document.getElementById("navbar");

    if ( nav.className === "navbar" )
    {
        nav.className += " responsive";
    }
    else
    {
        nav.className = "navbar";
    }
}

var slideIndex = 0;
showSlides();
function showSlides()
{
    var i;
    var slides = document.getElementsByClassName("slides");

    for ( i = 0; i < slides.length; i++ )
    {
        slides[i].style.display = "none";
    }

    slideIndex++;

    if ( slideIndex > slides.length )
    {
        slideIndex = 1;
    }

    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 5000);
}

function editDetails()
{
    var det = document.getElementById("details");
    var ed = document.getElementById("edit");
    var editbtn = document.getElementById("editbtn");
    var can = document.getElementById("cancel");

    det.style.display = "none";
    ed.style.display = "inline";
    editbtn.style.display = "none";
    can.style.display = "inline";
}

function cancelEdit()
{
    var det = document.getElementById("details");
    var ed = document.getElementById("edit");
    var editbtn = document.getElementById("editbtn");
    var can = document.getElementById("cancel");

    det.style.display = "inline";
    ed.style.display = "none";
    editbtn.style.display = "inline";
    can.style.display = "none";
}

var modal = document.getElementById('loginpage');

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function login(){

    let signin = {

        user : document.getElementById('uname').value,
        pass : document.getElementById('psw').value

    };

    if ( signin.user == "" || signin.pass == "" ) {
        alert("Login Unsuccessful");
        return;
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            alert("Login Successful");
            vueinst.login = true;
            document.getElementById('loginpage').style.display='none';
            document.getElementById('signuppage').style.display='none';
            vueinst.getUserInfo();

        } else if (this.readyState == 4 && this.status >= 400) {

            alert("Login Unsuccessful");

        }

    };

    xmlhttp.open("POST", "/users/login", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(signin));
}

function logout(){

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        window.location.href = "/index.html";
    };

    xmlhttp.open("POST", "/users/logout", true);
    xmlhttp.send();
}




function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  var id_token = {token:googleUser.getAuthResponse().id_token};


   var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {


            vueinst.login = true;

            document.getElementById('loginpage').style.display='none';
            document.getElementById('signuppage').style.display='none';
            vueinst.getUserInfo();

        } else if (this.readyState == 4 && this.status >= 400) {

            alert("Google Account Not Linked");

        }

    };

    xmlhttp.open("POST", "/users/login", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(id_token));







}





function signup(){


    let signup = {

        given_name: document.getElementById('sugname').value,
        surname: document.getElementById('susname').value,
        user : document.getElementById('suuname').value,
        pass : document.getElementById('supsw').value,
        user_type: vueinst.newUserType

    };

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            alert("Sign Up Successful");
            vueinst.login = true;
            document.getElementById('loginpage').style.display='none';
            document.getElementById('signuppage').style.display='none';

        } else if (this.readyState == 4 && this.status >= 400) {

            alert("Sign Up Unsuccessful");

        }

    };


    xmlhttp.open("POST", "/users/signup", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(signup));




}

/*
function trackingYou(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(ifSuccessful, ifNot);
    }
    else{
        document.getElementById("locErr").innerHTML = "Browser doesn't support geolocation";
    }

    function ifSuccessful(currentPosition){
        var longitude = currentPosition.coords.longitude;
        var latitude = currentPosition.coords.latitude;

        document.getElementById("locErr").innerHTML = "Total Success";

        document.getElementById("long").innerHTML = longitude.toFixed(5);
        document.getElementById("lat").innerHTML = latitude.toFixed(5);
    }

    function ifNot(){
        document.getElementById("locErr").innerHTML = "Guess some form of error occured";
    }
}
*/


