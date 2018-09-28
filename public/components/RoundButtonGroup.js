import React, { Component } from 'react'
import styled, {keyframes} from 'styled-components'

class RoundButtonGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openSub: false
        }
        this.clickSend = this.clickSend.bind(this)
        this.bodyClick = this.bodyClick.bind(this)
    }
    clickSend(){
    }

    componentDidMount(){
    }

    bodyClick(){
        this.setState({
            openSub: !this.state.openSub
        })
    }

    render() {
        const subNum = 3
        const width = 30
        const bodyContent = this.props.body
        const content = this.props.subArray 
        const Body = styled.div`
            display: flex;
            width: ${width}px;
            height: ${width}px;
            border-radius: 50%;
            border: 1px solid;
            align-items: center;
            justify-content: center;
            position: relative;
            color:#00208c;
            border: none;
            font-family: monospace;
            background: radial-gradient(circle at 10px 5px,#b8dbff,#8fc6fd,#407dab);
            cursor:pointer;
        `

        return (
            <Body onClick={this.bodyClick}>
                { 
                    (()=>{
                        if(this.state.openSub){
                            return this.makeSub(subNum, width, content)
                        }
                    })()
                }
                <div>
                    {bodyContent}
                </div>
            </Body>
        )
    }

    makeSub (num, bodyWidth, content){
        let rtnArray = []
        const width = bodyWidth*0.8
        const longSide = width+5
        const appear=keyframes`
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        `

        for (let i = 1; i<=num; i++){
            const x = longSide * Math.cos(-Math.PI/2 + Math.PI*(i-1)/3)
            const y = longSide * Math.sin(-Math.PI/2 + Math.PI*(i-1)/3)

            const Element = styled.div`
                display: flex;
                width: ${width}px;
                height: ${width}px;
                border-radius: 50%;
                border: 1px solid;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: ${y}px;
                left: ${(bodyWidth-width)+x}px;
                animation: ${appear} .4s linear;
                animation-delay: ${0.1*(i-1)}s;
                opacity: 0;
                animation-fill-mode: forwards;
                color: white;
                border: none;
                font-family: monospace;
                background: radial-gradient(circle at 2px 0px,#87d2ff,#1348c6);
                cursor: pointer;
                font-weight: bold;
            `
            rtnArray.push(
                <Element key={i} onClick={()=>{this.props.onClick(i)}}>
                    <div>
                        {content[i-1]}
                    </div>
                </Element>
            )
        }

        return rtnArray
    }
}

RoundButtonGroup.defaultProps={
    onClick: (i)=>{},
    body: 'V1',
    subArray: ['V1', 'V2', 'V3']
}

export default RoundButtonGroup