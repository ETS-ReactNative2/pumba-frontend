import fetch from 'cross-fetch'
import pumbaConfig from '../config'
import { resetSampleSelection } from "./sampleSelection"
import { resetProteinView } from "./proteinVizActions"
import {resetPeptideView} from "./peptideVizActions";
import * as _ from 'lodash';

export const PROTEIN_IS_LOADED = 'PROTEIN_IS_LOADED'
export const REQUEST_PROTEIN = 'REQUEST_PROTEIN'
export const ADD_PROTEIN_DATA = 'ADD_PROTEIN_DATA'
export const PROTEIN_LOAD_ERROR = 'PROTEIN_LOAD_ERROR'
export const GOTO_VIZ = 'GOTO_VIZ'
export const ADD_SEQUENCE_DATA = 'ADD_SEQUENCE_DATA'
export const SET_DATASETS = 'SET_DATASETS'

export function fetchProtein(proteinId, activeDatasets){
    const datasetIds = activeDatasets.join(',')

    return function (dispatch) {
        dispatch(requestProtein(proteinId))

        // we reset the error message to undefined
        dispatch(proteinLoadError(undefined))

        // and reset settings from the views
        dispatch(resetProteinView())
        dispatch(resetPeptideView())
        dispatch(resetSampleSelection())

        return fetch(pumbaConfig.urlBackend + "/merge-protein/" + proteinId + '?dataSetsString=' + datasetIds)
            .then( response => {
                if (!response.ok) { throw response }
                return response.json()
            })
            .then(json => {
                    // add timestamp
                    json.timestamp = Date.now()
                    // let's take the FASTA data from the first entry (should always be OK)
                    const dataBaseName = json[0].proteins[0].dataSet.dataBaseName
                    dispatch(fetchSequence(proteinId, dataBaseName))

                    dispatch(addProteinData(json))
                    dispatch(proteinIsLoaded())
                    dispatch(gotoViz(true))
                }
            )
            .catch(err => {
                // we have to catch error messages differently for if backend is on or off.
                if(err.message){
                    dispatch(proteinLoadError(err.message))
                }else{
                    err.text().then(message => {
                        dispatch(proteinLoadError(err.statusText + ": " + message))
                    })
                }
                dispatch(proteinIsLoaded())
            })
    }
}

export function fetchSequence(proteinId, dataBaseName){
    return function (dispatch){
        return fetch(pumbaConfig.urlBackend + "/sequence/" + proteinId + "/database/" + dataBaseName)
            .then( response => {
                if (!response.ok) { throw response }
                return response.json()
            })
            .then(json => {
                    dispatch(addSequenceData(json))
                }
            )
            .catch(err => {
                // we have to catch error messages differently for if backend is on or off.
                if(err.message){
                    dispatch(proteinLoadError(err.message))
                }else{
                    err.text().then(message => {
                        dispatch(proteinLoadError(err.statusText + ": " + message))
                    })
                }
            })
    }
}

export function fetchDatasets(){
    return function (dispatch){
        return fetch(pumbaConfig.urlBackend + "/dataset")
            .then( response => {
                if (!response.ok) { throw response }
                return response.json()
            })
            .then(json => {
                // parse a list of datasets and add them
                var idx = 0;

                const samples = _.reduce(json, (res, val) => {
                    if(! res[val.sample]){
                        res[val.sample] = {}
                        res[val.sample].isActive = true
                        res[val.sample].datasets = []
                        res[val.sample].idx = idx ++;
                    }
                    res[val.sample].datasets.push({id: val.id, name: val.name, isActive: true})
                    return res
                }, {})

                dispatch(setDatasets(samples))
            })
            .catch(err => {
                // we have to catch error messages differently for if backend is on or off.
                if(err.message){
                    dispatch(proteinLoadError(err.message))
                }else{
                    err.text().then(message => {
                        dispatch(proteinLoadError(err.statusText + ": " + message))
                    })
                }
            })
    }
}


export const setDatasets = (datasets) => ({
    type: SET_DATASETS, datasets: datasets
})

export const addProteinData = (proteinData) => ({
    type: ADD_PROTEIN_DATA, proteinData: proteinData
})

export const requestProtein = (proteinId) => ({
    type: REQUEST_PROTEIN, proteinId: proteinId
})

export const proteinIsLoaded = (proteinData) => ({
    type: PROTEIN_IS_LOADED, proteinData: proteinData
})

export const proteinLoadError = (error) => ({
    type: PROTEIN_LOAD_ERROR, error: error
})

export const gotoViz = (gotoViz) => ({
    type: GOTO_VIZ, gotoViz: gotoViz
})

export const addSequenceData = (sequenceData) => ({
    type: ADD_SEQUENCE_DATA, sequenceData: sequenceData
})