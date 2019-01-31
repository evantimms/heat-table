import React from 'react'
import * as d3 from 'd3'

export default class HeatTable extends React.Component {
    constructor (props) {
        super(props)

        this.state = { ...props }
        this._renderHeatTable()
    }

    componentDidMount () {
        this._renderHeatTable()
    }

    componentDidUpdate () {
        this._renderHeatTable()
    }

    pretendBackEndRequest(ranges, bins) {
      const data = []
    
      for(let i = 0; i < bins.xBins; ++i){
        const newPoint = []
        for(let j = 0; j < bins.yBins; ++j){
          //y
          newPoint.push(
            Math.floor(Math.random() * (ranges.valueMax - ranges.valueMin + 1)) + ranges.valueMin
          )
        }
        data.push(newPoint)
      }  
      return data
    }


    _appendData (data, i, j){
      if (data[i][j]) return data[i][j]
    }

    _createBinsFromData (data, xBins, yBins, colorThreshold) {
      

      const toReturn = []
      for(let i = 0; i < xBins; ++i){
        for(let j = 0; j < yBins; ++j){
          toReturn.push({
            x: i,
            y: j,
            z: this._appendData(data, i, j)
          })
        }
      }
      return toReturn
    }


    _formatData (data, colorThreshold, bins) {
        const { xBins, yBins } = bins

        // calculate the threshold based on the value of the z axis
        // map everything, but only add the threshold if the data point is contained within that binning
        let values = this._createBinsFromData(data, xBins, yBins, colorThreshold)
        const thresholdScale = d3.scaleThreshold()
        .domain(colorThreshold.map(d => d.value))
        .range([0,1,2,3,4])

        let formattedData = values.map(d => {
          return {
            x: d.x,
            y: d.y,
            z: thresholdScale(d.z !== undefined ? d.z: 0)
          }
        })
        return formattedData
    }


    _renderHeatTable () {
        const { width, height, margin, thresholds, ranges, xAxisLabel, yAxisLabel, colorThreshold, bins, colors } = this.state 
        const { xMin, xMax, yMin, yMax } = ranges
        const data = this.pretendBackEndRequest(ranges, bins)
        

        const xAxisTicks = d3.range(xMin,xMax,1)
        const yAxisTicks = d3.range(yMin,yMax,1).reverse()


        const chartData = this._formatData(data, colorThreshold, bins)       

        const svg = d3.select('.heat-table').append('svg')
                            .attr('width', width)
                            .attr('height', height)
          
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const gridSizeX = Math.floor((chartWidth) / bins.xBins)
        const gridSizeY = Math.floor((chartHeight) / bins.yBins)
        
        const chart = svg.append('g')
          .style('font-family', 'sans-serif')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        const cards = chart.selectAll('.card')
          .data(chartData)
          .enter()
          .append('rect')
          .attr('x', d => ( d.x - 1) * gridSizeX)
          .attr('y', d => (d.y - 1) * gridSizeY)
          .attr("rx", 4)
          .attr("ry", 4)
          .attr('width', gridSizeX)
          .attr('height', gridSizeY)
          .style('fill', colors[0])
          .attr('transform', `translate(${gridSizeX}, ${gridSizeY})`)
        
        cards
          .transition().duration(1000)
          .style('fill', d => colors[d.z])

        const tableLengthX = gridSizeX * bins.xBins
        const tableLengthY = gridSizeY * bins.yBins

        const x = d3.scaleLinear()
          .domain(d3.extent(xAxisTicks))
          .range([0, tableLengthX])
        
        const y = d3.scaleLinear()
          .domain(d3.extent(yAxisTicks))
          .range([tableLengthY, 0])
        
        chart.append("g")
          .attr('transform', `translate(0, ${tableLengthY})`)
          .style('font-size', '13px')
          .style('font-weight', 300)
          .call(d3.axisBottom(x).ticks(5))
          .selectAll('.domain').remove()
        
        chart.append('text')
          .attr('x', Math.floor((tableLengthX / 5) * 3))
          .attr('y', tableLengthY + 50) // replace 50 with value as function of fontsize
          .text(xAxisLabel)
          .style('text-anchor', 'end')
          .style('font-weight', 600)
          .style('font-size', '14px')
        
        chart.append("g")
          .style('font-size', '13px')
          .style('font-weight', 300)
          .call(d3.axisLeft(y).ticks(5))
          .selectAll('.domain').remove()
        
        chart.append('text')
          .attr('x', Math.floor((tableLengthX / 5) * 3))
          .attr('y', 50)
          .attr('transform', 'rotate(90)')
          .text(yAxisLabel)
          .style('text-anchor', 'end')
          .style('font-weight', 600)
          .style('font-size', '14px')
          
        chart.selectAll('.domain').remove();
          
        return svg.node();

    }

    render () {
        return (
            <div className="heat-table">
                {this._renderHeatTable()} 
            </div>
        )
    }
}