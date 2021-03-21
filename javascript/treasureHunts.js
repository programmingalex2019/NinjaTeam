const name = document.getElementById('name'); //will store input value from the user
const errorElement = document.getElementById("error-message"); //to be manipulated to display error message from the API

//fetches available treasure hunts from the API and transforms them to DOM elements
function fetchTreasureHunts() {
    //fetching treasureHunts from the API
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json()) // taking the json from the response
        .then(jsonObject => { //awaited ready to use json

            let myList = document.getElementById("generated-api-hunts"); //flexible div that will contain treasure hunts divs
            let listOfTreasureHunts = jsonObject.treasureHunts; // the actual list from json containing the treasureHunts

            /* logic */
            for(let i = 0; i < listOfTreasureHunts.length; i++){ //iterating through each available treasure hunt
                let listItem = document.createElement("div"); //creating a div depending on the current treasure hunt
                // the div will contain a button which will have an id of the current treasure hunt -> that id will go into on click function -> which can be manipulated
                listItem.innerHTML = "<button type=submit class=treasure onclick='startTreasureHunt(id)' id=" + listOfTreasureHunts[i].uuid +">" + "<h1>" + listOfTreasureHunts[i].name + "</h1>" + "</button";
                myList.appendChild(listItem); //populating the buttons into the divs
            }
        });
}

fetchTreasureHunts(); //run the above function

//function that starts the selected treasure Hunt
function startTreasureHunt(uid){

    errorElement.innerText = ""; //before getting an error -> default the error message to nothing

    /*VALIDATION*/
    if(name.value.length === 0){
        errorElement.innerText = "Please enter a Name";
    }
    //if input name > 0
    else {
        //Read name and session from cookies
        let cookieName = readCookie("Name");
        let cookieSession = readCookie("Session");
        //if chosen name matches cookies -> start treasure hunt with saved session
        if(name.value === cookieName){
            window.location.href = 'questions.html?session=' + cookieSession; //transfer data to the next page -> to be used to fetch questions from API
        }else{ //if cookie does not match name -> means new user
            let callURL = "https://codecyprus.org/th/api/start" + "?player=" + name.value + "&app=" + "NinjaTeam" + "&treasure-hunt-id=" + uid; //start the treasure hunt with specified name and specific treasure hunt uid -> which is assigned to each button uniquely
            //fetch the data
            fetch(callURL)
                .then(response => response.json())
                .then(jsonObject => {
                    //any errors will be shown to the user in the error message div
                    if(jsonObject.status === "ERROR"){
                        errorElement.innerText = jsonObject.errorMessages[0];
                    }
                    // if no errors store the cookie for 30 days in case user exits an unfinished treasure hunt -> to resume later
                    else {
                        setCookie("Name", name.value, 30);
                        setCookie("Session", jsonObject.session, 30);
                        window.location.href = 'questions.html?session=' + jsonObject.session; //pass generated session to questions page
                    }
                });
        }
    }
}

/* STANDARD READ AND SET COOKIE FUNCTIONS*/

//accesses browser cookies and splits where ; to get each value pair
//finds the cookie value by the key
function readCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
//sets cookie as key value pair -> with a specified expire time
function setCookie(cookieName, cookieValue, expireDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

/* STANDARD READ AND SET COOKIE FUNCTIONS*/