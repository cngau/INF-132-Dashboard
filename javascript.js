/* $(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

}); */

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

function draw_aster_plot() {
	$("#chart").empty();
	
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 950 - margin.left - margin.right,
		height = 570 - margin.top - margin.bottom;
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);
		
	var y = d3.scale.linear()
		.range([height, 0]);
		
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.width; });

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([0, 0])
	  .html(function(d) {
		return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
	  });

	var arc = d3.svg.arc()
	  .innerRadius(innerRadius)
	  .outerRadius(function (d) { 
		return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
	  });

	var outlineArc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(radius);

	var svg = d3.select("#chart").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	svg.call(tip);

	var chart = $("#chart"),
		aspect = chart.width() / chart.height(),
		container = chart.parent();
	$(window).on("resize", function() {
    var targetWidth = container.width();
		chart.attr("width", targetWidth);
		chart.attr("height", Math.round(targetWidth / aspect));
	}).trigger("resize");
	
	d3.csv('aster_data.csv', function(error, data) {

	  data.forEach(function(d) {
		d.id     =  d.id;
		d.order  = +d.order;
		d.color  =  d.color;
		d.weight = +d.weight;
		d.score  = +d.score;
		d.width  = +d.weight;
		d.label  =  d.label;
	  });
	  // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }
	  
	  var path = svg.selectAll(".solidArc")
		  .data(pie(data))
		.enter().append("path")
		  .attr("fill", function(d) { return d.data.color; })
		  .attr("class", "solidArc")
		  .attr("stroke", "gray")
		  .attr("d", arc)
		  .on('mouseover', tip.show)
		  .on('mouseout', tip.hide);

	  var outerPath = svg.selectAll(".outlineArc")
		  .data(pie(data))
		.enter().append("path")
		  .attr("fill", "none")
		  .attr("stroke", "gray")
		  .attr("class", "outlineArc")
		  .attr("d", outlineArc);  


	  // calculate the weighted mean score
	  var score = 
		data.reduce(function(a, b) {
		  //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
		  return a + (b.score * b.weight); 
		}, 0) / 
		data.reduce(function(a, b) { 
		  return a + b.weight; 
		}, 0);

	  svg.append("svg:text")
		.attr("class", "aster-score")
		.attr("dy", ".35em")
		.attr("text-anchor", "middle") // text-align: right
		.text(Math.round(score));

	});
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
