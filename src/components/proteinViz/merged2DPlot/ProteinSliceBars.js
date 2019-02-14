import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash'
import {sampleColor} from "../../common/colorSettings";
import {mouse, select} from "d3-selection";
import SliceBar from "./SliceBar"
import PopOverSkeleton from "../../common/popOverSkeleton"


class SliceBars extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    plotOneProtein = (protein, color, keyName, highlight) => {
        const {zoomLeft, zoomRight} = this.props

        const massFits = protein.dataSet.massFitResult.massFits
        const ints = protein.intensities

        // filter out entries which are not in the visual range, in case a zoom was set
        const slices = _.map(_.zip(massFits, ints), (x, i) => {return x.concat(i)})

        const fltSlices = (zoomLeft) ? (_.filter(slices, (s) => {
            return s[0] >= zoomLeft && s[0] <= zoomRight && s[1]
        })) : slices;

        return _.map(fltSlices, (x, i) => {
            return this.plotOneSlice(x[0], x[1], color, keyName+i, highlight, protein, x[2])
        })
    }

    showPopOverCB = (protein, sliceIdx, x, y) => {
        const peptides = _.filter(protein.peptides, (pep) => {
            return pep.sliceNr === (sliceIdx + 1)
        })

        const popUpContent = {
            Sample: protein.dataSet.sample,
            Replicate: protein.dataSet.name,
            '# Peptides': peptides.length,
            Slice: sliceIdx + 1,
            'Mol weight': Math.pow(10, protein.dataSet.massFitResult.massFits[sliceIdx]).toFixed(2)
        }
        const popUp = {x: x, y: y, content: popUpContent}
        this.setState({popUp: popUp})
    }

    plotPopUp = () => {
        const {x, y, content} = this.state.popUp

        const height = 60

        return (
            <PopOverSkeleton x={x+5} y={y-height} width={120} height={height} content={content} removable={false}/>
        )
    }

    clickCB = (protein, sliceIdx) => {
        console.log("highlight", protein, sliceIdx)
    }

    removePopOverCB = () => {
        this.setState({popUp: undefined})
    }

    plotOneSlice = (mass, int, color, keyName, highlight, protein, sliceIdx) => {

        const showSlicePopOverCB = (sliceIdx, x, y) => { return this.showPopOverCB(protein, sliceIdx, x, y) }
        const clickSliceCB = (sliceIdx) => { return this.clickCB(protein, sliceIdx)}

        const {margin, xScale, yScale, svgParent} = this.props
        return <SliceBar
            key={keyName} mass={mass} int={int} color={color} xScale={xScale} yScale={yScale} margin={margin}
            highlight={highlight} svgParent={svgParent} popOverCB={showSlicePopOverCB} removePopOverCB={this.removePopOverCB}
            sliceIdx={sliceIdx} clickCB={clickSliceCB}/>
    }

    render() {
        const {sampleIdx, replIdx, proteins} = this.props

        const col = sampleColor(sampleIdx)

        return  <g>
            { this.plotOneProtein(proteins.proteins[replIdx], col, "slice-bar-"+sampleIdx+"-", true) }
            { this.state.popUp && this.plotPopUp()}
        </g>
    }

}

SliceBars.propTypes = {
    proteins: PropTypes.object.isRequired,
    sampleIdx: PropTypes.number.isRequired,
    replIdx: PropTypes.number.isRequired,
    margin: PropTypes.object.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    zoomLeft: PropTypes.number,
    zoomRight: PropTypes.number,
    svgParent: PropTypes.object.isRequired
};

export default SliceBars