let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
let skipOrNot = false;

//easier to set attributes
function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function(name) {
        element.setAttribute(name, attributes[name]);
    })
}

//fetch Current Score
function fetchCurrentScore(element, session){
    fetch("https://codecyprus.org/th/api/score?session=" + session)
        .then(response => response.json())
        .then(jsonObject => {

            element.innerText = "Score:  " + jsonObject.score;

        });
}

function skipQuestion(session){

    modal.style.display = "block";



    // fetch("https://codecyprus.org/th/api/skip?session="+ session)
    //     .then(response => response.json())
    //     .then(jsonObject => {
    //         console.log(jsonObject);
    //         location.reload();
    //     });
}

function setToYes(){
    skipOrNot = true;
    modal.style.display = "none";
    console.log(skipOrNot);
}

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
                        //ONCE FETCHED =>
                        fetch("https://codecyprus.org/th/api/answer?session=" + session +"&answer= " + value.toString())
                            .then(response => response.json())
                            .then(jsonObject => {
                                console.log(jsonObject);
                                location.reload();
                            });
                    });
            });
        }
        else {
            console.log("Geolocation is not supported by your browser.");
        }
    }else{
        fetch("https://codecyprus.org/th/api/answer?session=" + session +"&answer= " + value.toString())
            .then(response => response.json())
            .then(jsonObject => {
                console.log(jsonObject);
                location.reload();
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
                                        location.reload();
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
                        location.reload();
                    });
                break;
            }
        }
    }



}