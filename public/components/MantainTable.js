import React from 'react' 
import _ from 'lodash' 

const Column = ({columns, rowData, rowIdx, onChangeColumn}) => {
    return columns.map( ( each, idx )=>(
        <div key={`MTTD${rowIdx}${idx}`} className="MTTD"  >
            <input 
                value={ rowData[ each.value ] } 
                onChange={ onChangeColumn(rowIdx, each.value) } 
                className = "input"
            />
        </div>
    ) )
}

const Row = (props) => {
    
    const data       = props.data
    const columnData = props.columnData
    const onDeleteRow    = props.onDeleteRow
    const onChangeColumn = props.onChangeColumn

    return (
        <React.Fragment>
        {
            data.map( (each, idx)=>(
                <div className = "MTTR flex-row" key={`MTTR${idx}`}>
                    <Column 
                        columns = { columnData }
                        rowData = { each }
                        rowIdx = { idx }
                        onChangeColumn = {onChangeColumn}
                    />
                    <div onClick={ onDeleteRow(idx) } className='delete'>-</div>
                </div>
            ) )
        }
        </React.Fragment>
    )
}

const AddRow = (props) => {
    
    const columns = props.columns
    const data = props.newData
    const onChange = props.onChange

    return columns.map( ( each, idx )=>(
        <div key={`MTADDTD$${idx}`} className = "MTTD MTTD-add table-column" >
            <input 
                value = { each.value in data? data[ each.value ]:'' } 
                onChange = { onChange(each.value) }
                className = "input"
            />
        </div>
    ) )
}

class MaintainTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listColumnName: [],
            listData   : [],
            newData    : {},
            columnWidth: props.columnWidth
        }
    }

    static getDerivedStateFromProps( nextProps, preState ){
        if (
            preState.listColumnName != nextProps.listColumnName 
            && preState.listData != nextProps.listData 
        ){
            return {
                listColumnName:nextProps.listColumnName,
                listData:nextProps.listData,
                newData: {}
            }
        } else {
            return null
        }
    }

    componentDidUpdate () {
        const data = this.state.listData
        this.props.onChange(data)
    }

    onChangeAdd = (key)=> {
        return (e) => {
            let newData = _.cloneDeep( this.state.newData )
            newData[ key ] = e.target.value
            this.setState({
                newData: newData
            })
        }
    }

    deleteRow = (index) => {
        return (e)=>{
            let newData = _.cloneDeep(this.state.listData)
            newData.splice( index, 1 )
            this.setState({
                listData: newData
            })
        }
    }

    addRow = () => {

        const data = _.cloneDeep(this.state.newData)
        const columnData = this.state.listColumnName

        _.forEach(columnData, (each, idx)=>{
            if ( !(each.value in data) ){
                data[each.value] = null
            }
        })

        let newData = _.cloneDeep(this.state.listData)
        newData.push( this.state.newData )

        this.setState({
            listData: newData,
            newData : {}
        })
    }

    onChangeInput = (rowIdx, key) => {
        return (e) => {
            const value = e.target.value 
            
            let newListData = _.cloneDeep(this.state.listData) 
            newListData[rowIdx][key] = value

            this.setState({
                listData: newListData
            })
        }
    }

    onSave = () => {
        const data = this.state.listData
        this.props.onSave(data)
    }

    render() {

        const globalWidth = this.state.columnWidth

        return (
            <div className='AppBody' style={ this.props.backStyle || null } >
            <div className='table'   style={ this.props.tableStyle || null } >
                <div>
                    <div className = "MT-header flex-row">
                        { this.state.listColumnName.map( (each, idx)=>(
                            <div className = "MTTD" key = { idx } >
                                {each.label}
                            </div>
                        ) ) }
                    </div>
                    <div className = "MT-outter">
                        <Row 
                            data       = {this.state.listData} 
                            columnData = {this.state.listColumnName}
                            onChangeColumn = { this.onChangeInput }
                            onDeleteRow    = { this.deleteRow }
                        />
                        <div className = "MTTR flex-row">
                            <AddRow 
                                columns = { this.state.listColumnName }
                                newData = { this.state.newData }
                                onChange = { this.onChangeAdd }
                            />
                            <div onClick = { this.addRow } className = 'add' >
                                +
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                this.props.hasSaveButton && 
                <button 
                    className='saveButton' 
                    onClick = {this.onSave}
                    style={ this.props.saveButtonStyle || null }
                >
                存檔
                </button>
            }
            <style jsx>{`
                .table {
                    position: relative; 
                    width: 100%;
                    padding-right: 25px;
                    box-sizing: border-box;
                }
                .AppBody{
                    width: ${globalWidth}px;
                    position: relative;
                    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.5);
                    padding: 0px 10px 5px 10px;
                    border-radius: 5px;
                    text-align: left;
                }
                .AppBody :global(.flex-row) {
                    display: flex;
                    flex-direction: row;
                    justify-content: stretch;
                }
                .AppBody :global(.input) {
                    width: 100%;
                    border-top: none;
                    border-right: none;
                    border-left: none;
                }
                .AppBody :global(.delete) {
                    width: 22px;
                    position: absolute;
                    right: 0px;
                    padding: 0px 7px;
                    border-radius: 2px;
                    color: white;
                    background: rgba(255, 118, 223, 0.8);
                    font-weight: bold;
                    cursor: pointer;
                    box-sizing: border-box;
                    text-align:center;
                    display: none;
                }
                .AppBody :global(.delete):active {
                    background: rgba(255, 118, 223, 0.4);
                }
                .AppBody :global(.add) {
                    width: 22px;
                    position: absolute;
                    right: -25px;
                    cursor: pointer;
                    padding: 0px 7px;
                    background: rgba(23, 198, 136, 0.8);
                    border-radius: 2px;
                    font-weight: bold;
                    color: white;
                    text-align:center;
                    box-sizing: border-box;
                }
                .AppBody :global(.add):active {
                    background: rgba(23, 198, 136, 0.4);
                }
                .AppBody :global(.MTTD) {
                    padding: 2px 0px 0px 4px;
                    margin-right: 4px;
                    flex:1;
                }
                .AppBody :global(.MTTR) {
                    position: relative;
                }
                .AppBody :global(.MTTR:hover .delete) {
                    display: block;
                }
                .AppBody :global(.MT-outter) {
                    // border: 1px solid gray;
                    // border-radius: 5px;
                }
                .AppBody :global(.MT-header .MTTD) {
                    border-bottom: 2px solid #52a8ff;
                }
                .saveButton{
                    position: relative;
                    left: 70%;
                    border: none;
                    border-radius: 5px;
                    padding: 6px 10px;
                    margin: 15px 0px 5px 0px;
                    background: none;
                    box-shadow: 1px 1px 4px 0px rgba(50, 88, 192, 0.5);
                    cursor:pointer;
                }
                .saveButton:focus {
                    outline: 1px dashed rgba(50,88,192,0.1);
                }
                .saveButton:active {
                    box-shadow: 0px 0px 1px 1px rgba(50,88,192,0.2)
                }
            `}</style>
            </div>
        )
    }
}

MaintainTable.defaultProps = {
    columnWidth: 250,
    listColumnName: [
        {
            "label": "名稱",
            "value": "label"
        },
        {
            "label": "代碼",
            "value": "value"
        }
    ],
    listData: [
        {
            "label": "R1",
            "value": "R1",
        },
        {
            "label": "R9",
            "value": "R8",
            "order": 9
        }
    ],
    hasSaveButton: true,
    onSave: () =>{},
    onChange: () =>{},
    backStyle: null,
    tableStyle: null,
    saveButtonStyle: null,
}
export default MaintainTable