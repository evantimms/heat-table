import React from 'react'
import * as d3 from 'd3'

export default class HeatTable extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            /*
            NEEDED PROPS:
            - width, height
            - gridsize
            - BinsX, BinsY
            - Color Spectrum
            - Xvals,Yvals,ColorBy (frequency)
            - colLabel
            - rowLabel
            - 

            props.data should contains Xvals,Yvals and ColorBy
            */
            // ...props,
            // data: { ...props.data }
        }
    }

    componentDidMount() {
        this._createChart()
    }
    
    componentDidUpdate() {
        this._createChart()
    }

    shouldComponentUpdate(nextProps, nextState) {
        //do not render if image has not changed...
        // return nextProps.data.image_data !== this.props.data.image_data
    }
    
    
    componentWillReceiveProps(nextProps) {

    }

    _createChart () {
        const { xLabelNames, yLabelNames, margin, width, height, colors, gridSize, legendElementWidth, dataFile, buckets } = this.props
        
        const svg = d3.select(`#${this.props.id}-chart`)
                        .append('svg')
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        const xLabels = svg.selectAll('.xLabel')
                            .data(xLabelNames)
                            .enter()
                            .append('text')
                            .text((d) => d)
                            .attr('x', 0)
                            .attr('y', (d,i) => i * gridSize)
                            .style('text-anchor', 'end')
                            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        
        const yLabels = svg.selectAll(".yLabel")
                            .data(yLabelNames)
                            .enter().append("text")
                            .text(function(d) { return d; })
                            .attr("x", function(d, i) { return i * gridSize; })
                            .attr("y", 0)
                            .style("text-anchor", "middle")
                            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        
        const heatTableChart = (tsvFile) => {
            d3.tsv(tsvFile,
                        (d) => {
                            return ({
                                day: +d.day,
                                hour: +d.hour,
                                value: +d.value
                            })
                        },
                        (error,data) => {
                            // Define colorScale
                            const colorScale = d3.scaleQuantile()
                            .domain([0, buckets-1, d3.max(data, (d) => d.value)])
                            .range(colors)

                            const cards = svg.selectAll('.hour')
                                            .data(data, (d) => d.day + ':' + d.hour)
                            
                            cards.append('title')

                            cards.enter().append('rect')
                                        .attr("x", (d) => (d.hour - 1) * gridSize)
                                        .attr("y", (d) => (d.day - 1) * gridSize )
                                        .attr("rx", 4)
                                        .attr("ry", 4)
                                        .attr("class", "hour bordered")
                                        .attr("width", gridSize)
                                        .attr("height", gridSize)
                                        .style("fill", colors[0])
                            
                            const legend = svg.selectAll(".legend")
                                                .data([0].concat(colorScale.quantiles()), (d) => d);

                            legend.enter().append("g")
                                .attr("class", "legend");

                            legend.append("rect")
                                .attr("x", (d, i) => legendElementWidth * i )
                                .attr("y", height)
                                .attr("width", legendElementWidth)
                                .attr("height", gridSize / 2)
                                .style("fill", (d, i) => colors[i] );

                            legend.append("text")
                                .attr("class", "mono")
                                .text((d) => "≥ " + Math.round(d))
                                .attr("x", (d, i) => legendElementWidth * i )
                                .attr("y", height + gridSize)

                            legend.exit().remove()            
                        })
                    }            
        heatTableChart(dataFile)

        const dataSetPicker = d3.select('#dataset-picker').selectAll('.dataset-button')
                            .data(dataFile)
        
        dataSetPicker.enter()
                        .append('input')
                        .attr("value", (d) => { return "Dataset " + d })
                        .attr("type", "button")
                        .attr("class", "dataset-button")
                        .on("click", (d) => {
                        heatTableChart(d);
                        })
    }

    render () {
        const style = {
            width:this.props.width,
            height:this.props.height
        }
        // const id = this.state.id
        const classes = `${this.props.id} heat-table`
        return (
            <div id={`${this.props.id}-chart`} className={classes} style={style}>
                {this._createChart()}
            </div>
        )       
    }
}