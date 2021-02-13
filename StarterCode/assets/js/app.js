// @TODO: YOUR CODE HERE!

// Create SVG container
const svgHeight = 500;
const svgWidth = 950;


// Margins
const margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

// chart area minus margins
const height = svgHeight - margin.top - margin.bottom;
const width = svgWidth - margin.left - margin.right;


// Create SVG container
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

// shift everything over by the margins
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(allData) {

    // Parse data and cast data as numbers
    allData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Create scale functions
    const xLinearScale = d3.scaleLinear()
        .domain([d3.min(allData, d => d.poverty)-0.5, d3.max(allData, d => d.poverty)+2])
        .range([0, width]);

    const yLinearScale = d3.scaleLinear()
        .domain([d3.min(allData, d => d.healthcare)-1, d3.max(allData, d => d.healthcare)+2])
        .range([height, 0]);

    // Create axis functions
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create cirlces and labels
    const circlesGroup = chartGroup.selectAll("g.dot")
      .data(allData)
      .enter()
      .append("g");

    circlesGroup.append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "14")
      .attr("class", "stateCircle");
    
    // Add text to bubbles
    circlesGroup.append("text")
      .text(d=>d.abbr)
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare)+5)
      .attr("class", "stateText");

    const toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
      });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      circlesGroup.style.cursor = "pointer";
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 5})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
    

  }).catch(function(error) {
    console.log(error);
  });
