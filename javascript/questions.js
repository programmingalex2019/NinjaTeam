//Referencing DOM elements
let questionNumberJS = document.getElementById("questionNumberJS");
let questionScoreJS = document.getElementById("currentScoreJS");
let questionContentJS = document.getElementById("questionContentJS");
let inputSectionJS = document.getElementById("inputSectionJS");
let middleRowJS = document.getElementById("middleRowJS");

//Variables throughout the script
let ref = new URLSearchParams(window.location.search); //getting data(session Id) from the chose Treasure Hunt -> previous page
let session = ref.get("session"); //getting the session
let requiresLocation = false; //variable to be used when submitting an answer
let switched = false; //toggle variable for front and back camera
let jsonForCamera; //to pass into function and check whether string to int/text/numeric -> then passed into answer value

//Get current question depending on the session
fetch("https://codecyprus.org/th/api/question?session=" + session)
    .then(response => response.json())
    .then(jsonObject => {
        buildUI(jsonObject);
        jsonForCamera = jsonObject; //for correct QR string conversion -> to be used in scanner listener
    });

/*CAMERA*/
function openCamera(){

    modalCamera.style.display = "flex"; //content of camera modal

    let scanner = new Instascan.Scanner(opts);
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]); //assign to first found camera

            let spanCameraSwitch = document.getElementsByClassName("switch-camera")[0]; //span from html
            spanCameraSwitch.onclick = function(){ //executes when span clicked
                if(switched === false){ //using toggle variable
                    for(let i = 0; i < cameras.length; i++){
                        if(cameras[i].name.indexOf('back') !== -1){ //check whether there is a back camera
                            scanner.start(cameras[i]); //switch to back camera -> will work on the phone
                        }else{
                            console.log("no other cameras"); //TODO: display error message
                        }
                    }
                    switched = true; //toggle variable for future clicks
                }else{
                    scanner.start(cameras[0]); //assign back to first found (front camera)
                    switched = false;//toggle variable for future clicks
                }
            }
        } else {
            console.error('No cameras found.');
            alert("No cameras found.");
        }
    }).catch(function (e) {
        //Outputs to many errors -> not used -> coming from the instascan itself
    });

    /*CONTENT MANIPULATION FROM QR READER*/
    scanner.addListener('scan', function (content) {
        //convert string to int in case Integer question
        if(jsonForCamera.questionType === "INTEGER"){
            document.getElementById("answer").value = parseInt(content);
            modalCamera.style.display = "none";
        }
        //convert string to numeric/double in case Numeric question
        if(jsonForCamera.questionType === "NUMERIC"){
            document.getElementById("answer").value = parseFloat(content);
            modalCamera.style.display = "none";
        }
        //convert string to text in case Text question
        if(jsonForCamera.questionType === "TEXT"){
            document.getElementById("answer").value = content;
            modalCamera.style.display = "none";
        }
    });
}
//closing the modal
spanCamera.onclick = function() {
    modalCamera.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modalCamera) {
        modalCamera.style.display = "none";
    }
}

//build the ui with fetched json object accordingly to the type of question
function buildUI(jsonObject){

    if(jsonObject.completed === true){
        window.location.href = 'leaderboard.html?session=' + session + "&score="; //switch to leaderboard screen
    }else{

        //Current Question Number
        questionNumberJS.innerText = "Question:  " + (jsonObject.currentQuestionIndex + 1).toString();

        //Fetch Current Score Based on Id
        fetchCurrentScore(questionScoreJS, session);

        //question text
        questionContentJS.innerHTML = jsonObject.questionText;

        //skip button if required
        let skip = document.createElement("button");
        skip.innerText = "Skip";
        setAttributes(skip, {type: "button", class: "skip", onclick: "skipQuestion(session)"});

        //will be used so that the location is uploaded before checking if answer correct
        requiresLocation = jsonObject.requiresLocation;

        //output specific UI according the question type from json
        switch (jsonObject.questionType){

            case "INTEGER":

                console.log(jsonObject); //for debugging
                //attach input field
                let inputField = document.createElement("input");
                setAttributes(inputField, {type: "number", class: "intAndText", id: "answer"});
                inputSectionJS.appendChild(inputField); //add to inputContainer

                //attach a button
                let button = document.createElement("button");
                button.innerText = "Submit";
                setAttributes(button, {type: "button", class: "submit", onclick: "submitIntegerNumericText(document.getElementById(\"answer\").value, session, requiresLocation)"});
                inputSectionJS.appendChild(button); //add to answerContainer

                //attach skip
                if(jsonObject.canBeSkipped === true){
                    inputSectionJS.appendChild(skip); //add to answerContainer
                }
                //append to UI
                break;

            case "BOOLEAN":

                //CAMERA not displayed for BOOLEAN AND MCQ
                document.getElementById("openCamera").style.display = "none";

                console.log(jsonObject); //for debugging
                let radioContainer = document.createElement("div");
                setAttributes(radioContainer, {class: "radioContainer"});

                let trueButton = document.createElement("input");
                setAttributes(trueButton, {type: "radio", name: "choice", value: true, class: "radioStyle" , id: "tr"});
                let labelTrue = document.createElement("p");
                labelTrue.setAttribute("class", "labelStyle");
                labelTrue.innerText = "True";

                let falseButton = document.createElement("input");
                setAttributes(falseButton, {type: "radio", name: "choice", value: false, class: "radioStyle", id: "fa"});
                let labelFalse = document.createElement("p");
                labelFalse.setAttribute("class", "labelStyle");
                labelFalse.innerText = "False";

                //separated
                let booleanButton = document.createElement("button");
                setAttributes(booleanButton, {type: "submit", class: "submit", onclick: "submitMultiAndBoolean(document.querySelectorAll('input[name=\"choice\"]'),session, requiresLocation)"});
                booleanButton.innerText = "Submit";

                radioContainer.appendChild(labelTrue);
                radioContainer.appendChild(trueButton);
                radioContainer.appendChild(labelFalse);
                radioContainer.appendChild(falseButton);
                inputSectionJS.appendChild(radioContainer);
                inputSectionJS.appendChild(booleanButton);

                if(jsonObject.canBeSkipped === true){
                    inputSectionJS.appendChild(skip); //add to answerContainer
                }
                break;

            case "NUMERIC":

                console.log(jsonObject); //for debugging
                //attach input field
                let inputFieldNumeric = document.createElement("input");
                setAttributes(inputFieldNumeric, {type: "number", step: "any",class: "intAndText", id: "answer"});
                inputSectionJS.appendChild(inputFieldNumeric); //add to inputContainer

                //attach a button
                let buttonNumeric = document.createElement("button");
                buttonNumeric.innerText = "Submit";
                setAttributes(buttonNumeric, {type: "button", class: "submit", onclick: "submitIntegerNumericText(document.getElementById(\"answer\").value, session, requiresLocation)"});
                inputSectionJS.appendChild(buttonNumeric); //add to answerContainer

                //attach skip
                if(jsonObject.canBeSkipped === true){
                    inputSectionJS.appendChild(skip); //add to answerContainer
                }
                break;

            case "MCQ":

                console.log(jsonObject); //for debugging
                //CAMERA not displayed for BOOLEAN AND MCQ
                document.getElementById("openCamera").style.display = "none";
                middleRowJS.style.flexDirection = "column";


                let multiContainer = document.createElement("div");
                setAttributes(multiContainer, {class: "multiContainer"});

                let checkBoxA = document.createElement("input");
                setAttributes(checkBoxA, {type: "radio", value: "A", class: "multi", name:"multiChoice"});
                let labelA = document.createElement("p");
                labelA.setAttribute("class", "labelStyle");
                labelA.innerText = "A";

                let checkBoxB = document.createElement("input");
                setAttributes(checkBoxB, {type: "radio", value: "B", class: "multi", name:"multiChoice"});
                let labelB = document.createElement("p");
                labelB.setAttribute("class", "labelStyle");
                labelB.innerText = "B";

                let checkBoxC = document.createElement("input");
                setAttributes(checkBoxC, {type: "radio", value: "C", class: "multi", name:"multiChoice"});
                let labelC = document.createElement("p");
                labelC.setAttribute("class", "labelStyle");
                labelC.innerText = "C";

                let checkBoxD = document.createElement("input");
                setAttributes(checkBoxD, {type: "radio", value: "D", class: "multi", name:"multiChoice"});
                let labelD = document.createElement("p");
                labelD.setAttribute("class", "labelStyle");
                labelD.innerText = "D";

                let multiButton = document.createElement("button");
                setAttributes(multiButton, {type: "submit", class: "submit", onclick: "submitMultiAndBoolean(document.querySelectorAll('input[name=\"multiChoice\"]'), session, requiresLocation)"});
                multiButton.innerText = "Submit";

                multiContainer.appendChild(labelA);
                multiContainer.appendChild(checkBoxA);
                multiContainer.appendChild(labelB);
                multiContainer.appendChild(checkBoxB);
                multiContainer.appendChild(labelC);
                multiContainer.appendChild(checkBoxC);
                multiContainer.appendChild(labelD);
                multiContainer.appendChild(checkBoxD);

                inputSectionJS.appendChild(multiContainer);
                inputSectionJS.appendChild(multiButton);
                if(jsonObject.canBeSkipped === true){
                    inputSectionJS.appendChild(skip); //add to answerContainer
                }
                break;

            case "TEXT":

                console.log(jsonObject); //for debugging
                //attach input field
                let inputFieldText = document.createElement("input");
                setAttributes(inputFieldText , {type: "text", class: "intAndText", id: "answer"});
                inputSectionJS.appendChild(inputFieldText ); //add to inputContainer

                //attach a button
                let buttonText = document.createElement("button");
                buttonText.innerText = "Submit";
                setAttributes(buttonText, {type: "button", class: "submit", onclick: "submitIntegerNumericText(document.getElementById(\"answer\").value, session, requiresLocation)"});
                inputSectionJS.appendChild(buttonText); //add to answerContainer

                //attach skip
                if(jsonObject.canBeSkipped === true){
                    inputSectionJS.appendChild(skip); //add to answerContainer
                }
                break;

            default:
                console.log("something went wrong");
        }
    }
}
