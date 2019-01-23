import React from 'react'
import * as d3 from 'd3'

export default class SecondaryHeatTable extends React.Component {
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

    _getLabels (lower,upper, divisions) {
        let toReturn = []
        let mean = Math.ceil((lower+upper)/divisions)
        for(let i = 0; i < divisions + 1; ++i){
            toReturn.push(lower + i * mean)
        }
        return toReturn
    }

    _renderHeatTable () {
        const { margin, width, height, data, colors, bins, gridSize } = this.state

        const xLabel = this.state.data.xGroupBy
        const yLabel = this.state.data.yGroupBy
        const xMax = Math.max.apply(null,this.state.data.xData)
        const xMin = Math.min.apply(null,this.state.data.xData)
        const yMax = Math.max.apply(null,this.state.data.yData)
        const yMin = Math.min.apply(null,this.state.data.yData)
        const colorByMin = Math.max.apply(null,this.state.data.frequency)
        const colorByMax = Math.min.apply(null,this.state.data.frequency)

        // Create svg
        const svg = d3.select('.heat-table')
                        .append('svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom)
                        .append('g')
                        .attr('transform', `translate(${margin.left},${margin.top})`)

        const chart = svg.append('g')
                            .attr('transform', `translate(${margin}, ${margin})`)
        
        const xLabels = this._getLabels(xMin,xMax,bins)
        const yLabels = this._getLabels(yMin,yMax,bins)

        const yScale = d3.scaleBand()
                        .range([height,0])
                        .domain(yLabels)
                        
        chart.append('g')
                .call(d3.axisLeft(yScale))

        const xScale = d3.scaleBand()
                        .range([0,width])
                        .domain(xLabels)
                        .padding(0.2)

        chart.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(xScale))
        
        chart.append('g')
            .attr('transform', `translate(0, ${height})`)
    }

    render () {
        return (
            <div className="heat-table">
                {this._renderHeatTable()} 
            </div>
        )
    }
}