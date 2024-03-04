
async function getData() {
    //const response = await fetch('/Sherlock_rpFlaskFirebase/data/caterpillar-mean-mass.csv'); // Data directory for GitHub pages
    const response = await fetch('static/data/caterpillar-mean-mass.csv'); // .. moves up 1 folder. Data directory for local dev (LiveServer)
    const data = await response.text();    // CSV is in TEXT format
    //console.log(data);

    const xDate = [];  //x-axis labels = day values
    const yWTLMass = [];  //y-axis WTL mass values
    const yDLMass = []; //y-axis DL mass values 
    const yCTLMass = []; //y-axis CTL mass values

    // \n - new line character
    // split('\n') will separate the table into an array of individual rows 
    // slice(start, end) - return a new array starting at index start 
    //      up to but not including index end. 
    const table = data.split('\n').slice(1);
    //console.log(table);

    table.forEach(row => {
        const columns = row.split(','); // split each row on the commas
        const date = columns[0];        // assign a day value 
        xDate.push(date);              // push day values into day array
        
        const wtlMass = parseFloat(columns[1]);    //assign warm temp mass values 
        yWTLMass.push(wtlMass);         // push mass values to store mean mass values 

        const dlMass = parseFloat(columns[2]);      // daylight mass deviation values
        yDLMass.push(dlMass);
        
        const ctlMass = parseFloat(columns[3]);      // cool temp light deviation values
        yCTLMass.push(ctlMass);

        //console.log(xDate, yWTLMass, yDLMass, yCTLMass);
    });
    return{xDate, yWTLMass, yDLMass, yCTLMass};
};

async function createChart() {
    const data = await getData();   // createChart will wait until getData() is finished processing
    const ctx = document.getElementById('massChart');
    const massChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.xDate,
            datasets: [
                {
                    label: 'Average Mass of One Caterpillar/Butterfly under the warm temp. light in grams',
                    data: data.yWTLMass, 
                    fill: false,
                    backgroundColor: 'rgba(252, 128, 3, 0.2)',
                    borderColor: 'rgba(252, 128, 3, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Average Mass of One Caterpillar/Butterfly under the daylight temp. LED in grams',
                    data: data.yDLMass, 
                    fill: false,
                    backgroundColor: 'rgba(0, 144, 0, 0.2)',
                    borderColor: 'rgba(10, 144, 0, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Average Mass of One Caterpillar/Butterfly under the cool temp. light in grams',
                    data: data.yCTLMass, 
                    fill: false,
                    backgroundColor: 'rgba(0, 102, 255, 0.2)',
                    borderColor: 'rgba(0, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,   // Re-size based on screen size
            maintainAspectRatio: false, // For responsive charts (keeps original width/height aspect ratio)
            scales: {           // Display options for x & y axes
                x: {
                    title: {
                        display: true,
                        text: 'Date',   // x-axis title
                        font: {         // font properties
                            size: 20
                        }
                    },
                    ticks: {
                        callback: function(val, index) {
                            // Labeling of tick marks can be controlled by code and font size
                            return this.getLabelForValue(val);
                        },
                        font: {
                            size: 16
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Mass (g)',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        maxTicksLimit: data.yWTLMass.length,    //limit # of ticks
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {      //Display options
                title: {
                    display: true,
                    text: 'Average Mass of One Caterpillar/Butterfly Over Time (11/7/22 - 12/5/22)',
                    font: {
                        size: 24
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    align: 'start',
                    position: 'bottom'
                }
            }
        }
    });
};

createChart();