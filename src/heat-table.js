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

    _calculateXYBinMapping () {

    }

    _mapDToV (x, y) {
        const { data } = this.state

        data.forEach(el => {
            if(el.x === x && el.y === y){
                return el.value
            }
        })
        return 0    
    }

    _formatData (xAxisTicks, yAxisTicks, colorThreshold) {

        const f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))))
        const cartesian = (a, b, ...c) => b ? cartesian(f(a, b), ...c) : a

        const HI = (T, RH) => {
            return -42.379 + 2.04901523*T + 10.14333127*RH - .22475541*T*RH - .00683783*T*T - .05481717*RH*RH + .00122874*T*T*RH + .00085282*T*RH*RH - .00000199*T*T*RH*RH;
        }


        const thresholdScale = d3.scaleThreshold()
        .domain(colorThreshold.map(d => d.value))
        .range([0,1,2,3,4])


        // calculate the threshold based on the value of the z axis
        // map everything, but only add the threshold if the data point is contained within that binning
        let values2 = cartesian(yAxisTicks, xAxisTicks).map(d => {
            return {
              x: d[0],
              y: d[1],
              value: this._mapDToV(d[0],d[1]),
              threshold: thresholdScale(this._mapDToV(d[0],d[1]))
            }
          })
        // console.log(values2)
        let values = cartesian(yAxisTicks, xAxisTicks).map(d => {
            return {
              temp: d[0],
              rh: d[1],
              HI: HI(...d),
              threshold: thresholdScale(HI(...d))
            }
          }) 
        console.log(values2)
        let formattedData = d3.nest()
        .key(d => d.threshold)
        .sortKeys(d3.ascending)
        .key(d => d.rh)
        .rollup(vals => d3.max(vals))
        .entries(values)
        .map(d => {
            return {
            key: d.key,
            values: xAxisTicks.map(h => {
                const v = d.values.find(f => +f.key === h);
                return {
                rh: h,
                temp: v ? v.value.temp : 120
                }
            })
            }
        }).map( (d, i, arr) => {
            d.values = d.values.map( (f, j) => {
            f.prevTemp = i > 0 ? arr[i - 1].values[j].temp : 80;
            return f;
            })
            return d;
        })

        return formattedData
    }


    _renderHeatTable () {
        const { width, height, margin, thresholds, colors, ranges, xAxisLabel, yAxisLabel, colorThreshold } = this.state 
        const { xMin, xMax, yMin, yMax } = ranges
        const { data } = this.state

        const xAxisTicks = d3.range(xMin,xMax,1)
        const yAxisTicks = d3.range(yMin,yMax,1).reverse()


        
        const chartData = this._formatData(xAxisTicks, yAxisTicks, data, colorThreshold)       
        

        const svg = d3.select('.heat-table').append('svg')
                            .attr('width', width)
                            .attr('height', height)
          
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        const chart = svg.append('g')
          .style('font-family', 'sans-serif')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        const x = d3.scaleLinear()
          .domain(d3.extent(xAxisTicks))
          .range([0, chartWidth]);
        
        const y = d3.scaleLinear()
          .domain(d3.extent(yAxisTicks))
          .range([chartHeight, 0]);
        
        chart.append("g")
          .attr('transform', `translate(0, ${chartHeight + 2})`)
          .style('font-size', '13px')
          .style('font-weight', 300)
          .call(d3.axisBottom(x).ticks(5))
          .selectAll('.domain').remove();
        
        chart.append('text')
          .attr('x', chartWidth)
          .attr('y', chartHeight + 40)
          .text(xAxisLabel)
          .style('text-anchor', 'end')
          .style('font-weight', 600)
          .style('font-size', '14px');
        
        chart.append("g")
          .attr('transform', 'translate(-2, 0)')
          .style('font-size', '13px')
          .style('font-weight', 300)
          .call(d3.axisLeft(y).ticks(5))
          .selectAll('.domain').remove();
        
        chart.append('text')
          .attr('x', 0)
          .attr('y', -15)
          .text(yAxisLabel)
          .style('text-anchor', 'end')
          .style('font-weight', 600)
          .style('font-size', '14px');
          
        const area = d3.area()
          .x(d => x(d.rh))
          .y0(d => y(d.temp))
          .y1(d => y(d.prevTemp))
          .curve(d3.curveStepAfter);
          
        chart.append('g')
          .selectAll('path')
          .data(chartData)
          .enter().append("path")
          .attr('d', d => area(d.values))
          .style('fill', d => colors[+d.key])
          .style('opacity', .8);
          
        chart.append('g')			
          .attr('transform', `translate(0, ${chartHeight})`)
          .call(d3.axisBottom(x)
            .ticks(xAxisTicks.length)
            .tickSize(-chartHeight)
            .tickFormat('')
          ).selectAll('line')
          .style('stroke', 'white')
          .style('stroke-width', 1)
          .style('stroke-opacity', .5);
          
        chart.append('g')			
          .call(d3.axisLeft(y)
            .ticks(yAxisTicks.length)
            .tickSize(-chartWidth)
            .tickFormat('')
          ).selectAll('line')
          .style('stroke', 'white')
          .style('stroke-width', 1)
          .style('stroke-opacity', .5);
          
        chart.selectAll('.domain').remove();
          
        chart.append('g')
          .selectAll('text')
          .data(thresholds)
          .enter().append('text')
          .text(d => d.text)
          .attr('transform', d => `translate(${x(d.H)}, ${y(d.T) - 2})`)
          .attr('x', 0)
          .attr('y', 0)
          .style('text-anchor', 'middle')
          .style('font-size', '13px')
          .style('font-weight', 300);
          
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