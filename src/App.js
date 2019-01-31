import React from 'react';
// import HeatTable from './heat-table'
import HeatTable from './heat-table'

const width = 800
const height = 800

const margin = {
  left: 85,
  top: 30,
  right: 20,
  bottom: 45
}

const colors = ['#fdf7e1','#faeaae','#f7d790','#f3b473','#fd8d3c','#fc4e2a','#e31a1c','#b10026']
const ranges = {
  xMin: 10,
  yMin: 80,
  xMax: 101,
  yMax: 121,
  valueMin: 0,
  valueMax: 165,
}

const colorThreshold = [
  {
    color: '#fdf7e1',
    value: 90
  },
  {
    color: '#faeaae',
    value: 103
  },
  {
    color: '#f7d790',
    value: 125
  },
  {
    color: '#f3b473',
    value: 165
  }
]

const xAxisLabel = 'X Axis Label'
const yAxisLabel = 'Y Axis Label'
const bins  = {
  xBins: 30,
  yBins: 35
}

class App extends React.Component {


  render() {
    return (
      <div 
        className="App"
      >
        <HeatTable
          margin={margin}
          width={width}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          height={height}
          colorThreshold={colorThreshold}
          colors={colors}
          ranges={ranges}
          bins={bins}
        />
      </div>
    );
  }
}

export default App;
