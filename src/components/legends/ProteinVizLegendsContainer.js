import React, {
    Component
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProteinVizLegends from './ProteinVizLegends'
import {
    mouseClickRepl, mouseLeaveRepl, mouseLeaveSample, mouseOverRepl,
    mouseOverSample, removeRepl
} from "../../actions/sampleSelection";
import {reloadProtein} from "../../actions/loadProtein"

class ProteinVizLegendsContainer extends Component {

    render(){
        const {x, y, width, theoMolWeight, clickedRepl, mouseOverSampleId, mouseOverSampleCB,
            mouseOverReplId, mouseOverReplCB, mouseLeaveReplCB, mouseLeaveSampleCB, mouseClickReplCB,
            removeSelectedReplCB, datasets, reloadProteinCB} = this.props

        return <ProteinVizLegends x={x} y={y} width={width} theoMolWeight={theoMolWeight} clickedRepl={clickedRepl}
                                 mouseOverSampleId={mouseOverSampleId} mouseOverSampleCB={mouseOverSampleCB}
                                 mouseOverReplId={mouseOverReplId} mouseOverReplCB={mouseOverReplCB}
                                 mouseLeaveReplCB={mouseLeaveReplCB} mouseLeaveSampleCB={mouseLeaveSampleCB}
                                 mouseClickReplCB={mouseClickReplCB} removeSelectedReplCB={removeSelectedReplCB}
                                 datasets={datasets} reloadProteinCB={reloadProteinCB}
                >
                </ProteinVizLegends>
    }

}

ProteinVizLegendsContainer.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    theoMolWeight: PropTypes.number.isRequired,
    mouseOverSampleId: PropTypes.string,
    mouseOverReplId: PropTypes.string,
    mouseOverSampleCB: PropTypes.func.isRequired,
    mouseOverReplCB: PropTypes.func.isRequired,
    mouseLeaveReplCB: PropTypes.func.isRequired,
    mouseLeaveSampleCB: PropTypes.func.isRequired,
    mouseClickReplCB: PropTypes.func.isRequired,
    removeSelectedReplCB: PropTypes.func.isRequired,
    clickedRepl: PropTypes.array.isRequired,
    datasets: PropTypes.object.isRequired,
    reloadProteinCB: PropTypes.func.isRequired,
    setDatasets: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const props = {
        clickedRepl : state.sampleSelection.clickedRepl,
        mouseOverSampleId : state.sampleSelection.mouseOverSampleId,
        mouseOverReplId : state.sampleSelection.mouseOverReplId,
        datasets: state.loadProtein.datasets
    }
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {
        mouseOverSampleCB: sampleIdx => { dispatch(mouseOverSample(sampleIdx)) },
        mouseOverReplCB: replIdx => { dispatch(mouseOverRepl(replIdx)) },
        mouseLeaveSampleCB: () => { dispatch(mouseLeaveSample()) },
        mouseLeaveReplCB: () => { dispatch(mouseLeaveRepl()) },
        mouseClickReplCB: (sampleIdx, replIdx) => { dispatch(mouseClickRepl(sampleIdx, replIdx)) },
        removeSelectedReplCB: (sampleIdx, replIdx) => { dispatch(removeRepl(sampleIdx, replIdx)) },
        reloadProteinCB: (activeDatasetIds) => { dispatch(reloadProtein(activeDatasetIds))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProteinVizLegendsContainer)

