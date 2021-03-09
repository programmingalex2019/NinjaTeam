let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
let modalCamera = document.getElementById("myModalCamera");
let spanCamera = document.getElementsByClassName("close-camera")[0];
let skipOrNot = false;

let opts = {
    // Whether to scan continuously for QR codes. If false, use scanner.scan() to
    // manually scan. If true, the scanner emits the "scan" event when a QR code is
    // scanned. Default true.
    continuous: true,
    // The HTML element to use for the camera's video preview. Must be a <video>
    // element. When the camera is active, this element will have the "active" CSS
    // class, otherwise, it will have the "inactive" class. By default, an invisible
    // element will be created to host the video.
    video: document.getElementById('preview'),
    // Whether to horizontally mirror the video preview. This is helpful when trying to
    // scan a QR code with a user-facing camera. Default true.
    mirror: true,
    // Whether to include the scanned image data as part of the scan result. See the
    // "scan" event for image format details. Default false.
    captureImage: false,
    // Only applies to continuous mode. Whether to actively scan when the tab is not
    // active.
    // When false, this reduces CPU usage when the tab is not active. Default true.
    backgroundScan: true,
    // Only applies to continuous mode. The period, in milliseconds, before the same QR
    // code will be recognized in succession. Default 5000 (5 seconds).
    refractoryPeriod: 5000,
    // Only applies to continuous mode. The period, in rendered frames, between scans. A
    // lower scan period increases CPU usage but makes scan response faster.
    // Default 1 (i.e. analyze every frame).
    scanPeriod: 1
};

//easier to set attributes //USED in questions.js
function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function(name) {
        element.setAttribute(name, attributes[name]);
    })
}

//fetch Current Score //addition to question.js
function fetchCurrentScore(element, session){
    fetch("https://codecyprus.org/th/api/score?session=" + session)
        .then(response => response.json())
        .then(jsonObject => {
            element.innerText = "Score:  " + jsonObject.score;
        });
}

//when questions allows to skip
function skipQuestion(session){
    modal.style.display = "block";
    if(skipOrNot){
        fetch("https://codecyprus.org/th/api/skip?session="+ session)
            .then(response => response.json())
            .then(jsonObject => {
                console.log(jsonObject);
                location.reload();
            });
    }
}

//answer feedback
function setToYes(){
    skipOrNot = true;
    modal.style.display = "none";
    skipQuestion(session);
}
//answer feedback
function setToNo(){
    skipOrNot = false;
    modal.style.display = "none";
    console.log(skipOrNot);
}
//close modal on span click
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function submitIntegerNumericText(value, session, requiresLocation){

    if(requiresLocation === true){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {

                fetch("https://codecyprus.org/th/api/location?session="+ session + "&latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude)
                    .then(response => response.json())
                    .then(jsonObject => {
                        fetch("https://codecyprus.org/th/api/answer?session=" + session +"&answer= " + value.toString())
                            .then(response => response.json())
                            .then(jsonObject => {
                                console.log(jsonObject);
                                if (jsonObject.correct === true){
                                    document.getElementById("answerFeedbackP").innerText = jsonObject.message;
                                    location.reload();
                                }else{
                                    if(jsonObject.message.length > 15){
                                        document.getElementById("answerFeedbackP").style.fontSize = "3vh";
                                        document.getElementById("answerFeedbackP").style.textAlign = "center";
                                        document.getElementById("answerFeedbackP").innerText = jsonObject.message;
                                    }
                                    document.getElementById("answerFeedbackP").innerText = jsonObject.message;
                                }
                            });
                    });
            });
        }
        else {
            console.log("Geolocation is not supported by your browser.");
        }
    }else {
        fetch("https://codecyprus.org/th/api/answer?session=" + session + "&answer= " + value.toString())
            .then(response => response.json())
            .then(jsonObject => {
                if (jsonObject.correct === true){
                    document.getElementById("answerFeedbackP").innerText = jsonObject.message;
                    location.reload();
                }else{
                    document.getElementById("answerFeedbackP").innerText = jsonObject.message;
                }
                console.log(jsonObject);
            });
    }
}

function submitMultiAndBoolean(value, session) {

    let selectedValue;

    if(requiresLocation === true){

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {

                fetch("https://codecyprus.org/th/api/location?session="+ session + "&latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude)
                    .then(response => response.json())
                    .then(jsonObject => {
                        //ONCE FETCHED =>
                        for (const rb of value) {
                            if (rb.checked) {
                                selectedValue = rb.value;
                                console.log(selectedValue);
                                fetch("https://codecyprus.org/th/api/answer?session="+ session +"&answer= " + selectedValue)
                                    .then(response => response.json())
                                    .then(jsonObject => {
                                        console.log(jsonObject);
                                        if (jsonObject.correct === true){
                                            document.getElementById("answerFeedbackP").innerHtml = jsonObject.message;
                                            location.reload();
                                        }else{
                                            document.getElementById("answerFeedbackP").innerHTML = jsonObject.message;
                                        }
                                    });
                                break;
                            }
                        }
                    });
            });
        }
        else {
            console.log("Geolocation is not supported by your browser.");
        }
    }else{
        for (const rb of value) {
            if (rb.checked) {
                selectedValue = rb.value;
                console.log(selectedValue);
                fetch("https://codecyprus.org/th/api/answer?session="+ session +"&answer= " + selectedValue)
                    .then(response => response.json())
                    .then(jsonObject => {
                        console.log(jsonObject);
                        if (jsonObject.correct === true){
                            document.getElementById("answerFeedbackP").innerText = jsonObject.message;
                            location.reload();
                        }else{
                            document.getElementById("answerFeedbackP").innerText = jsonObject.message;
                        }
                    });
                break;
            }
        }
    }
}