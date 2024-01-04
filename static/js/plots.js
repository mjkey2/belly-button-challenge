// Subject IDs
// Read in the samples.json data using D3
d3.json("samples.json").then(function(data) {
  // Get the metadata from the loaded JSON
  var metadata = data.metadata;

  // Extract the Test Subject IDs from the metadata
  subjectIDs = metadata.map(function(d) {
    return d.id;
  });

  // Populate the dropdown menu with the Test Subject IDs
  var dropdownMenu = d3.select("#selDataset");
  subjectIDs.forEach(function(subjectID) {
    dropdownMenu.append("option")
      .text(subjectID)
      .property("value", subjectID);
  });
});


// Demographic Info
// Read in the samples.json data using D3
d3.json("samples.json").then(function(data) {
  // Get the samples data from the loaded JSON
  var samples = data.samples;

  // Get the first sample from the data
  var firstSample = samples[0];

  // Extract the necessary data for the bubble chart
  var otuIds = firstSample.otu_ids;
  var sampleValues = firstSample.sample_values;
  var otuLabels = firstSample.otu_labels;

  // Create the trace for the bubble chart
  var trace = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: "markers",
    marker: {
      size: sampleValues,
      color: otuIds,
      colorscale: "Earth"
    }
  };

  // Create the data array for the plot
  var data = [trace];

  // Create the layout for the plot
  var layout = {
    title: "Sample Bubble Chart",
    xaxis: { title: "OTU IDs" },
    yaxis: { title: "Sample Values" }
  };

  // Plot the chart using Plotly
  Plotly.newPlot("bubble", data, layout);

  // Call the optionChanged function with the first Test Subject ID to initialize the page
  optionChanged(samples[0]);

});

// Top 10 OTUS
// Read in the samples.json data using D3
d3.json("samples.json").then(function(data) {
  // Get the samples data from the loaded JSON
  var samples = data.samples;

  // Get the first sample from the data
  var firstSample = samples[0];

  // Get the top 10 OTUs from the first sample
  var top10OTUs = firstSample.sample_values.slice(0, 10);
  var top10OTUIds = firstSample.otu_ids.slice(0, 10);
  var top10OTULabels = firstSample.otu_labels.slice(0, 10);

  // Reverse the arrays to display the bars in descending order
  top10OTUs = top10OTUs.reverse();
  top10OTUIds = top10OTUIds.reverse();
  top10OTULabels = top10OTULabels.reverse();

  // Create the trace for the horizontal bar chart
  var trace = {
    x: top10OTUs,
    y: top10OTUIds.map(id => `OTU ${id}`),
    text: top10OTULabels,
    type: "bar",
    orientation: "h"
  };

  // Create the data array for the plot
  var data = [trace];

  // Create the layout for the plot
  var layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };

  // Plot the chart using Plotly
  Plotly.newPlot("bar", data, layout);
});

// Bubble Chart
// Read in the samples.json data using D3
d3.json("samples.json").then(function(data) {
  // Get the metadata from the loaded JSON
  var metadata = data.metadata;

  // Get the first metadata object
  var firstMetadata = metadata[0];

  // Select the element where you want to display the metadata
  var metadataDiv = d3.select("#sample-metadata");

  // Clear any existing metadata
  metadataDiv.html("");

  // Loop through each key-value pair in the metadata object
  Object.entries(firstMetadata).forEach(([key, value]) => {
    // Append a new paragraph element with the key-value pair to the metadata div
    metadataDiv.append("p").text(`${key}: ${value}`);
  });
});

// Frequency guage
// Read in the samples.json data using D3
d3.json("samples.json").then(function(data) {
  // Get the metadata from the loaded JSON
  var metadata = data.metadata;

  // Get the first metadata object
  var firstMetadata = metadata[0];

  // Extract the weekly washing frequency from the metadata
  var washingFrequency = firstMetadata.wfreq;

  // Create the trace for the gauge chart
  var trace = {
    type: "indicator",
    mode: "gauge+number",
    value: washingFrequency,
    title: { text: "Weekly Washing Frequency" },
    gauge: {
      axis: { range: [0, 6] }, // Set the range of the gauge from 0 to 9
      steps: [
        { range: [0, 1], color: "white" },
        { range: [1, 2], color: "lightgreen" },
        { range: [2, 3], color: "lightgreen" },
        { range: [3, 4], color: "lightgreen" },
        { range: [4, 5], color: "lightgreen" },
        { range: [5, 6], color: "lightgreen" }
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: washingFrequency
      }
    }
  };

  // Create the data array for the gauge chart
  var data = [trace];

  // Create the layout for the gauge chart
  var layout = { width: 400, height: 300, margin: { t: 0, b: 0 } };

  // Plot the chart using Plotly
  Plotly.newPlot("gauge", data, layout);
});

// Define the optionChanged function
function optionChanged(selectedSample) {
  // Read in the samples.json data using D3
  d3.json("samples.json").then(function(data) {
    // Get the samples data from the loaded JSON
    var samples = data.samples;

    // Find the selected sample in the samples data
    var selectedSampleData = samples.find(sample => sample.id === selectedSample);

    // Update the data for the bubble chart
    var bbotuIds = selectedSampleData.otu_ids;
    var bbsampleValues = selectedSampleData.sample_values;
    var bbotuLabels = selectedSampleData.otu_labels;

    // Restyle the bubble chart
    Plotly.restyle("bubble", "x", [bbotuIds]);
    Plotly.restyle("bubble", "y", [bbsampleValues]);
    Plotly.restyle("bubble", "text", [bbotuLabels]);
    Plotly.restyle("bubble", "marker.size", [bbsampleValues]);
    Plotly.restyle("bubble", "marker.color", [bbotuIds]);

    // Update the data for the horizontal bar chart
    var top10OTUs = bbsampleValues.slice(0, 10).reverse();
    var top10OTUIds = bbotuIds.slice(0, 10).reverse();
    var top10OTULabels = bbotuLabels.slice(0, 10).reverse();

    // Restyle the horizontal bar chart
    Plotly.restyle("bar", "x", [top10OTUs]);
    Plotly.restyle("bar", "y", [top10OTUIds.map(id => `OTU ${id}`)]);
    Plotly.restyle("bar", "text", [top10OTULabels]);
  });
}

// Attach an event listener to the dropdown menu
d3.select("#selDataset").on("change", function() {
  // Get the selected sample from the dropdown menu
  var selectedSample = d3.select(this).property("value");

  // Call the optionChanged function with the selected sample
  optionChanged(selectedSample);
});