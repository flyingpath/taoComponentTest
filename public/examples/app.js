import React from 'react'

import RoundButtonGroup from '../components/RoundButtonGroup'
import Dialog from '../components/dialog/Dialog'
import CheckBoxes from '../components/check-boxes/CheckBoxes'
import FreeTextWithSnippet from '../components/FreeTextWithSnippet'
import ReactVirtulizeTableWidthSearch from '../components/virtulize-table-search/VirtulizeTableSearch'
import MantainTable from '../components/MantainTable'

import './style.css'

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    handleClick = ()=>{
    }

    render() {
        return (
            <div style = {{height: '500px', border: '1px solid green', margin: '10px'}}>
                <ReactVirtulizeTableWidthSearch />
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
