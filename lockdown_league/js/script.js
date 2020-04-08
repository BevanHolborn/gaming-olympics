fetch("data/show.json")
    .then((res)=>
    {
        return res.json();
    })
    .then((res)=>
    {
        INIT(res)
    });

function INIT(data)
{
    //setup timer loop (includes live update)
    let timestampNow;
    let startTimestamp = Math.floor(new Date(Date.parse(data.startDatetime)).getTime() / 1000);

    let timer = setInterval(()=>
    {
        timestampNow = Math.floor(Date.now() / 1000);
        let secondsRemaining = startTimestamp - timestampNow;
        let hours = Math.floor(secondsRemaining / 60 / 60);
        let minutes = Math.floor((secondsRemaining / 60) - (hours * 60));
        let seconds = Math.floor(secondsRemaining - (hours * 60 * 60) - (minutes * 60));

        if(hours.toString().length == 1) hours = "0" + hours;
        if(minutes.toString().length == 1) minutes = "0" + minutes;
        if(seconds.toString().length == 1) seconds = "0" + seconds;

        if(hours <= 0) hours = "00";
        if(minutes <= 0) minutes = "00";
        if(seconds <= 0) seconds = "00";

        let text;
        if(hours == "00" && minutes == "00" && seconds == "00")
        {
            text = "Live Now";
            clearInterval(timer)
        }
        else text = hours + ":" + minutes + ":" + seconds;

        document.querySelectorAll("#time-remaining")[0].textContent = text

    }, 1000);

    //set scheduled time
    document.querySelectorAll("#live-time")[0].textContent = data.startTime;

    //add events
    let docket = document.querySelectorAll("#docket")[0];
    for(let event of data.events)
    {
        docket.innerHTML += buildEvent(event);
    }
}

function buildEvent(data)
{
    return `<div class="col-9 event">
        <div class="row ">
            <div class="col-3 f-left event-icon">
                <img src="${data.eventIcon}" alt="Event Icon">
            </div>
            <div class="col-7 event-name"><span>${data.eventName}</span></div>
            <div class="event-time f-right"><span>${data.eventTime}</span></div>
            <div class="col-7 event-details"><span>${data.eventDescription}</span></div>
        </div>
    </div>`
}