var parcoords = d3.parcoords()("#paraCoor")
            .color("#2349d1")
            .alpha(0.4);

loadData();

function loadData(season, loadChoice)
{
    d3.csv("data/AllPLTables.csv", function(d){
        return {
            Points: +d.Points,
            Won: +d["Games Won"],
            Scored: +d["Goals Scored"],
            Difference: +d["Goal Difference"],
            Drawn: +d["Games Drawn"],
            Lost: +d["Games Lost"],
            Conceded: +d["Goals Conceded"],
            CleanSheets: +d["Clean Sheets"],
            Yellows: +d["Yellow Cards"],
            Position: +d.Position
        };
    }, attr = function(dataset) {
        console.log(dataset);
        parcoords
            .data(dataset)
            .render()
            .brushMode("1D-axes");
    });
}