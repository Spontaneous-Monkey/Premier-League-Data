$("#selectedVarLabel").html("Variable: points");
$("#selectedSeasonLabel").html("Season: 2015/16");

var varSelection = "points";
var seasonSelection = 2015;
var varColor = "#2349d1";

function selectVar(selectedVar, color) {
    $("#selectedVarLabel").html("Variable: " + selectedVar);
    varSelection = selectedVar;
    varColor = color;
    loadData(varSelection, seasonSelection, varColor, 1);
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
    loadData(varSelection, seasonSelection, varColor, 1);
}
function increaseSlider() {
    $("#seasonSlider").val(parseInt($("#seasonSlider").val())+1);  
    $("#seasonSlider").trigger('change');
}
loadData(varSelection, seasonSelection, varColor, 0);

function loadData(dataVar, season, color, loadChoice)
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

        var dataSelection = [];
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
                dataSelection[index] = dataset[index + seasonIndex][dataVar];
                teams[index] = dataset[index + seasonIndex]["teamName"];
            }
        }
                    
        for(var index = 0; index < 20; index++) { //change the condition in for to get different range
            dataSelection[index] = dataset[index + seasonIndex][dataVar];
            teams[index] = dataset[index + seasonIndex]["teamName"];
        }
        
        console.log(dataSelection);
        console.log(teams);

        if(loadChoice == 1) {
            d3.select("#barChart").select("svg").remove();
        }
        var chartMargin = {top: 20, right: 20, bottom: 70, left: 40}
        var chartHeight = 450 - chartMargin.top - chartMargin.bottom;
        var chartWidth = 800 - chartMargin.left - chartMargin.right;

        var xScale = d3.scale.ordinal()
            .domain(d3.range(0, dataSelection.length))
            .rangeBands([0, chartWidth]);
        
        var yScale = d3.scale.linear()
            .domain([0, d3.max(dataSelection)])
            .range([0, chartHeight]);
        var yScaleInverted = d3.scale.linear()
            .domain([0, d3.max(dataSelection)])
            .range([chartHeight, 0]);
        
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScaleInverted)
            .orient("left");

        var highlightBar = function(d) {
            tooltip.show(d);
            d3.select(this).transition().duration(150)
                .style('fill', "#00e5ff")
                .attr("y", function (d, i) {
                    return chartHeight - yScale(d+5);
                })
                .attr("height", function (d, i) {
                    return yScale(d+5);
                });
        };

        var unhighlightBar = function(d) {
            tooltip.hide(d);
            d3.select(this).transition().duration(150)
                .style("fill", color)
                .attr("y", function (d, i) {
                    return chartHeight - yScale(d);
                })
                .attr("height", function (d, i) {
                    return yScale(d);
                });
        };
        var chart = d3.select("#barChart");
        
        var svg = chart.append("svg")
            .attr("width", chartWidth + chartMargin.left + chartMargin.right)
            .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
            .style("background", "#ffffff") //chart background color
            .append("g")
            .attr("transform", "translate(" + chartMargin.left + "," +chartMargin.top + ")");
        
        svg.append("g")
            .attr("transform", "translate(0," + chartHeight + ")")
            .attr("class", "x axis")
            .transition().duration(2000)
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .transition().duration(2000)
            .call(yAxis);

        var bars = svg.selectAll("rect").data(dataSelection);
        bars.enter().append("rect");
        bars.style('fill', color)
            .attr('width', xScale.rangeBand()-1)
            .attr('height', 0)
            .attr('x', function(d, i){
                return xScale(i);
            })
            .attr('y', chartHeight)
            .attr('pointer-events', 'none')
            .on('mouseover', highlightBar)
            .on('mouseout', unhighlightBar);
        
        
        var tooltip = d3.tip()
          .attr('class', 'd3-tip')
          .html(function(d, i) {
              return "<p>" + teams[dataSelection.indexOf(d)] + ": "+  d + "</p>";
        });

        bars.call(tooltip);
        
        bars.transition()
            .duration(500)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("y", function (d, i) {
                return chartHeight - yScale(d);
            })
            .attr("height", function (d, i) {
                return yScale(d);
            })
            .transition().attr('pointer-events', '');
    });
}
