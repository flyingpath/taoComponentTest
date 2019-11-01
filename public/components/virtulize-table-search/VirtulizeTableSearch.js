import React from 'react' 
import _ from 'lodash' 

import arrayMove from 'array-move'
import { AutoSizer } from 'react-virtualized'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import { defaultTableRowRenderer, Table, Column } from 'react-virtualized'

import css from 'styled-jsx/css'

import 'react-virtualized/styles.css'

const SortableHeader = sortableElement(({children, ...props}) =>
    React.cloneElement(children, props)
)

const SortableHeaderRowRenderer = sortableContainer(
    ({className, columns, style}) => (
        <div className={className} role="row" style={style}>
            {React.Children.map(columns, (column, index) => (
                <SortableHeader index={index}>{column}</SortableHeader>
            ))}
        </div>
    )
)

class VirtulizeTableSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: this.props.columns,
            data   : this.props.data,
            filterdData: this.props.data
        }

        this.filterDict = {
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if ( prevProps.data !== this.props.data || prevProps.columns !== this.props.columns ) {
            if ( this.props.data !== this.state.data || this.props.columns !== this.state.columns ) {
                this.setState({
                    columns: this.props.columns,
                    data: this.props.data,
                    filterdData: this.props.data
                })
            }
        }
    }
    

    handleClick = () => {
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({columns}) => ({
            columns: arrayMove(columns, oldIndex, newIndex)
        }))
    }

    filterData = () => {
        let newData = this.state.data

        _.forIn( this.filterDict, ( value, key ) => {
            newData = _.filter( newData, d => {
                const searchString = d[ key ].searchKey
                if ( value === '' ){
                    return true
                } else {
                    if ( searchString === true ) {
                        return true
                    } else if ( searchString === false ) {
                        return false
                    } else {
                        if ( String(searchString).toLowerCase().indexOf(value.toLowerCase()) > -1 ){
                            return true
                        } else {
                            return false
                        }
                    }
                }
            } )
        } )
        this.setState( { 
            filterdData: newData
        } )
    }

    onChangeSearchFilter = ( key ) => {

        return (e) => {
            
            const value = e.target.value 
            this.filterDict[ key ] = value
            this.filterData()
        }
    }

    // 加工 header 以增加搜尋功能
    headerColumnMaker = (props) => {
        return (
            props.columns.map( (d, idx) => {
                const column = this.state.columns[ idx ]

                let newProps = Object.assign( {}, d.props )

                newProps.className = 'header-column'

                delete newProps.title
                delete newProps.children

                return ( 
                    <div { ...newProps } key = {idx} className = {'header-div'} >
                        <div className = 'input-parent' >
                            <input onChange = { this.onChangeSearchFilter( column.dataKey ) } />
                        </div>
                        <div className='label' >
                            { column.label }
                        </div>
                        <style jsx>{`
                            .header-div {
                                padding: 5px;
                                color  : #707070;
                                height : 100%;
                                box-sizing: border-box;
                            }
                            .input-parent {
                                padding-left: 5px;
                            }
                            input {
                                max-width : 40px;
                                box-sizing: border-box;
                                background: none;
                                border    : none;
                                border    : 1px solid #dddddd;
                                color     : #707070;
                                padding   : 2px 4px;
                            }
                            input:focus {
                                outline: none;
                            }
                            .label {
                                margin: 5px 0px;
                                padding: 0px 5px;
                            }
                        `}</style>
                    </div> 
                )
            } )
        )
    }

    renderHeaderRow = (params) => {

        const columns = this.headerColumnMaker( params )

        params.columns = columns
        delete params.style.paddingRight
        delete params.style.height
        delete params.className

        const { className, styles } = css.resolve`
            div {
                display       : flex;
                flex-direction: row;
                align-items   : baseline;
                background    : #f5f5f5;
                /* border-radius : 6px; */
                border        : 1px solid #707070;
                box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.16);
            }
        `

        return (
            <React.Fragment >
                <SortableHeaderRowRenderer
                    {...params}
                    className = {className + ' header-row'}
                    axis      = "x"
                    lockAxis  = "x"
                    onSortEnd = {this.onSortEnd}
                />
                {styles}
            </React.Fragment>
        )
    }
  

    rowColumnMaker = (props) => {
        const data  = props.rowData
        return (
            props.columns.map( (d, idx) => {
                const column = this.state.columns[ idx ]

                let newProps = Object.assign( {}, d.props )

                delete newProps.title
                delete newProps.children

                return ( 
                    <div { ...newProps } key = {idx} >
                        { data[ column.dataKey ].element }
                        <style jsx >{`
                            div { 
                            }
                        `}</style>
                    </div> 
                )
            } )
        )
    }

    rowRenderer = (props) => {
        const columns = this.rowColumnMaker( props )
        props.columns = columns

        return defaultTableRowRenderer(props)
    }

    render() {

        const data = this.state.data
        const filterdData = this.state.filterdData

        const columns = this.state.columns

        let widthAverage = false
        columns.forEach( d => {
            if (!d.width) {
                widthAverage = true
            }
        } )

        const { className, styles } = css.resolve`
            div :global(.ReactVirtualized__Table__Grid) {
                border: 1px solid #707070;
                margin-top: 10px;
                border-radius: 5px;
                color: #545353;
                box-shadow: 3px 3px 8px 0 rgba(0, 0, 0, 0.16);
            }
            div :global(.ReactVirtualized__Table__Grid::-webkit-scrollbar) {
                width: 2px;
                height: 4px;
            }
            div :global(.ReactVirtualized__Table__Grid::-webkit-scrollbar-track) {
                background: none;
            }
            div :global(.ReactVirtualized__Table__Grid::-webkit-scrollbar-thumb) {
                background: #a8a1a1;
            }
            div :global(.ReactVirtualized__Table__Grid::-webkit-scrollbar-thumb:hover ) {
                background: #2196f37d;
            }
            div :global(.ReactVirtualized__Table__rowColumn) {
                min-width: 45px;
            }
        `
        return (
            <div style={ { minWidth: 700, height: '100%' } } >
                <AutoSizer style={ { height: '100%', width: '100%' } } >
                {({ height, width }) => {
                    return (
                        <React.Fragment>
                            <div className = 'table-title'  >
                                門診紀錄列表
                            </div>
                            <Table
                                width       = { width-2 }
                                height      = { height }
                                headerHeight= { 70 }
                                rowHeight   = { 100 }
                                rowCount    = { filterdData.length }
                                rowRenderer = { this.rowRenderer }
                                rowGetter   = { ({ index }) => filterdData[index] }
                                headerRowRenderer = { this.renderHeaderRow }
                                style       = {{
                                    borderRadius: '5px'
                                }}
                                className = {className}
                            >
                                {   columns.map( (d, idx) => (
                                    <Column
                                        { ...d } 
                                        key      = { idx } 
                                        flexGrow = {1}
                                        width    = { widthAverage? 100 : (d.width) }
                                    />
                                ) )}
                            </Table>
                            {styles}
                            <style jsx>{`
                                .table-title{
                                    text-align: center;
                                    padding: 10px;
                                    background-image: linear-gradient(266deg, rgba(16, 121, 204, 0.73), #1768a8);
                                    color: white;
                                    font-size: 21px;
                                    margin-bottom: 5px;
                                }
                            `}</style>
                        </React.Fragment>
                    )
                }}
                </AutoSizer>
            </div>
        )
    }
}

VirtulizeTableSearch.defaultProps = {
    columns:  [
        { dataKey: 'name',        label: 'name' },
        { dataKey: 'description', label: 'description' },
        { dataKey: 'danger',      label: '危機值' },
    ],
    data: [
        { 
            name  : {
                element     : ( <div>1234</div> ),
                searchKey   : 'Brian Vaughn1',
                orderKey    : 'Brian Vaughn1'
            }, 
            description: {
                element     : ( <div>1234</div> ),
                searchKey   : 'Software engineer',
                orderKey    : 'Software engineer'
            },
            danger: {
                element     : ( <div>o</div> ),
                searchKey   : true,
                orderKey    : 1
            }
        },
        { 
            name  : {
                element     : ( <div>12343</div> ),
                searchKey: 'Brian Vaughn2',
                orderKey    : 'Brian Vaughn2'
            }, 
            description: {
                element     : ( <div>1234</div> ),
                searchKey   : 'Software engineer2',
                orderKey    : 'Software engineer2'
            },
            danger: {
                element     : ( <div></div> ),
                searchKey   : false,
                orderKey    : 0
            }
        },
        { 
            name  : {
                element     : ( <div></div> ),
                searchKey   : 'Brian Vaughn3',
                orderKey    : 'Brian Vaughn3'
            }, 
            description: {
                element     : ( <div>xxxxx</div> ),
                searchKey   : 'Software engineer3',
                orderKey    : 'Software engineer3'
            },
            danger: {
                element     : ( <div></div> ),
                searchKey   : false,
                orderKey    : 0
            }
        },
        { 
            name  : {
                element     : ( <div></div> ),
                searchKey   : 'Brian Vaughn3',
                orderKey    : 'Brian Vaughn3'
            }, 
            description: {
                element     : ( <div>xxxxx</div> ),
                searchKey   : 'Software engineer3',
                orderKey    : 'Software engineer3'
            },
            danger: {
                element     : ( <div></div> ),
                searchKey   : false,
                orderKey    : 0
            }
        },
        { 
            name  : {
                element     : ( <div></div> ),
                searchKey   : 'Brian Vaughn3',
                orderKey    : 'Brian Vaughn3'
            }, 
            description: {
                element     : ( <div>xxxxx</div> ),
                searchKey   : 'Software engineer3',
                orderKey    : 'Software engineer3'
            },
            danger: {
                element     : ( <div></div> ),
                searchKey   : false,
                orderKey    : 0
            }
        },
        { 
            name  : {
                element     : ( <div></div> ),
                searchKey   : 'Brian Vaughn3',
                orderKey    : 'Brian Vaughn3'
            }, 
            description: {
                element     : ( <div>xxxxx</div> ),
                searchKey   : 'Software engineer3',
                orderKey    : 'Software engineer3'
            },
            danger: {
                element     : ( <div></div> ),
                searchKey   : false,
                orderKey    : 0
            }
        }
    ]
}

export default VirtulizeTableSearch  