class Olympics
{
    constructor()
    {
        this.scores = null;
        this.players = null;
    }

    async INIT()
    {
        let scores = await getScores();
        let players = await getPlayers();
        this.scores = scores.data;
        this.players = players.data;
        this.createGraphs();
        this.createTables();
    }

    createGraphs()
    {
        let standingsGraphValues =
            {
                scores: this.scores
            };
        new OverallStandingsGraph("#standings-overall > #standings > canvas", standingsGraphValues);


        let medalsGraphValues =
            {
                scores: this.scores
            };
        new OverallMedalsGraph("#standings-overall > #medals > canvas", medalsGraphValues);

        let games = {};
        for(let score of this.scores)
        {
            //if game not added
            if(games[score.game] == null)
            {
                games[score.game] =
                    {
                        game: score.game
                    };
            }
        }
        games = Object.values(games);
        games = games.sort((a,b)=>
        {
            return a.game.charCodeAt(0) - b.game.charCodeAt(0);
        });

        for(let index = 0; index < games.length; index++)
        {
            let game = games[index];

            let gameGraphValues =
            {
                game: game.game,
                scores: this.scores
            };

            let newDiv = document.createElement("div");
            newDiv.classList.add("graph-container");
            newDiv.classList.add("nav-point");
            newDiv.classList.add("nav-h2");
            newDiv.classList.add("game-stats");
            newDiv.id = "standings-game-" + index + "-heading";
            newDiv.setAttribute("data-nav-point-name", game.game);

            let newHeading = document.createElement("h3");
            newHeading.innerText = game.game;
            newDiv.appendChild(newHeading);

            let newCanvas = document.createElement("canvas");
            newCanvas.id = "standings-game-" + index;
            newDiv.appendChild(newCanvas);
            document.querySelectorAll("#standings-games")[0].appendChild(newDiv);

            new GameGraph("#standings-games > div > #" + newCanvas.id, gameGraphValues);
        }
    }

    createTables()
    {
        let matchesThead = document.querySelectorAll("#matches thead tr")[0];
        for(let player of this.players)
        {
            matchesThead.innerHTML += `<th>${player.name}</th>`;
        }

        let matches = {};
        for(let score of this.scores)
        {
            //if game not added
            if(matches[score.matchID] == null)
            {
                matches[score.matchID] =
                    {
                        matchID: score.matchID,
                        game: score.game
                    };
            }

            matches[score.matchID][score.player] = score.score;
        }

        matches = Object.values(matches);
        matches = matches.sort((a,b)=>
        {
            return parseInt(a.matchID) - parseInt(b.matchID);
        });

        let matchesTbody = document.querySelectorAll("#matches tbody")[0];
        for(let match of matches)
        {
            matchesTbody.innerHTML += `<tr>
                                        <th>${match.game}</th>
                                        <td>${match[this.players[0].name]}</td>
                                        <td>${match[this.players[1].name]}</td>
                                        <td>${match[this.players[2].name]}</td>
                                        <td>${match[this.players[3].name]}</td>
                                       </tr>`;
        }
    }
}