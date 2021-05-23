function init() {
  var selector = d3.select("#selDataset");

  d3.json("static/js/samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  })
}

init();
d3.json('static/js/samples.json').then(data => {
  data.names.forEach(name => {
    d3.select('select').append('option').text(name)
  });

  showData()
});

function optionChanged() {

  showData();
};

function showData() {
  var selected = d3.select('select').node().value;

  d3.json('static/js/samples.json').then(data => {

    var metadata = data.metadata.filter(obj => obj.id == selected)[0]
    var sample = data.samples.filter(obj => obj.id == selected)[0]
    d3.select('.panel-body').html('')

    Object.entries(metadata).forEach(([key, val]) => {
      d3.select('.panel-body').append('h4').text(key.toUpperCase() + ": " + val);
    })

    var barData = [
      {
        x: sample.sample_values.slice(0, 10).reverse(),
        y: sample.otu_ids.slice(0, 10).reverse().map(id => 'OTU ' + id),
        type: 'bar',
        orientation: 'h'
      }
    ];

    Plotly.newPlot('bar', barData);

    console.log(sample);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        y: sample.sample_values,
        x: sample.otu_ids, text: sample.otu_labels,
        mode: "markers",
        marker: {
          size: sample.sample_values, color: sample.otu_ids, colorscale: "earth"
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      showlegend: false,
      height: 600,
      width: 1200
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: metadata.wfreq,
      title: { text: "Speed" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 500], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 250], color: "cyan" },
          { range: [250, 400], color: "royalblue" }
        ],

      }
    }]

    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gaugeData, layout);
  });
}

