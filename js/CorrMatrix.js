loadData();

function loadData()
{
    d3.csv("data/PLcorrmatrix.csv", function(d){
        return {
            position: +d.Position,
            points: +d.Points,
            gamesWon: +d["Games.Won"],
            gamesDrawn: +d["Games.Drawn"],
            gamesLost: +d["Games.Lost"],
            goalsScored: +d["Goals.Scored"],
            goalsConceded: +d["Goals.Conceded"],
            goalDifference: +d["Goal.Difference"],
            cleanSheets: +d["Clean.Sheets"],
            yellowCards: +d["Yellow.Cards"]
        };
    }, attr = function(dataset) {
        console.log(dataset[0]);
        
        var attributes = ["position", "points", "gamesWon", "gamesDrawn", "gamesLost", "goalsScored",
                         "goalsConceded", "goalDifference", "cleanSheets", "yellowCards"];
        //create empty matrix
        var corrmatrix = [];
        for(var i = 0; i <10; i++){ 
            corrmatrix[i] = [];
        }
        //set matrix values
        var xPos = 1;
        var yPos = 1;
        var squareWidth = 40;
        var squareHeight = 40;
        for(var i = 0; i < 10; i++) { 
            for(var j = 0; j < 10; j++) {
                corrmatrix[i].push({
                    value: dataset[i][attributes[j]],
                    x: xPos,
                    y: 362-yPos
                });
                xPos+=squareWidth;
            }
            xPos = 1;
            yPos += squareHeight;
        }
        console.log(corrmatrix);

        var chartMargin = {top: 80, right: 20, bottom: 70, left: 100}
        var chartHeight = 550 - chartMargin.top - chartMargin.bottom;
        var chartWidth = 520 - chartMargin.left - chartMargin.right;

        var xScale = d3.scale.linear()
            .domain([1,10])
            .range([0, chartWidth-60]);

        var yScaleInverted = d3.scale.linear()
            .domain([1,10])
            .range([chartHeight,30]);
        
        var colorScale = d3.scale.linear()
            .domain([-1, 0, 1])
            .range(['#4f40fb','white','#fc291c']);
        
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(function(d,i){ return attributes[i] });

        var yAxis = d3.svg.axis()
            .scale(yScaleInverted)
            .orient("left")
            .tickFormat(function(d,i){ return attributes[i] });

        var highlightSquare = function(d) {
            tooltip.show(d);
            d3.select(this).transition().duration(150)
                .style('fill', "#00e5ff");
            d3.selectAll("text")
                .attr("fill", "green");
        };

        var unhighlightSquare = function(d) {
            tooltip.hide(d);
            d3.select(this).transition().duration(150)
                .style('fill', function(d) {
                    return colorScale(d.value);
                });
        };
        var chart = d3.select("#corrMatrix");
        
        var svg = chart.append("svg")
            .attr("width", chartWidth + chartMargin.left + chartMargin.right)
            .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
            .style("background", "#ffffff") //chart background color
            .append("g")
            .attr("transform", "translate(" + chartMargin.left + "," +chartMargin.top + ")");
        
        var row = svg.selectAll(".r")
            .data(corrmatrix)
            .enter().append("g")
            .attr("class", "r");
        
        var column = row.selectAll(".square")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("class","square")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("width", 0)
            .attr("height", 0)
            .style("fill", "#fff")
            .style("stroke", "#fff")
            .on('mouseover', highlightSquare)
            .on('mouseout', unhighlightSquare);
        
        svg.append("g")
            .attr("transform", "translate(0," +chartHeight + ")")
            .attr("class", "x axis")
            .transition().duration(1000)
            .call(xAxis)
            .selectAll("text")
                .attr("transform", "rotate(-30) translate(0,20)");
        svg.append("g")
            .attr("class", "y axis")
            .transition().duration(1000)
            .call(yAxis)
            .selectAll("text")
                .attr("transform", "rotate(30)" );

        var tooltip = d3.tip()
          .attr('class', 'd3-tip')
          .html(function(d, i) {
              return "<p>" +  d.value + "</p>";
        });

        column.call(tooltip);
        
        column.transition()
            .duration(500)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("width", squareWidth)
            .attr("height", squareHeight)
            .style('fill', function(d) {
                return colorScale(d.value);
            })
            .transition().attr('pointer-events', '');
    });
}
