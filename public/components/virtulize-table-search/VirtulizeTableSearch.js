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
            data   : this.props.data
        }

        this.data  = this.props.data
    }


    handleClick = () => {
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({columns}) => ({
            columns: arrayMove(columns, oldIndex, newIndex)
        }))
    }

    onChangeFilter = () => {

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

                console.log(column.label)
                console.log(newProps)

                return ( 
                    <div { ...newProps } key = {idx} className = {'header-div'} >
                        <div>
                            <input />
                        </div>
                        <div className='label' >
                            { column.label }
                        </div>
                        <style jsx>{`
                            .header-div {
                                padding: 5px;
                                background: #5656ff;
                                color: white;
                                height: 100%;
                                box-sizing: border-box;
                            }
                            input {
                                
                            }
                            .label {
                                margin: 5px 0px;
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
                height: 70px;
                font-weight: 700;
                display: flex;
                flex-direction: row;
                align-items: center;
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

                return ( <div { ...newProps } key = {idx} >{ data[ column.dataKey ].element }</div> )
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
        this.data  = data

        const columns = this.state.columns

        let widthAverage = false
        columns.forEach( d => {
            if (!d.width) {
                widthAverage = true
            }
        } )

        return (
            <AutoSizer style={ { height: '100%', width: '100%' } } >
            {({ height, width }) => {
                return (
                    <Table
                        width       = { width }
                        height      = { height }
                        headerHeight= { 70 }
                        rowHeight   = { 100 }
                        rowCount    = { this.data.length }
                        rowRenderer = { this.rowRenderer }
                        rowGetter   = { ({ index }) => this.data[index] }
                        headerRowRenderer = { this.renderHeaderRow }
                        style       = {{
                            border: '1px solid black'
                        }}
                    >
                        {   columns.map( (d, idx) => (
                            <Column
                                { ...d } 
                                key      = { idx } 
                                flexGrow = {1}
                                width    = { widthAverage? 100 : (100 * d.width) }
                            />
                        ) )}
                    </Table>
                )
            }}
            </AutoSizer>
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