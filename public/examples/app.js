import React from 'react'

import RoundButtonGroup from '../components/RoundButtonGroup'
import Dialog from '../components/dialog/Dialog'
import CheckBoxes from '../components/check-boxes/CheckBoxes'
import FreeTextWithSnippet from '../components/FreeTextWithSnippet'
import MantainTable from '../components/MantainTable'

class RenderForcer extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    handleClick = ()=>{
    }

    render() {
        return (
            <div style={{height:'100%', width: '100%', overflow:'hidden' }}>
                <MantainTable onChange={(d)=>console.log(d)} />
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

export default RenderForcer
