class Nav
{
    constructor()
    {
        this.games = null;
        this.scrolling = false;
    }

    async INIT()
    {
        let games = await getGames();
        games.data = games.data.sort((a,b)=>
        {
            return a.name.charCodeAt(0) - b.name.charCodeAt(0);
        });
        this.games = games.data;

        let gameNav = document.querySelectorAll("#nav-games .nav-secondary")[0];
        let gameStats = document.querySelectorAll(".game-stats");
        for(let index = 0; index < gameStats.length; index++)
        {
            let gameName = gameStats[index].dataset.navPointName;
            let refEl = document.getElementById(`standings-game-${index}-heading`);
            if(refEl) gameNav.innerHTML += `<li><a href="#standings-game-${index}-heading">${gameName}</a></li>`
        }

        let navLinks = document.querySelectorAll("nav a");
        for(let link of navLinks)
        {
            link.addEventListener("click", (e)=>
            {
                e.preventDefault();
                let targetElement = document.querySelectorAll(link.getAttribute("href"))[0];
                targetElement.scrollIntoView
                (
                    {
                        behavior: "smooth"
                    }
                );
            });
        }

        document.addEventListener("scroll",() =>
        {
            this.scrolling = true;
        });

        setInterval(() =>
        {
            if (this.scrolling)
            {
                this.scrolling = false;
                this.scroll()
            }
        },300);

        window.scroll(0, window.scrollY);
    }

    scroll()
    {
        let smallestNegativeZeroElement = null;
        let navPoints = document.querySelectorAll(".nav-point");
        for(let point of navPoints)
        {
            if(point.getBoundingClientRect().top <= 1)
            {
                if(smallestNegativeZeroElement === null) smallestNegativeZeroElement = point;
                else if(point.getBoundingClientRect().top >= smallestNegativeZeroElement.getBoundingClientRect().top) smallestNegativeZeroElement = point;
            }
        }

        if(smallestNegativeZeroElement == null) smallestNegativeZeroElement = document.getElementById("standings");

        //remove all bold
        let navAll = document.querySelectorAll("nav *");
        for(let el of navAll)
        {
            el.classList.remove("focus");
        }

        let link = document.querySelectorAll("a[href='#" + smallestNegativeZeroElement.id + "']")[0];
        //console.log(link);

        link.classList.add("focus");
        link.parentElement.parentElement.parentElement.previousElementSibling.classList.add("focus");
    }
}