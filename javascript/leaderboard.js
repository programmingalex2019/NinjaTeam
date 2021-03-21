let ref = new URLSearchParams(window.location.search); //getting data from url
let session = ref.get("session");
let score = ref.get("score");

let scoresContainer = document.getElementById("playerRowTitleContainer");

function refresh() {
    location.reload();
} //refreshes the page

//read the cookie to display the users name
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
document.getElementById("playerName").innerText = "Name: " + readCookie("Name");

//fetch score data to output result of the user
fetch("https://codecyprus.org/th/api/score?session=" + session)
    .then(response => response.json())
    .then(jsonObject => {
        document.getElementById("playerScore").innerText = "Score:  " + jsonObject.score;
    });

//bellow outputs a container of actual users that also finished the treasure hunt -> from API leaderboard
fetch("https://codecyprus.org/th/api/leaderboard?session=" + session + "&sorted&limit=10")
    .then(response => response.json())
    .then(jsonObject => {

        let generatedRowTitle = document.createElement("div");
        generatedRowTitle.setAttribute("class", "generatedRow");

        let playerDivRowTitle = document.createElement("div");
        playerDivRowTitle.setAttribute("class", "playerRow");

        let playerNameTitleContainer = document.createElement("div");
        playerNameTitleContainer.setAttribute("id", "playerNameTitleContainer");

        let playerNameTitle = document.createElement("p");
        playerNameTitle.innerText = "Name";
        playerNameTitleContainer.appendChild(playerNameTitle);

        let timeScoreTitleContainer = document.createElement("div");
        timeScoreTitleContainer.setAttribute("id", "timeScoreTitleContainer");
        let playerTimeTitle = document.createElement("p");
        playerTimeTitle.innerText = "Time(s) ";

        let playerScoreTitle = document.createElement("p");
        playerScoreTitle.innerText = "Score";

        timeScoreTitleContainer.appendChild(playerTimeTitle);
        timeScoreTitleContainer.appendChild(playerScoreTitle);

        playerDivRowTitle.appendChild(playerNameTitleContainer);
        playerDivRowTitle.appendChild(timeScoreTitleContainer);

        generatedRowTitle.appendChild(playerDivRowTitle)

        scoresContainer.appendChild(generatedRowTitle);

        for(let i = 0; i < jsonObject.limit; i++){

            let generatedRow = document.createElement("div");
            generatedRow.setAttribute("class", "generatedRow");

            let playerDivRow = document.createElement("div");
            playerDivRow.setAttribute("class", "playerRow");
            let playerName = document.createElement("p");
            let playerScore = document.createElement("p");
            let playerTime = document.createElement("p");

            let seconds = parseInt(jsonObject.leaderboard[i].completionTime);
            let dateObject = new Date(seconds);

            playerName.innerHTML = jsonObject.leaderboard[i].player;
            playerScore.innerHTML = jsonObject.leaderboard[i].score;
            playerTime.innerHTML = dateObject.getSeconds();
            playerTime.style.color = "lightseagreen";

            let playerNameContainer = document.createElement("div");
            playerNameContainer.setAttribute("id", "playerNameContainer");
            playerNameContainer.appendChild(playerName);

            let timeScore = document.createElement("div");
            timeScore.setAttribute("id", "timeScoreContainer");
            timeScore.appendChild(playerTime);
            timeScore.appendChild(playerScore);

            playerDivRow.appendChild(playerNameContainer);
            playerDivRow.appendChild(timeScore);


            generatedRow.appendChild(playerDivRow);
            scoresContainer.appendChild(generatedRow);
        }
    });