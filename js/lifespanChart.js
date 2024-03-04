
async function getData() {
    //const response = await fetch('/rp_Sherlock/data/caterpillar-lifespan.csv'); // Data directory for GitHub pages
    const response = await fetch('../data/caterpillar-lifespan.csv'); // .. moves up 1 folder. Data directory for local dev (LiveServer)
    const data = await response.text();    // CSV is in TEXT format
    //console.log(data);

    const xDate = [];  //x-axis labels = day values
    const yWTLSpan = [];  //y-axis WTL lifespan values
    const yDLSpan = []; //y-axis DL lifespan values 
    const yCTLSpan = []; //y-axis CTL lifespan values

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
        
        const wtlSpan = parseFloat(columns[1]);    //assign warm temp lifespan values 
        yWTLSpan.push(wtlSpan);         // push lifespan values to store mean lifespan values 

        const dlSpan = parseFloat(columns[2]);      // daylight lifespan deviation values
        yDLSpan.push(dlSpan);
        
        const ctlSpan = parseFloat(columns[3]);      // cool temp light deviation values
        yCTLSpan.push(ctlSpan);

        //console.log(xDate, yWTLSpan, yDLSpan, yCTLSpan);
    });
    return{xDate, yWTLSpan, yDLSpan, yCTLSpan};
};

async function createChart() {
    const data = await getData();   // createChart will wait until getData() is finished processing
    const ctx = document.getElementById('lifespanChart');
    const lifespanChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.xDate,
            datasets: [
                {
                    label: 'The Number of Caterpillars/Butterflies under the warm temp. light alive',
                    data: data.yWTLSpan, 
                    fill: false,
                    backgroundColor: 'rgba(252, 128, 3, 0.2)',
                    borderColor: 'rgba(252, 128, 3, 1)',
                    borderWidth: 1
                },
                {
                    label: 'The Number of Caterpillars/Butterflies under the daylight temp. LED alive',
                    data: data.yDLSpan, 
                    fill: false,
                    backgroundColor: 'rgba(0, 144, 0, 0.2)',
                    borderColor: 'rgba(0, 144, 0, 1)',
                    borderWidth: 1
                },
                {
                    label: 'The Number of Caterpillars/Butterflies under the cool temp. light alive',
                    data: data.yCTLSpan, 
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
                            return index % 3 === 0 ? this.getLabelForValue(val) : '';
                        },
                        font: {
                            size: 16
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '# Caterpillars Alive',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        maxTicksLimit: data.yWTLSpan.length/2,    //limit # of ticks
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {      //Display options
                title: {
                    display: true,
                    text: 'The Number of Caterpillars/Butterflies Alive Over Time (11/7/22 - 12/25/22)',
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