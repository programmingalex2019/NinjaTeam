const question = document.getElementById("heuI"); //div which will container initial state of the questions UI
let button; //will be modified accordingly

//function to run when user selects unit testing
function LeaderBoard(){

    document.getElementById("testingHeader").style.display = "none"; //remove the heuristics titles

    fetch("https://codecyprus.org/th/test-api/leaderboard?&hasPrize&size=5&sorted") //1 2 3
        .then(response => response.json())
        .then(jsonObject => {

            testSorted(jsonObject.leaderboard); //tests whether sorted parameter actually works
            question.innerHTML = " "; //removes the heuristics UI

            //leaderboard table that will hold the data
            const leaderTable = document.createElement("table");
            leaderTable.setAttribute("class", "leaderboardTable");
            let tableContain = ""; //if clicked again clean up and populate bellow

            //basic design of the table
            leaderTable.innerHTML = "<h1 style='color: grey; font-size: 4vh;font-weight: bold; text-align: center; width: 100%'>Leaderboard</h1>" + "</br>" + "<tr><th>Player Name</th><th>Score</th></tr>";

            //populate fetched data from leaderboard testing to the leaderboard table
            for (let i = 0; i < jsonObject.leaderboard.length; i++){
                const entry = jsonObject.leaderboard[i];
                const playerName = entry.player;
                const score = entry.score;
                tableContain += "<tr>" +  "<td>"+ playerName+"</td>" +  "<td>"+ score+"</td>" +  "</tr>";
            }

            //additional leaderboard table styling
            leaderTable.style.color ="white";
            leaderTable.style.width = "100%"
            leaderTable.innerHTML += tableContain;

            question.appendChild(leaderTable); //add data to UI

        });
}

//function that tests whether leaderboard sorted or not
function testSorted(scoresArray){

    //for results
    let testContainer = document.getElementById("unitTestLeader");

    //remove all the heuristics UI -> to be replaced with testing results
    document.getElementById("heuF").style.display = "none";
    document.getElementById("heuC").style.display = "none";
    testContainer.innerHTML = " ";
    testContainer.style.display = "flex";

    //UI to display what the tests represent
    let unitTestTitle = document.createElement("h1");
    unitTestTitle.setAttribute("class", "unitTestTitle");
    unitTestTitle.innerText = "Unit Tests";
    testContainer.appendChild(unitTestTitle);

    //pre variables
    let sorted = true;
    let current = Number.MAX_VALUE;

    //the algorithm will compare the highest number with the previous
    //and proceed to the next pair
    //if all pairs pass the check
    //the pair is sorted
    //a passed UI element is displayed
    //otherwise a failed element is displayed
    for(let i = 0; i < scoresArray.length; i++){

        let testRow = document.createElement("div");
        testRow.setAttribute("class", "testRow");

        let greaterThan = document.createElement("p");
        greaterThan.innerHTML = ">";
        greaterThan.style.color = "lightseagreen";

        let equal = document.createElement("p");
        equal.innerHTML = "=";
        equal.style.color = "lightseagreen";

        let back = document.createElement("p");
        if(i === 0){
            back.innerText = "MAX";
        }else{
            back.innerText = current.toString();
        }
        let front = document.createElement("p");
        front.innerText = scoresArray[i].score.toString();

        let passed = document.createElement("p");

        testRow.appendChild(back);
        testRow.appendChild(greaterThan);
        testRow.appendChild(front);
        testRow.appendChild(equal);
        testRow.appendChild(passed);

        testContainer.appendChild(testRow);

        if(scoresArray[i].score <= current){

            passed.innerText = "Passed";
            passed.style.color = "lightseagreen";
            current = scoresArray[i].score;

        }else{
            passed.innerText = "Failed";
            sorted = false;
        }
    }
}


//UI will be displayed accordingly to the question type from the API
function questionType(type){

    //for big screens expand container
    if(window.innerWidth > 1024){
        document.getElementById("testingHeader").style.display = "flex";
    }

    let testContainer = document.getElementById("unitTestLeader");
    document.getElementById("heuF").style.display = "flex";
    document.getElementById("heuC").style.display = "flex";
    testContainer.innerHTML = " ";
    testContainer.style.display = "none";

    fetch("https://codecyprus.org/th/test-api/question?completed&question-type=" + type)
        .then(response => response.json())
        .then(jsonObject => {

            let title = document.createElement("h1");
            title.innerText = "Before";

            question.innerHTML = "<h1 class='beforeTitle'> Before </h1>" + "<br>" + jsonObject.questionText + "<br>";
            buildUI(jsonObject);

        });
}

function buildUI(jsonObject){

    //for big screens expand container
    if(window.innerWidth < 1024){
        document.getElementById("NielsenTitle").style.display = "block";
    }else{
        document.getElementById("NielsenTitle").style.display = "none";
    }


    switch (jsonObject.questionType){
        case "INTEGER":

            document.getElementById("changes").setAttribute("src", "../assets/testing/IntegerFix.PNG");

            let inputField;
            inputField = document.createElement("input");
            inputField.setAttribute('name',"answer");
            inputField.setAttribute('class',"int");

            button = document.createElement("button");
            button.setAttribute("type", "submit");
            button.innerText = "submit";
            button.setAttribute("class", "submitButtons");

            question.appendChild(inputField);
            question.appendChild(button);

            document.getElementById("heuristics1").innerText = "1.\tVisibility of system status: The text should be aligned to the left with a brighter color and the link should be in a better color.";
            document.getElementById("heuristics2").innerText = "6.\tRecognition rather than recall: All elements, actions, and options are visible.";
            document.getElementById("heuristics3").innerText = "4.\tConsistency and standards: all words, situations, and actions have different roles.";
            document.getElementById("readMore").innerText = "Read More";

            break;

        case "TEXT":

            document.getElementById("changes").setAttribute("src", "../assets/testing/IntegerFix.PNG");

            let inputText;

            inputText = document.createElement("textarea");
            inputText.setAttribute('type',"text");
            inputText.setAttribute('style',"cols:25,rows:3");
            inputText.setAttribute('class',"txt");

            button = document.createElement("button");
            button.setAttribute("type", "submit");
            button.setAttribute("class", "submitButtons");
            button.setAttribute("style","margin-top:2px")
            button.innerText = "submit";

            question.appendChild(inputText);
            question.appendChild(button);

            document.getElementById("heuristics1").innerText = "1.\tVisibility of system status: The text should be aligned to the left with a brighter color and the link should be in a better color";
            document.getElementById("heuristics2").innerText = "2.\tVisibility of system status: The text should be aligned to the left with a brighter color and the link should be in a better color";
            document.getElementById("heuristics3").innerText = "6.\tRecognition rather than recall: All elements, actions, and options are visible.";
            document.getElementById("readMore").innerText = "Read More";
            break;

        case "BOOLEAN":

            document.getElementById("changes").setAttribute("src", "../assets/testing/BooleanFix.PNG");

            let inputRadio1,inputRadio2,label1,label2;
            inputRadio1 = document.createElement("input");
            inputRadio1.setAttribute('type',"radio");
            inputRadio1.setAttribute("name","boolean");
            inputRadio1.setAttribute("class","bool1");


            label1 = document.createElement("label");
            label1.setAttribute("for", "true");
            label1.setAttribute("class", "bool2");
            label1.innerText = "True";

            inputRadio2 = document.createElement("input");
            inputRadio2.setAttribute('type',"radio");
            inputRadio2.setAttribute("name","boolean");
            inputRadio2.setAttribute("class","bool1");


            label2 = document.createElement("label");
            label2.setAttribute("for", "false");
            label2.setAttribute("class", "bool2");
            label2.innerText = "False";

            question.appendChild(inputRadio1);
            question.appendChild(label1);
            question.appendChild(inputRadio2);
            question.appendChild(label2);

            document.getElementById("heuristics1").innerText = "4.\tConsistency and standards: all words, situations, and actions have different roles.";
            document.getElementById("heuristics2").innerText = "6.\tRecognition rather than recall: All elements, actions, and options are visible.";
            document.getElementById("heuristics3").innerText = "10.\tHelp and documentation: a header should be added under the title of: “answer the following question.”";
            document.getElementById("readMore").innerText = "Read More";
            break;
        case "MCQ":

            document.getElementById("changes").setAttribute("src", "../assets/testing/MCQfix.PNG");

            let choice1,choice2,choice3,choice4;

            choice1 = document.createElement("input");
            choice1.setAttribute("type","checkbox");
            choice1.setAttribute("name","MCQ");
            choice1.setAttribute("class","multi")

            choice2 = document.createElement("input");
            choice2.setAttribute("type","checkbox");
            choice2.setAttribute("name","MCQ");
            choice2.setAttribute("class","multi")

            choice3 = document.createElement("input");
            choice3.setAttribute("type","checkbox");
            choice3.setAttribute("name","MCQ");
            choice3.setAttribute("class","multi")

            choice4 = document.createElement("input");
            choice4.setAttribute("type","checkbox");
            choice4.setAttribute("name","MCQ");
            choice4.setAttribute("class","multi");

            question.appendChild(choice1);
            question.appendChild(choice2);
            question.appendChild(choice3);
            question.appendChild(choice4);

            document.getElementById("heuristics1").innerText = "1.\tVisibility of system status: The text should be aligned to the left with a brighter color and the link should be in a better color.";
            document.getElementById("heuristics2").innerText = "4.\tConsistency and standards: all words, situations, and actions have different roles.";
            document.getElementById("heuristics3").innerText = "6.\tRecognition rather than recall: All elements, actions, and options are visible.";
            document.getElementById("readMore").innerText = "Read More";
            break;
        case "NUMERIC":

            document.getElementById("changes").setAttribute("src", "../assets/testing/IntegerFix.PNG");

            let numberInput;

            numberInput = document.createElement("input");
            numberInput.setAttribute('type',"number");
            numberInput.setAttribute('name',"answer");
            numberInput.setAttribute('class',"numeric");

            button = document.createElement("button");
            button.setAttribute("type", "submit");
            button.innerText = "submit";
            button.setAttribute("class", "submitButtons");

            question.appendChild(numberInput);
            question.appendChild(button);

            document.getElementById("heuristics1").innerText = "1.\tVisibility of system status: The text should be aligned to the left with a brighter color and the link should be in a better color.";
            document.getElementById("heuristics2").innerText = "4.\tConsistency and standards: all words, situations, and actions have different roles.";
            document.getElementById("heuristics3").innerText = "6.\tRecognition rather than recall: All elements, actions, and options are visible.";
            document.getElementById("readMore").innerText = "Read More";

            break;

    }
}
