function draw_bar_graph (){
	$("#chart").empty();
	
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 950 - margin.left - margin.right,
		height = 570 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);
		
	var y = d3.scale.linear()
	.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

	var svg = d3.select("#chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	var chart = $("#chart"),
		aspect = chart.width() / chart.height(),
		container = chart.parent();
	$(window).on("resize", function() {
    var targetWidth = container.width();
		chart.attr("width", targetWidth);
		chart.attr("height", Math.round(targetWidth / aspect));
	}).trigger("resize");

	d3.csv("person2.csv", type, function(error, data) {
	  x.domain(data.map(function(d) { return d.short_name; }));
	  y.domain([0, d3.max(data, function(d) { return d.step_count; })]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		  .append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end");
		  //.text("Citations");

	  svg.selectAll(".bar")
		  .data(data)
		.enter().append("rect")
		  .attr("class", "bar")
		  .attr("x", function(d) { return x(d.short_name); })
		  .attr("width", x.rangeBand())
		  .attr("y", function(d) { return y(d.step_count); })
		  .attr("height", function(d) { return height - y(d.step_count); });

});};

function type(d) {
  d.step_count = +d.step_count;
  return d;
}

function draw_line_chart() {
	$("#chart").empty();
	
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 950 - margin.left - margin.right,
		height = 570 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%d-%b-%y").parse;

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.line()
		.x(function(d) { return x(d.Timestamp); })
		.y(function(d) { return y(d.step_count); });

	var svg = d3.select("#chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	var chart = $("#chart"),
		aspect = chart.width() / chart.height(),
		container = chart.parent();
	$(window).on("resize", function() {
    var targetWidth = container.width();
		chart.attr("width", targetWidth);
		chart.attr("height", Math.round(targetWidth / aspect));
	}).trigger("resize");

	d3.csv("person2.csv", function(error, data) {
	  data.forEach(function(d) {
		d.Timestamp = parseDate(d.Timestamp);
		d.step_count = +d.step_count;
	  });

	  x.domain(d3.extent(data, function(d) { return d.Timestamp; }));
	  y.domain(d3.extent(data, function(d) { return d.step_count; }));

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Step Count");

	  svg.append("path")
		  .datum(data)
		  .attr("class", "line")
		  .attr("d", line);
});};
