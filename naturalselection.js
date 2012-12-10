if (Meteor.isClient) {

	var dataset = "";
	


var coordsRelativeToElement = function (element, event) {
  var offset = $(element).offset();
  var x = event.pageX - offset.left;
  var y = event.pageY - offset.top;
  return { "x": x, "y": y };
};

var drawMap = function () {
	d3.json("hive.json", function(json) {
			dataset = json;
	});	
	
	var svg = d3.select("svg");
	
	var circles = svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle");
	
	circles.attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", 130)
        .attr("class", "ARC")
        .style('opacity', 0.5);

};

Template.map.events({
  'click .map': function (event, template) {
    var coords = coordsRelativeToElement(event.currentTarget, event);
	console.log(coords);
	drawMap();
	

		

	}
})


Template.page.rendered = function() {
	drawMap();

	
}
}


