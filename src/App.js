import React from 'react';
// import HeatTable from './heat-table'
import HeatTable from './heat-table'

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
const colors = ['#fdf7e1','#faeaae','#f7d790','#f3b473','#fd8d3c','#fc4e2a','#e31a1c','#b10026']
const ranges = {
  xMin: 10,
  yMin: 80,
  xMax: 101,
  yMax: 121,
  valueMin: 90,
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
const bins  = 20

function pretendBackEndRequest(ranges, points) {
  const obj = []
  
  for(let i = 0; i < points; ++i){
    obj.push({
      x: Math.floor(Math.random() * (ranges.xMax - ranges.xMin) + ranges.xMin),
      y: Math.floor(Math.random() * (ranges.xMax - ranges.xMin) + ranges.xMin),
      value: Math.floor(Math.random() * (ranges.valueMax - ranges.valueMin) + ranges.valueMin)
    })
  }
  return obj
}


const data = pretendBackEndRequest(ranges, 100)

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
          thresholds={thresholds}
          colorThreshold={colorThreshold}
          colors={colors}
          ranges={ranges}
          bins={bins}
          data={data}
        />
      </div>
    );
  }
}

export default App;
