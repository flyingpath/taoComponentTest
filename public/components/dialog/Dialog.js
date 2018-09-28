import React from 'react'

class TaoDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: props.open
        }
    }

    onBackClick = (e) => {
        if ( e.target.id == this.props.id ) {
            if (this.props.onBackClick) {
                this.props.onBackClick(e)
            }
        }
    }

    render() {
        const open = this.props.open
        const body = this.props.children

        const mainClassN = this.props.id + '_class'
        const bodyClassN = this.props.bodyId + '_class'

        if (!open) {
            return <div style={{display: 'none'}}></div>
        
        } else {
            return (
                <div 
                    id        = {this.props.id} 
                    style     = {this.props.backStyle} 
                    onClick   = {this.onBackClick}
                    className = {mainClassN }
                >
                    <div 
                        id    = {this.props.dialogBodyID}
                        style = {this.props.bodyStyle}
                        className = { bodyClassN }
                    >
                        {body}
                    </div>
                    <style jsx>{`
                        @keyframes fadeIn{
                            from {
                                opacity: 0;
                                transform: translate3d(0, -10%, 0);
                            }
                            to {
                                opacity: 1;
                                transform: translate3d(0, 0, 0);
                            }
                        }

                        .${mainClassN} {
                            display: flex; 
                            flex-direction: row; align-items: center;
                            position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px;
                            width: 100%;
                            background: rgba(0, 0, 0, 0.2);
                            background-size: 4px 4px;
                            z-index: 5;
                        }

                        .${bodyClassN} {
                            position: relative;
                            display: flex; flex-direction: row; align-items: center;
                            width: 70%; height: 70%;
                            padding: 15px 25px 15px 25px;
                            border-radius: 5px;
                            font-family: arial, 微軟正黑體;
                            background: white;
                            overflow-y: auto;
                            margin: 0 auto;
                            box-shadow: 0px 2px 10px 5px #80808036;
                            animation: fadeIn .2s linear;
                        }
                    `}</style>
                </div>
            )
        }
    }
}

TaoDialog.defaultProps = {
    open   : true,
    bodyStyle: {},
    backStyle: {},
    id     : "tao-dialog",
    bodyId : "tao-dialog-body",
    onBackClick : ()=>{},
}

export default TaoDialog
