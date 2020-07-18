var svgWidth = 600;
var svgHeight = 500;

var margin = {
  top: 80,
  right: 40,
  bottom: 80,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(dabblerData, err) {
    if (err) throw err;

    console.log(dabblerData);

    // parse data
    dabblerData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    });

    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(dabblerData, d => d.poverty))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(dabblerData, d => d.healthcare)])
        .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)

    chartGroup.append("g")
        .call(yAxis)

    // add axes labels
    svg.append("text")             
        .attr("transform", "translate(" + (width/1.6) + " ," + 
                            (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("Living in Poverty (%)");
    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Lacks Healthcare (%)");

    // add title
    svg.append("text")
        .attr("transform", "translate(" + (width/1.6) + " ," + 
            (height + margin.top - 400) + ")")            
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Poverty vs Access to Healthcare (% by State)");

  // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(dabblerData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", ".5")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

    // THESE LABELS DON'T WORK!!!!!!!!!!!!
    var text = circlesGroup.selectAll("text")
        .data(dabblerData)
        .enter()
        .append("circle");

    var textLabels = text
        .attr("x", function(d) {return d.cx;})
        .attr("y", function(d) {return d.cy;})
        .text(function(d) {return "test";})
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "black");

    // FIX TITLE, FIX LABELS, ADD TICKERS!!!!


});
