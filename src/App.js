import React from 'react';
// import HeatTable from './heat-table'
import HeatTable from './heat-table'
import * as d3 from 'd3'

const width = 700
const height = 500

const margin = {
  left: 85,
  top: 30,
  right: 20,
  bottom: 45
}

const thresholds = [
  {
    'value': 90,
    'T': 95,
    'H': 31
  },
  {
    'value': 103,
    'T': 102,
    'H': 38
  },
  {
    'value': 125,
    'T': 107,
    'H': 50
  },
  {
    'value': 165,
    'T': 113,
    'H': 72
  }
]


const xAxisTicks = d3.range(10,101,1)

const yAxisTicks = d3.range(80,121,1).reverse()

class App extends React.Component {


  render() {
    return (
      <div 
        className="App"
      >
        <HeatTable
          margin={margin}
          width={width}
          height={height}
          yAxisTicks={yAxisTicks}
          xAxisTicks={xAxisTicks}
          thresholds={thresholds}
        />
      </div>
    );
  }
}

export default App;
