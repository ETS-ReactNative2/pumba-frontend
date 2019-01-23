import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash'
import {sampleColor} from "../../common/colorSettings";


class SliceBars extends Component {

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
            return this.plotOneSlice(x[0], x[1], color, keyName+i, highlight, x[2])
        })
    }

    plotOneSlice = (mass, int, color, keyName, highlight, sliceIdx) => {
        const {margin, xScale, yScale} = this.props

        const xPos = xScale(mass) + margin.left

        return <line
            key={keyName}
            className={"slice-bar"}
            x1={xPos}
            y1={yScale(0) + margin.top}
            x2={xPos}
            y2={yScale(int) + margin.top}
            stroke={color}
            strokeWidth={ highlight ? 2 : 0.5 }
        />
    }

    render() {
        const {sampleIdx, replIdx, proteins} = this.props

        const col = sampleColor(sampleIdx)

        return  <g>
            { this.plotOneProtein(proteins.proteins[replIdx], col, "slice-bar-"+sampleIdx+"-", true) }
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
};

export default SliceBars