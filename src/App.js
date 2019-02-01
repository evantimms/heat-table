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
const ranges = {
  xMin: 0,
  yMin: 0,
  xMax: 101,
  yMax: 151,
  valueMin: 0,
  valueMax: 100,
}

const colorThreshold = [
  {
    value: 0,
    color: '#3d3940'
  },
  {
    value: 50,
    color: '#fdf7e1'
  },
  {
    value: 60,
    color: '#faeaae'
  },
  {
    value: 75,
    color: 'f7d790'
  },
  {
    value: 88,
    color: 'f3b473'
  },
  {
    value: 97,
    color: 'fd8d3c'
  }
]

const xAxisLabel = 'X Axis Label'
const yAxisLabel = 'Y Axis Label'
const bins  = {
  xBins: 30,
  yBins: 30
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
          ranges={ranges}
          bins={bins}
        />
      </div>
    );
  }
}

export default App;
