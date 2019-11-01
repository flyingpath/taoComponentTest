import React from 'react'

import RoundButtonGroup from '../components/RoundButtonGroup'
import Dialog from '../components/dialog/Dialog'
import CheckBoxes from '../components/check-boxes/CheckBoxes'
import FreeTextWithSnippet from '../components/FreeTextWithSnippet'
import ReactVirtulizeTableWidthSearch from '../components/virtulize-table-search/VirtulizeTableSearch'
import MantainTable from '../components/MantainTable'

import moment from 'moment'

import './style.css'

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            columns:  [
            ],
            data: []
        }
    }

    makeData = (indata) => {
        const columns = [
            { dataKey: 'date',          width: 100,  label: '就醫日期' },
            { dataKey: 'regType',       width: 50,  label: '診別'     },
            { dataKey: 'doc',           width: 50,  label: '主治醫師' },
            { dataKey: 'dept',          width: 50,  label: '科別'     },
            { dataKey: 'opdType',       width: 40,  label: '看診方式'  },
            { dataKey: 'majorIllness',  width: 40,  label: '重大傷病'  },
            { dataKey: 'testPlan',      width: 40,  label: '試辦計畫'  },
            { dataKey: 'weight',        width: 40,  label: '體重 kg'  },
            { dataKey: 'temperature',   width: 40,  label: '體溫 ℃'  },
            { dataKey: 'diagnosis',     width: 250, label: '主診斷'   },
            { dataKey: 'signed',        width: 50,  label: '簽章' }
        ]

        const data = indata.map( (eachData, idx) => {

            const date = moment( eachData.REG_DATE, 'YYYYMMDD' ).format( 'YYYY/MM/DD' )
            const regType = <div className = 'opd-list-td' >{'門'}</div>
            const doc     = <div className = 'opd-list-td' >{ eachData.doc}</div>
            const dept    = <div className = 'opd-list-td' >{ eachData.HDEPT_NAME}</div>
            const opdType = <div className = 'opd-list-td' >{ eachData.opdType}</div>
            const majorIllness = <div className = 'opd-list-td' >{ eachData.PART_CODE === '001' ? 'Y': '' }</div>
            const testPlan     = <div className = 'opd-list-td' >{ eachData.SPC_CASE || '' }</div>
            const weight       = <div className = 'opd-list-td' >{ eachData.WEIGHT? eachData.WEIGHT.toFixed(2) :'' }</div>
            const temperature  = <div className = 'opd-list-td' >{ eachData.TEMP?   eachData.TEMP.toFixed(2) :'' }</div>
            const diagnosis    = <div className = 'opd-list-td' >{ eachData.MAIN_DIAG + ' ' + eachData.MAIN_DIAG_NAME }</div>
            const signed       = <div className = 'opd-list-td' >{ eachData.signedDatetime ? 'Y' : '' }</div>

            return { 
                date  : {
                    element     : ( <div>{date}</div> ),
                    searchKey   : eachData.REG_DATE,
                    orderKey    : eachData.REG_DATE
                }, 
                regType: {
                    element     : regType,
                    searchKey   : regType + 'opd',
                    orderKey    : regType
                },
                doc: {
                    element     : doc,
                    searchKey   : eachData.doc,
                    orderKey    : eachData.doc
                },
                dept: {
                    element     : dept,
                    searchKey   : eachData.dept,
                    orderKey    : eachData.dept
                },
                opdType: {
                    element     : opdType,
                    searchKey   : eachData.opdType,
                    orderKey    : eachData.opdType
                },
                majorIllness: {
                    element     : majorIllness,
                    searchKey   : true,
                    orderKey    : (eachData.PART_CODE === '001')
                },
                testPlan: {
                    element     : testPlan,
                    searchKey   : true,
                    orderKey    : eachData.SPC_CASE
                },
                weight: {
                    element     : weight,
                    searchKey   : eachData.WEIGHT,
                    orderKey    : eachData.WEIGHT 
                },
                temperature: {
                    element     : temperature,
                    searchKey   : eachData.TEMP,
                    orderKey    : eachData.TEMP
                },
                diagnosis: {
                    element     : diagnosis,
                    searchKey   : true,
                    orderKey    : eachData.MAIN_DIAG + ' ' + eachData.MAIN_DIAG_NAME
                },
                signed: {
                    element     : signed,
                    searchKey   : true,
                    orderKey    : eachData.signedDatetime
                },
            }
        } )

        return {
            columns: columns,
            data: data
        }
    }

    componentDidMount () {
        fetch( 'http://172.21.42.23:8555/service/getPatientOutpatientList', {
            method: 'POST',
            body: JSON.stringify({
                chartno: "05828496"
            })
        } )
            .then( d=>d.json() ) 
            .then( back=>{  
                if (back.status){
                    this.setState( this.makeData(back.data) )
                }
            } )
    }



    render() {
        // , border: '1px solid green'

        return (
            <div style = {{height: '500px', margin: '10px'}}>
                <ReactVirtulizeTableWidthSearch { ...this.state } />
            </div>
        )
    }

    // render() {
    //     return (
    //         <div style={{height:'100%', width: '100%', overflow:'hidden' }}>
    //             <FreeTextWithSnippet />
    //             <Dialog onBackClick={ (e)=>{console.log(e)} } />
    //         </div>
    //     )
    // }
        
    // <RabbitMQ />
    // render() {
    //     return (
    //         <div style={{height:'100%', width: '100%', overflow:'hidden' }}>
    //             <CheckBoxes uni withOther onChange={ (data)=>{console.log(data)} } />
    //             <UploadFile />
    //         </div>
    //     )
    // }

    // render() {
    //     return (
    //         <div style={{height:'100%', width: '100%', overflow:'hidden' }}>
    //             <VirtualGridDiv dataItem={testData} />
    //         </div>
    //     )
    // }

}

export default App
