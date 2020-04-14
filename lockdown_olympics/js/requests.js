function getScores()
{
    return sendRequest("getScores", null);
}

function getGames()
{
    return sendRequest("getGames", null);
}

function getPlayers()
{
    return sendRequest("getPlayers", null);
}

function addMatch(data)
{
    return sendRequest("addMatch", data);
}

//sends a payload to the server and run a callback on server response
async function sendRequest(action, data,)
{
    //build payload
    let payload =
        {
            action : action,
            data : data,
            APIKey : localStorage.getItem("APIKey")
        };

    if(payload.data == null) delete payload.data;
    if(payload.APIKey == null) delete payload.APIKey;

    let response = await fetch("api.php",
        {
            method: "post",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

    return await response.json();
}
