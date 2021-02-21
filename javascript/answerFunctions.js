
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
    fetch("https://codecyprus.org/th/api/skip?session="+ session)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            location.reload();
        });
}

function submitIntegerNumericText(value, session){

    fetch("https://codecyprus.org/th/api/answer?session="+ session +"&answer= " + value.toString())
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            location.reload();
        });
}

function submitMultiAndBoolean(value, session) {

    let selectedValue;
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