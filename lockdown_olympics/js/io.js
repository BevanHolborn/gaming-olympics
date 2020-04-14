class IO
{
    constructor()
    {
        this.games = null;
        this.players = null;
    }

    async INIT()
    {
        let games = await getGames();
        games.data = games.data.sort((a,b)=>
        {
            return a.name.charCodeAt(0) - b.name.charCodeAt(0);
        });
        this.games = games.data;

        let players = await getPlayers();
        players.data =players.data.sort((a,b)=>
        {
            return a.name.charCodeAt(0) - b.name.charCodeAt(0);
        });
        this.players = players.data;

        let gameInput = document.getElementById("game-input");
        gameInput.innerHTML += `<option value="-1"></option>`;
        for(let game of this.games)
        {
            gameInput.innerHTML += `<option value="${game.gameID}">${game.name}</option>`
        }

        this.addPlayerSelect();

        let addPlayerInput = document.getElementById("add-player");
        addPlayerInput.addEventListener("click", ()=> this.addPlayerSelect());

        let saveMatch = document.getElementById("submit");
        saveMatch.addEventListener("click", ()=> this.saveMatch());
    }

    addPlayerSelect()
    {
        let playersInput = document.getElementById("players");

        let playerOptions = "";

        for(let player of this.players)
        {
            playerOptions += `<option value="${player.playerID}">${player.name}</option>`;
        }

        let newPlayer = `<div class="player">
                            <br class="add-mobile-yes"/>
                            <select class="player-input">
                                <option value="-1"></option>
                                ${playerOptions}
                            </select>
                            <span> played and <br class="add-mobile-yes"</span>
                            <select class="medal-input">
                                <option value="-1"></option>
                                <option value="3">won a gold medal.</option>
                                <option value="2">won a silver medal.</option>
                                <option value="1">won a bronze medal.</option>
                                <option value="0">didn't win a medal.</option>
                            </select>
                            <span class="remove-player" onclick="io.removePlayerSelect(this)">-</span>
                         </div>`;
        newPlayer = document.createRange().createContextualFragment(newPlayer);
        playersInput.appendChild(newPlayer.firstChild);
}

    removePlayerSelect(element)
    {
        element.parentElement.parentElement.remove();
    }

    saveMatch()
    {
        //get game ID
        let gameID = document.getElementById("game-input").value;

        //error check game
        if(gameID == -1)
        {
            alert("Please select a game");
            return
        }

        let players = [];
        let playersEl = document.querySelectorAll(".player");
        for(let playerEl of playersEl)
        {
            //get player ID's
            let playerID = playerEl.querySelectorAll(".player-input")[0].value;
            //get scores for players
            let score = playerEl.querySelectorAll(".medal-input")[0].value;

            //error check player
            if(playerID == -1)
            {
                alert("Please select a player");
                return
            }

            //error check score
            if(score == -1)
            {
                alert("Please select a medal");
                return
            }

            players.push
            (
                {
                    playerID: playerID,
                    score: score
                }
            );
        }

        let data =
            {
                gameID: gameID,
                players: players
            };

        addMatch(data)
            .then((res)=>
            {
                if(res.result) location.reload();
                else alert("There was an error. Please reload the page.")
            });
    }
}