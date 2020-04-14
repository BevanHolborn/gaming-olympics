Chart.defaults.global.defaultFontFamily = "Open Sans, Helvetica, sans-serif";

class Graph
{
    constructor(selector, data)
    {
        this.selector = selector;
        this.data = data;
        this.context = null;
        this.chart = null;

        this.INIT();
    }

    INIT()
    {
        this.context = document.querySelectorAll(this.selector)[0].getContext('2d');
        this.chart = new Chart(this.context, this.data);
    }
}

class OverallMedalsGraph extends Graph
{
    constructor(selector, values)
    {
        let graphData = {};

        for(let score of values.scores)
        {
            if(graphData[score.player] == null)
            {
                graphData[score.player] =
                    {
                        player: score.player,

                        goldTotal: 0,
                        silverTotal: 0,
                        bronzeTotal: 0
                    }
            }

            if(score.score == 3) graphData[score.player].goldTotal++;
            else if(score.score == 2) graphData[score.player].silverTotal++;
            else if(score.score == 1) graphData[score.player].bronzeTotal++;
        }

        graphData = Object.values(graphData);

        graphData.sort((v1, v2)=>
        {
            return v1.player - v2.player;
        });

        //Overall medals
        let data =
            {
                type: 'bar',
                data:
                    {
                        labels: graphData.map((d) => {return d.player}),
                        datasets:
                            [
                                {
                                    label: "Gold",
                                    data: graphData.map((d) => {return d.goldTotal}),
                                    backgroundColor:
                                        [
                                            "rgba(255, 206, 86, 0.2)",
                                            "rgba(255, 206, 86, 0.2)",
                                            "rgba(255, 206, 86, 0.2)",
                                            "rgba(255, 206, 86, 0.2)"
                                        ],
                                    borderColor:
                                        [
                                            "rgba(255, 206, 86, 1)",
                                            "rgba(255, 206, 86, 1)",
                                            "rgba(255, 206, 86, 1)",
                                            "rgba(255, 206, 86, 1)"
                                        ],
                                    borderWidth: 1
                                },
                                {
                                    label: "Silver",
                                    data: graphData.map((d) => {return d.silverTotal}),
                                    backgroundColor:
                                        [
                                            "rgba(150, 150, 150, 0.2)",
                                            "rgba(150, 150, 150, 0.2)",
                                            "rgba(150, 150, 150, 0.2)",
                                            "rgba(150, 150, 150, 0.2)"
                                        ],
                                    borderColor:
                                        [
                                            "rgba(48,48,48,0.2)",
                                            "rgba(48,48,48,0.2)",
                                            "rgba(48,48,48,0.2)",
                                            "rgba(48,48,48,0.2)"
                                        ],
                                    borderWidth: 1
                                },
                                {
                                    label: "Bronze",
                                    data: graphData.map((d) => {return d.bronzeTotal}),
                                    backgroundColor:
                                        [
                                            "rgba(130, 89, 19, 0.2)",
                                            "rgba(130, 89, 19, 0.2)",
                                            "rgba(130, 89, 19, 0.2)",
                                            "rgba(130, 89, 19, 0.2)"
                                        ],
                                    borderColor:
                                        [
                                            "rgba(87,61,38,0.20)",
                                            "rgba(87,61,38,0.20)",
                                            "rgba(87,61,38,0.20)",
                                            "rgba(87,61,38,0.20)"
                                        ],
                                    borderWidth: 1
                                }
                            ]
                    },
                options:
                    {
                        scales:
                            {
                                yAxes:
                                    [
                                        {
                                            ticks:
                                                {
                                                    beginAtZero: true,
                                                    callback: function(value, index, values)
                                                    {
                                                        if (Math.floor(value) === value) return value;
                                                    }
                                                }
                                        }
                                    ]
                            }
                    }
            };

        super(selector, data);
    }
}

class OverallStandingsGraph extends Graph
{
    constructor(selector, values)
    {
        let graphData = {};

        for(let score of values.scores)
        {
            if(graphData[score.player] == null)
            {
                graphData[score.player] =
                    {
                        player: score.player,
                        totalScore: 0
                    }
            }

            graphData[score.player].totalScore += parseInt(score.score);
        }

        graphData = Object.values(graphData);

        graphData.sort((v1, v2)=>
        {
            return v1.player - v2.player;
        });

        let data =
            {
                type: 'bar',
                data:
                    {
                        labels: graphData.map((d) => {return d.player}),
                        datasets:
                            [
                                {
                                    label: "Points",
                                    data: graphData.map((d) => {return d.totalScore}),
                                    backgroundColor:
                                        [
                                            "rgba(128, 255, 86, 0.2)",
                                            "rgba(74, 167, 255, 0.2)",
                                            "rgba(230, 71, 255, 0.2)",
                                            "rgba(255, 127, 49, 0.2)"
                                        ],
                                    borderColor:
                                        [
                                            "rgb(128,255,86)",
                                            "rgb(74,167,255)",
                                            "rgb(230,71,255)",
                                            "rgb(255,127,49)"
                                        ],
                                    borderWidth: 1
                                }
                            ]
                    },
                options:
                    {
                        scales:
                            {
                                yAxes:
                                    [
                                        {
                                            ticks:
                                                {
                                                    beginAtZero: true,
                                                    callback: function(value, index, values)
                                                    {
                                                        if (Math.floor(value) === value) return value;
                                                    }
                                                }
                                        }
                                    ]
                            }
                    }
            };

        super(selector, data);
    }
}

class GameGraph extends Graph
{
    constructor(selector, values)
    {
        let graphData = {};

        for(let score of values.scores)
        {
            if(score.game === values.game)
            {
                if(graphData[score.player] == null)
                {
                    graphData[score.player] =
                        {
                            player: score.player,

                            goldTotal: 0,
                            silverTotal: 0,
                            bronzeTotal: 0
                        }
                }

                if(score.score == 3) graphData[score.player].goldTotal++;
                else if(score.score == 2) graphData[score.player].silverTotal++;
                else if(score.score == 1) graphData[score.player].bronzeTotal++;
            }
        }

        graphData = Object.values(graphData);

        graphData.sort((v1, v2)=>
        {
            return v1.player - v2.player;
        });

        let data =
            {
                type: 'bar',
                data:
                    {
                        labels: graphData.map((d) => {return d.player}),
                        datasets:
                            [
                                {
                                    label: "Gold",
                                    data: graphData.map((d) => {return d.goldTotal}),
                                    backgroundColor:
                                        [
                                            "rgba(255, 206, 86, 0.2)",
                                            "rgba(255, 206, 86, 0.2)",
                                            "rgba(255, 206, 86, 0.2)",
                                            "rgba(255, 206, 86, 0.2)"
                                        ],
                                    borderColor:
                                        [
                                            "rgba(255, 206, 86, 1)",
                                            "rgba(255, 206, 86, 1)",
                                            "rgba(255, 206, 86, 1)",
                                            "rgba(255, 206, 86, 1)"
                                        ],
                                    borderWidth: 1
                                },
                                {
                                    label: "Silver",
                                    data: graphData.map((d) => {return d.silverTotal}),
                                    backgroundColor:
                                        [
                                            "rgba(150, 150, 150, 0.2)",
                                            "rgba(150, 150, 150, 0.2)",
                                            "rgba(150, 150, 150, 0.2)",
                                            "rgba(150, 150, 150, 0.2)"
                                        ],
                                    borderColor:
                                        [
                                            "rgba(48,48,48,0.2)",
                                            "rgba(48,48,48,0.2)",
                                            "rgba(48,48,48,0.2)",
                                            "rgba(48,48,48,0.2)"
                                        ],
                                    borderWidth: 1
                                },
                                {
                                    label: "Bronze",
                                    data: graphData.map((d) => {return d.bronzeTotal}),
                                    backgroundColor:
                                        [
                                            "rgba(130, 89, 19, 0.2)",
                                            "rgba(130, 89, 19, 0.2)",
                                            "rgba(130, 89, 19, 0.2)",
                                            "rgba(130, 89, 19, 0.2)"
                                        ],
                                    borderColor:
                                        [
                                            "rgba(87,61,38,0.20)",
                                            "rgba(87,61,38,0.20)",
                                            "rgba(87,61,38,0.20)",
                                            "rgba(87,61,38,0.20)"
                                        ],
                                    borderWidth: 1
                                }
                            ]
                    },
                options:
                    {
                        scales:
                            {
                                yAxes:
                                    [
                                        {
                                            ticks:
                                                {
                                                    beginAtZero: true,
                                                    callback: function(value, index, values)
                                                    {
                                                        if (Math.floor(value) === value) return value;
                                                    }
                                                }
                                        }
                                    ]
                            }
                    }
            };

        super(selector, data);
    }
}