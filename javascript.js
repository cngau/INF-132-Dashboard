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

function erase_canvas (){
	$("#chart").empty();
	empty_tri_graph();
}

function draw_bar_graph (){
	$("#chart").empty();
	empty_tri_graph();
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
	
	});
	write_description("bar");
};

function type(d) {
  d.step_count = +d.step_count;
  return d;
}

function draw_aster_plot() {
	$("#chart").empty();
	empty_tri_graph();
	
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
	write_description("aster");
}

function draw_line_chart() {
	$("#chart").empty();
	empty_tri_graph();
	
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
	});
	write_description("line");
};

function draw_tri_graph() {
	$("#chart").empty();
	empty_tri_graph();
	
	write_description("tri");
	
	var pieDiv = document.createElement('div');
	pieDiv.id = 'pieChart';
	document.getElementById('canvas').appendChild(pieDiv);
	var barDiv = document.createElement('div');
	barDiv.id = 'barChart';
	document.getElementById('canvas').appendChild(barDiv);
	var lineDiv = document.createElement('div');
	lineDiv.id = 'lineChart';
	document.getElementById('canvas').appendChild(lineDiv);
	
	/*
	################ FORMATS ##################
	-------------------------------------------
	*/


	var 	formatAsPercentage = d3.format("%"),
			formatAsPercentage1Dec = d3.format(".1%"),
			formatAsInteger = d3.format(","),
			fsec = d3.time.format("%S s"),
			fmin = d3.time.format("%M m"),
			fhou = d3.time.format("%H h"),
			fwee = d3.time.format("%a"),
			fdat = d3.time.format("%d d"),
			fmon = d3.time.format("%b")
			;

	/*
	############# PIE CHART ###################
	-------------------------------------------
	*/



	function dsPieChart(){
		var dataset = [
				  {category: "Week 1", measure: 0.12},
			  {category: "Week 2", measure: 0.17},
			  {category: "Week 3", measure: 0.19},
			  {category: "Week 4", measure: 0.17},
			  {category: "Week 5", measure: 0.15},
			  {category: "Week 6", measure:0.20}
			  ]
			  ;

		var 	width = 400,
			   height = 400,
			   outerRadius = Math.min(width, height) / 2,
			   innerRadius = outerRadius * .999,   
			   // for animation
			   innerRadiusFinal = outerRadius * .5,
			   innerRadiusFinal3 = outerRadius* .45,
			   color = d3.scale.category20()    //builtin range of colors
			   ;
			
		var vis = d3.select("#pieChart")
			 .append("svg:svg")              //create the SVG element inside the <body>
			 .data([dataset])                   //associate our data with the document
				 .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
				 .attr("height", height)
					.append("svg:g")                //make a group to hold our pie chart
				 .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    //move the center of the pie chart from 0, 0 to radius, radius
					;
					
	   var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
				.outerRadius(outerRadius).innerRadius(innerRadius);
	   
	   // for animation
	   var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
		var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

	   var pie = d3.layout.pie()           //this will create arc data for us given a list of values
			.value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array

	   var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
			.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
			.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
				.append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
				   .attr("class", "slice")    //allow us to style things in the slices (like text)
				   .on("mouseover", mouseover)
						.on("mouseout", mouseout)
						.on("click", up)
						;
						
			arcs.append("svg:path")
				   .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
				   .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
						.append("svg:title") //mouseover title showing the figures
					   .text(function(d) { return d.data.category + ": " + formatAsPercentage(d.data.measure); });			

			d3.selectAll("g.slice").selectAll("path").transition()
					.duration(750)
					.delay(10)
					.attr("d", arcFinal )
					;
		
		  // Add a label to the larger arcs, translated to the arc centroid and rotated.
		  // source: http://bl.ocks.org/1305337#index.html
		  arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
				.append("svg:text")
			  .attr("dy", ".35em")
			  .attr("text-anchor", "middle")
			  .attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
			  //.text(function(d) { return formatAsPercentage(d.value); })
			  .text(function(d) { return d.data.category; })
			  ;
		   
		   // Computes the label angle of an arc, converting from radians to degrees.
			function angle(d) {
				var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
				return a > 90 ? a - 180 : a;
			}
				
			
			// Pie chart title			
			vis.append("svg:text")
				.attr("dy", ".35em")
			  .attr("text-anchor", "middle")
			  .text("Step Count by Week")
			  .attr("class","title")
			  ;		    


			
		function mouseover() {
		  d3.select(this).select("path").transition()
			  .duration(750)
						//.attr("stroke","red")
						//.attr("stroke-width", 1.5)
						.attr("d", arcFinal3)
						;
		}
		
		function mouseout() {
		  d3.select(this).select("path").transition()
			  .duration(750)
						//.attr("stroke","blue")
						//.attr("stroke-width", 1.5)
						.attr("d", arcFinal)
						;
		}
		
		function up(d, i) {
		
					/* update bar chart when user selects piece of the pie chart */
					//updateBarChart(dataset[i].category);
					updateBarChart(d.data.category, color(i));
					updateLineChart(d.data.category, color(i));
				 
		}
	}

	dsPieChart();

	/*
	############# BAR CHART ###################
	-------------------------------------------
	*/

	//366,486 = total steps

	var datasetBarChart = [
	{ group: "All", category: "Monday", measure: 49220}, 
	{ group: "All", category: "Tuesday", measure: 44823 }, 
	{ group: "All", category: "Wednesday", measure: 49304}, 
	{ group: "All", category: "Thursday", measure: 63662 }, 
	{ group: "All", category: "Friday", measure: 48440 },
	{ group: "All", category: "Saturday", measure: 64558}, 
	{ group: "All", category: "Sunday", measure: 46479 }, 
	{ group: "Week 1", category: "Monday", measure: 6441 }, 
	{ group: "Week 1", category: "Tuesday", measure: 6922 }, 
	{ group: "Week 1", category: "Wednesday", measure: 5720 }, 
	{ group: "Week 1", category: "Thursday", measure: 6480 }, 
	{ group: "Week 1", category: "Friday", measure: 5441},
	{ group: "Week 1", category: "Saturday", measure: 7493 }, 
	{ group: "Week 1", category: "Sunday", measure: 4097}, 
	{ group: "Week 2", category: "Monday", measure: 5913 }, 
	{ group: "Week 2", category: "Tuesday", measure: 9637 }, 
	{ group: "Week 2", category: "Wednesday", measure: 7549 }, 
	{ group: "Week 2", category: "Thursday", measure: 11909 }, 
	{ group: "Week 2", category: "Friday", measure: 7637},
	{ group: "Week 2", category: "Saturday", measure: 12493}, 
	{ group: "Week 2", category: "Sunday", measure: 5097 }, 
	{ group: "Week 3", category: "Monday", measure: 7541}, 
	{ group: "Week 3", category: "Tuesday", measure: 8430}, 
	{ group: "Week 3", category: "Wednesday", measure: 7275 }, 
	{ group: "Week 3", category: "Thursday", measure: 12166 }, 
	{ group: "Week 3", category: "Friday", measure: 11803},
	{ group: "Week 3", category: "Saturday", measure: 14493 }, 
	{ group: "Week 3", category: "Sunday", measure: 8097 }, 
	{ group: "Week 4", category: "Monday", measure: 9406 }, 
	{ group: "Week 4", category: "Tuesday", measure: 5545 }, 
	{ group: "Week 4", category: "Wednesday", measure: 10620 }, 
	{ group: "Week 4", category: "Thursday", measure: 10563 }, 
	{ group: "Week 4", category: "Friday", measure: 9008 },
	{ group: "Week 4", category: "Saturday", measure: 10493 }, 
	{ group: "Week 4", category: "Sunday", measure: 6097 }, 
	{ group: "Week 5", category: "Monday", measure: 7637 }, 
	{ group: "Week 5", category: "Tuesday", measure: 5411}, 
	{ group: "Week 5", category: "Wednesday", measure: 8332 }, 
	{ group: "Week 5", category: "Thursday", measure: 10249 }, 
	{ group: "Week 5", category: "Friday", measure: 8803},
	{ group: "Week 5", category: "Saturday", measure: 8493}, 
	{ group: "Week 5", category: "Sunday", measure: 7097 }, 
	{ group: "Week 6", category: "Monday", measure: 12282}, 
	{ group: "Week 6", category: "Tuesday", measure: 8878 }, 
	{ group: "Week 6", category: "Wednesday", measure: 9808 }, 
	{ group: "Week 6", category: "Thursday", measure: 12295}, 
	{ group: "Week 6", category: "Friday", measure: 5748},
	{ group: "Week 6", category: "Saturday", measure: 11093 }, 
	{ group: "Week 6", category: "Sunday", measure: 12598 }
	]
	;

	// set initial group value
	var group = "All";

	function datasetBarChosen(group) {
		var ds = [];
		for (x in datasetBarChart) {
			 if(datasetBarChart[x].group==group){
				ds.push(datasetBarChart[x]);
			 } 
			}
		return ds;
	}


	function dsBarChartBasics() {

			var margin = {top: 30, right: 5, bottom: 20, left: 50},
			width = 500 - margin.left - margin.right,
		   height = 250 - margin.top - margin.bottom,
			colorBar = d3.scale.category20(),
			barPadding = 1
			;
			
			return {
				margin : margin, 
				width : width, 
				height : height, 
				colorBar : colorBar, 
				barPadding : barPadding
			}			
			;
	}

	function dsBarChart() {
		var firstDatasetBarChart = datasetBarChosen(group);         	
		
		var basics = dsBarChartBasics();
		
		var margin = basics.margin,
			width = basics.width,
		   height = basics.height,
			colorBar = basics.colorBar,
			barPadding = basics.barPadding
			;
						
		var 	xScale = d3.scale.linear()
							.domain([0, firstDatasetBarChart.length])
							.range([0, width])
							;
							
		// Create linear y scale 
		// Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
		// get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.  
		var yScale = d3.scale.linear()
				// use the max funtion to derive end point of the domain (max value of the dataset)
				// do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
			   .domain([0, d3.max(firstDatasetBarChart, function(d) { return d.measure; })])
			   // As coordinates are always defined from the top left corner, the y position of the bar
			   // is the svg height minus the data value. So you basically draw the bar starting from the top. 
			   // To have the y position calculated by the range function
			   .range([height, 0])
			   ;
		
		//Create SVG element
		
		var svg = d3.select("#barChart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("id","barChartPlot")
				;
		
		var plot = svg
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				;
					
		plot.selectAll("rect")
			   .data(firstDatasetBarChart)
			   .enter()
			   .append("rect")
				.attr("x", function(d, i) {
					return xScale(i);
				})
			   .attr("width", width / firstDatasetBarChart.length - barPadding)   
				.attr("y", function(d) {
					return yScale(d.measure);
				})  
				.attr("height", function(d) {
					return height-yScale(d.measure);
				})
				.attr("fill", "lightgrey")
				;
		
			
		// Add y labels to plot	
		
		plot.selectAll("text")
		.data(firstDatasetBarChart)
		.enter()
		.append("text")
		.text(function(d) {
				return formatAsInteger(d3.round(d.measure));
		})
		.attr("text-anchor", "middle")
		// Set x position to the left edge of each bar plus half the bar width
		.attr("x", function(d, i) {
				return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
		})
		.attr("y", function(d) {
				return yScale(d.measure) + 14;
		})
		.attr("class", "yAxis")
		/* moved to CSS			   
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
		.attr("fill", "white")
		*/
		;
		
		// Add x labels to chart	
		
		var xLabels = svg
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
				;
		
		xLabels.selectAll("text.xAxis")
			  .data(firstDatasetBarChart)
			  .enter()
			  .append("text")
			  .text(function(d) { return d.category;})
			  .attr("text-anchor", "middle")
				// Set x position to the left edge of each bar plus half the bar width
							   .attr("x", function(d, i) {
									return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
							   })
			  .attr("y", 15)
			  .attr("class", "xAxis")
			  //.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
			  ;			
		 
		// Title
		
		svg.append("text")
			.attr("x", (width + margin.left + margin.right)/2)
			.attr("y", 15)
			.attr("class","title")				
			.attr("text-anchor", "middle")
			.text("Overall Step Count Breakdown")
			;
	}

	dsBarChart();

	 /* ** UPDATE CHART ** */
	 
	/* updates bar chart on request */

	function updateBarChart(group, colorChosen) {
		
			var currentDatasetBarChart = datasetBarChosen(group);
			
			var basics = dsBarChartBasics();
		
			var margin = basics.margin,
				width = basics.width,
			   height = basics.height,
				colorBar = basics.colorBar,
				barPadding = basics.barPadding
				;
			
			var 	xScale = d3.scale.linear()
				.domain([0, currentDatasetBarChart.length])
				.range([0, width])
				;
			
				
			var yScale = d3.scale.linear()
			  .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
			  .range([height,0])
			  ;
			  
		   var svg = d3.select("#chart svg");
			  
		   var plot = d3.select("#barChartPlot")
			.datum(currentDatasetBarChart)
			   ;
		
				/* Note that here we only have to select the elements - no more appending! */
			plot.selectAll("rect")
			  .data(currentDatasetBarChart)
			  .transition()
				.duration(750)
				.attr("x", function(d, i) {
					return xScale(i);
				})
			   .attr("width", width / currentDatasetBarChart.length - barPadding)   
				.attr("y", function(d) {
					return yScale(d.measure);
				})  
				.attr("height", function(d) {
					return height-yScale(d.measure);
				})
				.attr("fill", colorChosen)
				;
			
			plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
				.data(currentDatasetBarChart)
				.transition()
				.duration(750)
			   .attr("text-anchor", "middle")
			   .attr("x", function(d, i) {
					return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
			   })
			   .attr("y", function(d) {
					return yScale(d.measure) + 14;
			   })
			   .text(function(d) {
					return formatAsInteger(d3.round(d.measure));
			   })
			   .attr("class", "yAxis")					 
			;
			

			svg.selectAll("text.title") // target the text element(s) which has a title class defined
				.attr("x", (width + margin.left + margin.right)/2)
				.attr("y", 15)
				.attr("class","title")				
				.attr("text-anchor", "middle")
				.text(group + "'s Step Count Breakdown")
			;
	}


	/*
	############# LINE CHART ##################
	-------------------------------------------
	*/

	var datasetLineChart = [
	{ group: "All", category: "Monday", measure: 49220}, 
	{ group: "All", category: "Tuesday", measure: 44823 }, 
	{ group: "All", category: "Wednesday", measure: 49304}, 
	{ group: "All", category: "Thursday", measure: 63662 }, 
	{ group: "All", category: "Friday", measure: 48440 },
	{ group: "All", category: "Saturday", measure: 64558}, 
	{ group: "All", category: "Sunday", measure: 46479 }, 
	{ group: "Week 1", category: "Monday", measure: 6441 }, 
	{ group: "Week 1", category: "Tuesday", measure: 6922 }, 
	{ group: "Week 1", category: "Wednesday", measure: 5720 }, 
	{ group: "Week 1", category: "Thursday", measure: 6480 }, 
	{ group: "Week 1", category: "Friday", measure: 5441},
	{ group: "Week 1", category: "Saturday", measure: 7493 }, 
	{ group: "Week 1", category: "Sunday", measure: 4097}, 
	{ group: "Week 2", category: "Monday", measure: 5913 }, 
	{ group: "Week 2", category: "Tuesday", measure: 9637 }, 
	{ group: "Week 2", category: "Wednesday", measure: 7549 }, 
	{ group: "Week 2", category: "Thursday", measure: 11909 }, 
	{ group: "Week 2", category: "Friday", measure: 7637},
	{ group: "Week 2", category: "Saturday", measure: 12493}, 
	{ group: "Week 2", category: "Sunday", measure: 5097 }, 
	{ group: "Week 3", category: "Monday", measure: 7541}, 
	{ group: "Week 3", category: "Tuesday", measure: 8430}, 
	{ group: "Week 3", category: "Wednesday", measure: 7275 }, 
	{ group: "Week 3", category: "Thursday", measure: 12166 }, 
	{ group: "Week 3", category: "Friday", measure: 11803},
	{ group: "Week 3", category: "Saturday", measure: 14493 }, 
	{ group: "Week 3", category: "Sunday", measure: 8097 }, 
	{ group: "Week 4", category: "Monday", measure: 9406 }, 
	{ group: "Week 4", category: "Tuesday", measure: 5545 }, 
	{ group: "Week 4", category: "Wednesday", measure: 10620 }, 
	{ group: "Week 4", category: "Thursday", measure: 10563 }, 
	{ group: "Week 4", category: "Friday", measure: 9008 },
	{ group: "Week 4", category: "Saturday", measure: 10493 }, 
	{ group: "Week 4", category: "Sunday", measure: 6097 }, 
	{ group: "Week 5", category: "Monday", measure: 7637 }, 
	{ group: "Week 5", category: "Tuesday", measure: 5411}, 
	{ group: "Week 5", category: "Wednesday", measure: 8332 }, 
	{ group: "Week 5", category: "Thursday", measure: 10249 }, 
	{ group: "Week 5", category: "Friday", measure: 8803},
	{ group: "Week 5", category: "Saturday", measure: 8493}, 
	{ group: "Week 5", category: "Sunday", measure: 7097 }, 
	{ group: "Week 6", category: "Monday", measure: 12282}, 
	{ group: "Week 6", category: "Tuesday", measure: 8878 }, 
	{ group: "Week 6", category: "Wednesday", measure: 9808 }, 
	{ group: "Week 6", category: "Thursday", measure: 12295}, 
	{ group: "Week 6", category: "Friday", measure: 5748},
	{ group: "Week 6", category: "Saturday", measure: 11093 }, 
	{ group: "Week 6", category: "Sunday", measure: 12598 }
	]
	;

	// set initial category value
	var group = "All";

	function datasetLineChartChosen(group) {
		var ds = [];
		for (x in datasetLineChart) {
			 if(datasetLineChart[x].group==group){
				ds.push(datasetLineChart[x]);
			 } 
			}
		return ds;
	}

	function dsLineChartBasics() {

		var margin = {top: 20, right: 10, bottom: 0, left: 50},
			width = 500 - margin.left - margin.right,
			height = 150 - margin.top - margin.bottom
			;
			
			return {
				margin : margin, 
				width : width, 
				height : height
			}			
			;
	}


	function dsLineChart() {
		
		var firstDatasetLineChart = datasetLineChartChosen(group);    
		
		var basics = dsLineChartBasics();
		
		var margin = basics.margin,
			width = basics.width,
		   height = basics.height
			;

		var xScale = d3.scale.linear()
			.domain([0, firstDatasetLineChart.length-1])
			.range([0, width])
			;

		var yScale = d3.scale.linear()
			.domain([0, d3.max(firstDatasetLineChart, function(d) { return d.measure; })])
			.range([height, 0])
			;
		
		var line = d3.svg.line()
			//.x(function(d) { return xScale(d.category); })
			.x(function(d, i) { return xScale(i); })
			.y(function(d) { return yScale(d.measure); })
			;
		
		var svg = d3.select("#lineChart").append("svg")
			.datum(firstDatasetLineChart)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			// create group and move it so that margins are respected (space for axis and title)
			
		var plot = svg
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("id", "lineChartPlot")
			;

			/* descriptive titles as part of plot -- start */
		var dsLength=firstDatasetLineChart.length;
		
			
		plot.append("text")
			//.text(firstDatasetLineChart[dsLength-1].measure) //show last value in set
					.text( function (d) {
						var total=0;
						var temp;
						for(var i=0; i<dsLength; i++){
								//console.log(firstDatasetLineChart[i].measure);
								temp=firstDatasetLineChart[i].measure;
								total= total+temp;
							}
						return total;})
			.attr("id","lineChartTitle2")
			.attr("x",width/2)
			.attr("y",height/2)	
			;
		/* descriptive titles -- end */
			
		plot.append("path")
			.attr("class", "line")
			.attr("d", line)	
			// add color
			.attr("stroke", "lightgrey")
			;
		  
		plot.selectAll(".dot")
			.data(firstDatasetLineChart)
			 .enter().append("circle")
			.attr("class", "dot")
			//.attr("stroke", function (d) { return d.measure==datasetMeasureMin ? "red" : (d.measure==datasetMeasureMax ? "green" : "steelblue") } )
			.attr("fill", function (d) { return d.measure==d3.min(firstDatasetLineChart, function(d) { return d.measure; }) ? "red" : (d.measure==d3.max(firstDatasetLineChart, function(d) { return d.measure; }) ? "green" : "white") } )
			//.attr("stroke-width", function (d) { return d.measure==datasetMeasureMin || d.measure==datasetMeasureMax ? "3px" : "1.5px"} )
			.attr("cx", line.x())
			.attr("cy", line.y())
			.attr("r", 3.5)
			.attr("stroke", "lightgrey")
			.append("title")
			.text(function(d) { return d.category + ": " + formatAsInteger(d.measure); })
			;

		svg.append("text")
			.text("Total Steps")
			.attr("id","lineChartTitle1")	
			.attr("x",margin.left + ((width + margin.right)/2))
			.attr("y", 10)
			;

	}

	dsLineChart();


	 /* ** UPDATE CHART ** */
	 
	/* updates bar chart on request */
	function updateLineChart(group, colorChosen) {

		var currentDatasetLineChart = datasetLineChartChosen(group);   

		var basics = dsLineChartBasics();
		
		var margin = basics.margin,
			width = basics.width,
		   height = basics.height
			;

		var xScale = d3.scale.linear()
			.domain([0, currentDatasetLineChart.length-1])
			.range([0, width])
			;

		var yScale = d3.scale.linear()
			.domain([0, d3.max(currentDatasetLineChart, function(d) { return d.measure; })])
			.range([height, 0])
			;
		
		var line = d3.svg.line()
		.x(function(d, i) { return xScale(i); })
		.y(function(d) { return yScale(d.measure); })
		;

	   var plot = d3.select("#lineChartPlot")
		.datum(currentDatasetLineChart)
		   ;
		   
		/* descriptive titles as part of plot -- start */
		var dsLength=currentDatasetLineChart.length;
		
		plot.select("text")
			//.text(currentDatasetLineChart[dsLength-1].measure);
					.text( function (d) {
						var total=0;
						var temp;
						for(var i=0; i<dsLength; i++){
								//console.log(firstDatasetLineChart[i].measure);
								temp=currentDatasetLineChart[i].measure;
								total= total+temp;
							}
						return total;})
		/* descriptive titles -- end */
		   
		plot
		.select("path")
			.transition()
			.duration(750)			    
		   .attr("class", "line")
		   .attr("d", line)	
		   // add color
			.attr("stroke", colorChosen)
		   ;
		   
		var path = plot
			.selectAll(".dot")
		   .data(currentDatasetLineChart)
		   .transition()
			.duration(750)
		   .attr("class", "dot")
		   .attr("fill", function (d) { return d.measure==d3.min(currentDatasetLineChart, function(d) { return d.measure; }) ? "red" : (d.measure==d3.max(currentDatasetLineChart, function(d) { return d.measure; }) ? "green" : "white") } )
		   .attr("cx", line.x())
		   .attr("cy", line.y())
		   .attr("r", 3.5)
		   // add color
			.attr("stroke", colorChosen)
		   ;
		   
		   path
		   .selectAll("title")
		   .text(function(d) { return d.category + ": " + formatAsInteger(d.measure); })	 
		   ;  
}};
	

function empty_tri_graph() {
	$("#pieChart").empty();
	$("#barChart").empty();
	$("#lineChart").empty();
	$("#description").empty();
	
};

function write_description(chart_type) {
	$("#description").empty();
	var description = document.createElement('p');
	
	if (chart_type=="bar") {
		var node = document.createTextNode("Y-axis displays step count for every location along the X-axis. Hover over each bar to see location name.");
	}
	else if (chart_type=="aster") {
		var node = document.createTextNode("Each slice of this aster plot shows light level and activity level for various locations visited. Arc size is determined by amount of activity done. Colored radius of each slice is determined by light level normalized to the highest reading (max 100). Hover over each slice to see location name.");
	}
	else if (chart_type=="line") {
		var node = document.createTextNode("Y-axis displays step count for dates along the X-axis.")
	}
	else if (chart_type=="tri") {
		var node = document.createTextNode("Hover over and click each slice to get a comprehensive step count breakdown by week and by day.")
	}
	
	description.appendChild(node);
	document.getElementById('description').appendChild(description);
	
};