import React, { Component } from 'react' 
import _ from 'lodash' 
import styled from 'styled-components'

class Checkboxes extends React.Component {
    constructor(props) {
        super(props)
        
        // -- 抓出中文名稱

        this.data = props.data.map((x)=>x.name)
        if (props.withOther){
            this.data.push('其它') //-- 需要其它的話加上其它
        }

        // -- 置入預設值
        let value = []
        _.forEach(this.data, (item, key) => {
            if (props.uni && props.defaultValue === key){
                value.push(true)
            }else{
                value.push(false)
            }
        })
        
        // -- 初始化 state
        this.state = {
            value: value,
            textValue: '',
            memo: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.textOtherChange = this.textOtherChange.bind(this)
        this.textMemoChange = this.textMemoChange.bind(this)
        this.firePreOnchange = this.firePreOnchange.bind(this)

        // -- 要送出的資料
        this.ouputData = {
            data: this.data.filter((x, idx)=>value[idx]),
            other: '',
            memo: ''
        }
    }
        // -- 初始後送出資料(全預設值)
    componentDidMount(){
        _.delay(this.firePreOnchange, 500)
    }

        // -- onChange 時送出資料
    firePreOnchange(){
        this.props.onChange(this.ouputData, this.props.order)
    }
    
    textOtherChange(e){
        const v = e.target.value
        this.ouputData.other = v
        this.setState({
            textValue: v
        })
        this.firePreOnchange()
    }

    textMemoChange(e){
        const v = e.target.value 
        this.ouputData.memo = v
        this.setState({
            memo: v
        })
        this.firePreOnchange()
    }

    handleChange(value) {
        return ()=>{
            const data = this.data
            const uni = this.props.uni
            const prevValue = this.state.value
    
            let newValue = []
            _.forEach(data, (item, key) => {
                if (uni && (value == key) ){
                    newValue.push(true)
                }else if (!uni && (value == key) ){
                    newValue.push(!prevValue[key])
                }else if (!uni){
                    newValue.push(prevValue[key])
                }else {
                    newValue.push(false)
                }
            })
    
            this.ouputData.data = data.filter((each, idx)=>(
                newValue[idx]
            ))
            let othertext = this.state.textValue
            if(this.ouputData.data.indexOf('其它')==-1){
                othertext = ''
                this.ouputData.other = ''
            }
            
            this.setState({
                value: newValue,
                textValue: othertext
            })
            
            this.firePreOnchange()
        }
    }

    render() {
        const data = this.data
        const withOther = this.props.withOther
        const label = this.props.label

        const nowCheck = this.state.value
        const withMemo = this.props.withMemo
        
        const OutterDiv = this.styledComponent.outterDiv
        const TitleDiv = this.styledComponent.titleDiv
        const LabelSpan = this.styledComponent.labelSpan
        const ConstentDiv = this.styledComponent.constentDiv
        const ItemDiv = this.styledComponent.itemDiv
        const Input = this.styledComponent.input
        
        let memoText = null
        if (withMemo){
            const InputMemo = this.styledComponent.inputMemo
            memoText = 
                <div>
                    <div style={{padding: '5px 0px'}}>
                        備註：
                    </div>
                    <InputMemo
                        value = {this.state.memo}
                        onChange = {this.textMemoChange}
                    />
                </div>
        }

        const body = _.map(data, (item, key) => {
            const checked = nowCheck[key]
            const withOther = this.props.withOther
            const isOther = (item === '其它')
            const InputText = this.styledComponent.inputText
            
            let inputItem = null
            if (checked && isOther){
                inputItem = 
                    <InputText 
                        type = "text"
                        value = {this.state.textValue}
                        onChange = {this.textOtherChange}
                    />
            }
            return (
                <ItemDiv key={key}>
                    <Input 
                        type="checkbox" 
                        name={item}
                        onChange = {this.handleChange(key)}
                        checked = {nowCheck[key]}
                    />
                    <LabelSpan onClick = {this.handleChange(key)}>
                        {item}
                    </LabelSpan>
                    {inputItem}
                </ItemDiv>
            )
        })
        
        return (
            <OutterDiv>
                <TitleDiv className='optionTitleLabel' >{label}</TitleDiv>
                <ConstentDiv>
                    {body}
                </ConstentDiv>
                {memoText}
            </OutterDiv>
        )
    }

    styledComponent = {
        itemDiv: styled.div`
            display: flex;
            flex-direction: row;
            align-items: center;
        `,
        constentDiv: styled.div`
            display: flex;
            flex-flow: wrap row;
        `,
        input: styled.input`
            width: 18px;
            height: 18px;
        `,
        outterDiv: styled.div`
            padding: 5px;
            font-family: 標楷體;
        `,
        titleDiv: styled.div`
            margin-bottom: 5px;
            font-size: 120%;
            font-weight: bold;
        `,
        labelSpan: styled.span`
            margin-right: 5px;
            padding: 2px;
        `,
        inputText: styled.input`
            max-width: 120px;
        `,
        inputMemo: styled.textarea`
        `,
    }
}

Checkboxes.defaultProps = {
    label: '選擇:',
    data: [
        { 
            value:"a",
            name: "a"
        },
        { 
            value:"b",
            name: "b"
        },
        { 
            value:"c",
            name: "c"
        }],
    defaultValue: 0,
    uni: false,
    withOther: false,
    withMemo: false,
    onChange: ()=>{}
}

export default Checkboxes