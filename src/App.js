import React from 'react';
// import HeatTable from './heat-table'
import HeatTable from './heat-table'

const data = {
  xGroupBy: 'Well Cost',
  yGroupBy: 'Well Production (3mo)',
  colorBy: 'Cost',
  xData: [],
  yData: [],
  frequency: []
}

class App extends React.Component {

  _getData () {
    while(data.xData.length < 100){
      data.xData.push(Math.floor(Math.random()*100))
      data.yData.push(Math.floor(Math.random()*100))
      data.frequency.push(Math.floor(Math.random() * 5))
    }
  }

  render() {
    const margin = { top: 50, right: 0, bottom: 100, left: 30 }
    const width = 960 - margin.left - margin.right
    const height = 640 - margin.top - margin.bottom

    this._getData()
    return (
      <div 
        className="App"
      >
        {/* <HeatTable
          id='prism-heat-table'
          dataFile='data.tsv'
          margin={margin}
          width={width}
          height={height}
          buckets={9}
          colors={["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]}
          xLabelNames={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
          yLabelNames={["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"]}
          gridSize = {Math.floor(width / 24)}
          legendElementWidth = {gridSize*2}
        /> */}
        <HeatTable 
          margin={margin}
          width={width}
          height={height}
          colors={["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]}
          data={data}
          bins={10}
          gridSize={Math.floor(width / 24)}
        />
      </div>
    );
  }
}

export default App;
