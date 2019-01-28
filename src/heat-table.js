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


    _renderHeatTable () {
        const { width, height, margin, xAxisTicks, yAxisTicks, thresholds } = this.state 


        const f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))))
        const cartesian = (a, b, ...c) => b ? cartesian(f(a, b), ...c) : a

        const HI = (T, RH) => {
            return -42.379 + 2.04901523*T + 10.14333127*RH - .22475541*T*RH - .00683783*T*T - .05481717*RH*RH + .00122874*T*T*RH + .00085282*T*RH*RH - .00000199*T*T*RH*RH;
        }


        const thresholdScale = d3.scaleThreshold()
        .domain(thresholds.map(d => d.value))
        .range([0,1,2,3,4])

        const values = cartesian(yAxisTicks, xAxisTicks).map(d => {
            return {
              temp: d[0],
              rh: d[1],
              HI: HI(...d),
              threshold: thresholdScale(HI(...d))
            }
          })
        
        const chartData = d3.nest()
        .key(d => d.threshold)
        .sortKeys(d3.ascending)
        .key(d => d.rh)
        .rollup(vals => d3.max(vals))
        .entries(values)
        .map(d => {
            return {
            key: d.key,
            values: xAxisTicks.map(h => {
                const v = d.values.find(f => +f.key == h);
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


        const colors = ['#fdf7e1','#faeaae','#f7d790','#f3b473','#fd8d3c','#fc4e2a','#e31a1c','#b10026']
        
        

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
          .call(g => g.select('.tick:last-of-type text').text('100%'))
          .selectAll('.domain').remove();
        
          chart.append('text')
          .attr('x', chartWidth)
          .attr('y', chartHeight + 40)
          .text('Relative humidity')
          .style('text-anchor', 'end')
          .style('font-weight', 600)
          .style('font-size', '14px');
        
          chart.append("g")
          .attr('transform', 'translate(-2, 0)')
          .style('font-size', '13px')
          .style('font-weight', 300)
          .call(d3.axisLeft(y).ticks(5))
          .call(g => g.select('.tick:last-of-type text').text('120 °F'))
          .selectAll('.domain').remove();
        
          chart.append('text')
          .attr('x', 0)
          .attr('y', -15)
          .text('Temperature')
          .style('text-anchor', 'end')
          .style('font-weight', 600)
          .style('font-size', '14px');
          
          const area = d3.area()
          .x(d => x(d.rh))
          .y0(d => y(d.temp))
          .y1(d => y(d.prevTemp))
          .curve(d3.curveStepAfter);
          
          const paths = chart.append('g')
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