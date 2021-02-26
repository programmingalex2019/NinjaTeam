//Referencing DOM elements
let questionNumberJS = document.getElementById("questionNumberJS");
let questionScoreJS = document.getElementById("currentScoreJS");
let questionContentJS = document.getElementById("questionContentJS");
let inputSectionJS = document.getElementById("inputSectionJS");
let middleRowJS = document.getElementById("middleRowJS");

//getting data(session Id) from the chose Treasure Hunt -> previous page
let ref = new URLSearchParams(window.location.search);
let session = ref.get("session");

fetch("https://codecyprus.org/th/api/question?session=" + session)
    .then(response => response.json())
    .then(jsonObject => {

        buildUI(jsonObject);

    });

function buildUI(jsonObject){

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
            setAttributes(button, {type: "button", class: "submit", onclick: "submitIntegerNumericText(document.getElementById(\"answer\").value, session)"});
            inputSectionJS.appendChild(button); //add to answerContainer

            //attach skip
            if(jsonObject.canBeSkipped === true){
                inputSectionJS.appendChild(skip); //add to answerContainer
            }

            //append to UI
            break;

        case "BOOLEAN":

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
            setAttributes(booleanButton, {type: "submit", class: "submit", onclick: "submitMultiAndBoolean(document.querySelectorAll('input[name=\"choice\"]'),session)"});
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
            setAttributes(buttonNumeric, {type: "button", class: "submit", onclick: "submitIntegerNumericText(document.getElementById(\"answer\").value, session)"});
            inputSectionJS.appendChild(buttonNumeric); //add to answerContainer

            //attach skip
            if(jsonObject.canBeSkipped === true){
                inputSectionJS.appendChild(skip); //add to answerContainer
            }

            break;

        case "MCQ":
            console.log(jsonObject); //for debugging

            /*content*/

            middleRowJS.style.flexDirection = "column";

            let multiQuestionSelectionContainer = document.createElement("div");
            setAttributes(multiQuestionSelectionContainer, {class: "multiQuestionSelectionContainer"});

            let multiQuestionAnswerA= document.createElement("p");
            multiQuestionAnswerA.innerText = "A answer";

            let multiQuestionAnswerB= document.createElement("p");
            multiQuestionAnswerB.innerText = "B answer";

            let multiQuestionAnswerC= document.createElement("p");
            multiQuestionAnswerC.innerText = "C answer";

            let multiQuestionAnswerD= document.createElement("p");
            multiQuestionAnswerD.innerText = "D answer";

            multiQuestionSelectionContainer.appendChild(multiQuestionAnswerA);
            multiQuestionSelectionContainer.appendChild(multiQuestionAnswerB);
            multiQuestionSelectionContainer.appendChild(multiQuestionAnswerC);
            multiQuestionSelectionContainer.appendChild(multiQuestionAnswerD);

            middleRowJS.appendChild(multiQuestionSelectionContainer);
            /*content*/

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
            setAttributes(multiButton, {type: "submit", class: "submit", onclick: "submitMultiAndBoolean(document.querySelectorAll('input[name=\"multiChoice\"]'), session)"});
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
            setAttributes(buttonText, {type: "button", class: "submit", onclick: "submitIntegerNumericText(document.getElementById(\"answer\").value, session)"});
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
