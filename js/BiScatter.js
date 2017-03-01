$("#selectedVarLabel1").html("X: position");
$("#selectedVarLabel2").html("Y: points");
$("#selectedSeasonLabel").html("Season: 2015/16");

var varSelection1 = "position";
var varSelection2 = "points";
var seasonSelection = 2015;
var varColor = "#2349d1";

function selectVar1(selectedVar, color) {
    $("#selectedVarLabel1").html("X: " + selectedVar);
    varSelection1 = selectedVar;
    varColor = color;
    loadData(varSelection1, varSelection2, seasonSelection, varColor, 1);
    return false;
}
function selectVar2(selectedVar, color) {
    $("#selectedVarLabel2").html("Y: " + selectedVar);
    varSelection2 = selectedVar;
    varColor = color;
    loadData(varSelection1, varSelection2, seasonSelection, varColor, 1);
    return false;
}
function decreaseSlider()
{
    $("#seasonSlider").val(parseInt($("#seasonSlider").val())-1);  
    $("#seasonSlider").trigger('change');
}
function selectSeason(value) {
    seasonSelection = 2015 - value;
    $("#selectedSeasonLabel").html("Season: " + seasonSelection + "/"+ (seasonSelection+1));
    loadData(varSelection1, varSelection2, seasonSelection, varColor, 1);
}
function increaseSlider() {
    $("#seasonSlider").val(parseInt($("#seasonSlider").val())+1);  
    $("#seasonSlider").trigger('change');
}
loadData(varSelection1, varSelection2, seasonSelection, varColor, 0);

function loadData(dataVar1, dataVar2, season, color, loadChoice)
{
    d3.csv("data/AllPLTables.csv", function(d){
        return {
            teamName: d["Team Name"],
            year: +d.Year,
            position: +d.Position,
            points: +d.Points,
            gamesPlayed: +d["Games Played"],
            gamesWon: +d["Games Won"],
            gamesDrawn: +d["Games Drawn"],
            gamesLost: +d["Games Lost"],
            goalsScored: +d["Goals Scored"],
            goalsConceded: +d["Goals Conceded"],
            goalDifference: +d["Goal Difference"],
            cleanSheets: +d["Clean Sheets"],
            yellowCards: +d["Yellow Cards"]
        };
    }, attr = function(dataset) {
        console.log(dataset);

        var dataSelection1 = [];
        var dataSelection2 = [];
        var teams = [];
        var seasonConversion = (season - 2015)*(-1);
        console.log(seasonConversion);
        var seasonIndex = 20*seasonConversion;
        console.log(seasonIndex);
        
        if(season == 1992 || season == 1993 || season == 1994) {
            if(season == 1994) {
                seasonIndex = 420;
            }
            if(season == 1993) {
                seasonIndex = 442;
            }
            if(season == 1992) {
                seasonIndex = 464;
            }
            for(var index = 20; index < 22; index++) {
                dataSelection1[index] = dataset[index + seasonIndex][dataVar1];
                dataSelection2[index] = dataset[index + seasonIndex][dataVar2];
                teams[index] = dataset[index + seasonIndex]["teamName"];
            }
        }
                    
        for(var index = 0; index < 20; index++) { //make array for each var
            dataSelection1[index] = dataset[index + seasonIndex][dataVar1];
            dataSelection2[index] = dataset[index + seasonIndex][dataVar2];
            teams[index] = dataset[index + seasonIndex]["teamName"];
        }
        
        dataSelection = [];
        for(var index = 0; index < dataSelection1.length; index++) {
            dataSelection[index] = [dataSelection1[index], dataSelection2[index]];
        }
        console.log(dataSelection);
        console.log(dataSelection1);
        console.log(dataSelection2);
        console.log(teams);
            
        if(loadChoice == 1) {
            d3.select("#biScatter").select("svg").remove();
        }

        var chartMargin = {top: 20, right: 20, bottom: 70, left: 40}
        var chartHeight = 450 - chartMargin.top - chartMargin.bottom;
        var chartWidth = 800 - chartMargin.left - chartMargin.right;

        var xScale = d3.scale.linear()
            .domain([d3.min(dataSelection1)>0?0:d3.min(dataSelection1), d3.max(dataSelection1)])
            .range([0, chartWidth]);
        
        var yScale = d3.scale.linear()
            .domain([d3.min(dataSelection2)>0?0:d3.min(dataSelection2), d3.max(dataSelection2)])
            .range([chartHeight,0]);
        
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(dataSelection1.length);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(dataSelection2.length);

        var highlightDot = function(d) {
            tooltip.show(d);
            d3.select(this).transition().duration(150)
                .style('fill', "#00e5ff")
                .attr("r", 12);
        };

        var unhighlightDot = function(d) {
            tooltip.hide(d);
            d3.select(this).transition().duration(150)
                .style("fill", color)
                .attr("r", 8);
        };
        var chart = d3.select("#biScatter");
        
        var svg = chart.append("svg")
            .attr("width", chartWidth + chartMargin.left + chartMargin.right)
            .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
            .style("background", "#ffffff") //chart background color
            .append("g")
            .attr("transform", "translate(" + chartMargin.left + "," +chartMargin.top + ")");
        
        svg.append("g")
            .attr("transform", "translate(0," +chartHeight + ")")
            .attr("class", "x axis")
            .transition().duration(2000)
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .transition().duration(2000)
            .call(yAxis);
        
        var dots = svg.selectAll("scatter-dots").data(dataSelection);
        dots.enter().append("circle");
        dots.style('fill', color)
            .attr("cx", function (d,i) { return xScale(d[0]); } )
            .attr("cy", function (d) { return yScale(d[1]); } )
            .attr("r", 0)
            .attr('pointer-events', 'none')
            .on('mouseover', highlightDot)
            .on('mouseout', unhighlightDot);
        
        
        var tooltip = d3.tip()
          .attr('class', 'd3-tip')
          .html(function(d, i) {
              return "<p>" + teams[dataSelection1.indexOf(d[0])] + ": "+  d + "</p>";
        });

        dots.call(tooltip);
        
        dots.transition()
            .duration(500)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("r", 8)
            .transition().attr('pointer-events', '');
    });
}
