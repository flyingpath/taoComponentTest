var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _JSXStyle from 'styled-jsx/style';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import _ from 'lodash';

var Column = function Column(_ref) {
    var columns = _ref.columns,
        rowData = _ref.rowData,
        rowIdx = _ref.rowIdx,
        onChangeColumn = _ref.onChangeColumn;

    return columns.map(function (each, idx) {
        return React.createElement(
            'div',
            { key: 'MTTD' + rowIdx + idx, className: 'MTTD' },
            React.createElement('input', {
                value: rowData[each.value],
                onChange: onChangeColumn(rowIdx, each.value),
                className: 'input'
            })
        );
    });
};

var Row = function Row(props) {

    var data = props.data;
    var columnData = props.columnData;
    var onDeleteRow = props.onDeleteRow;
    var onChangeColumn = props.onChangeColumn;

    return React.createElement(
        React.Fragment,
        null,
        data.map(function (each, idx) {
            return React.createElement(
                'div',
                { className: 'MTTR flex-row', key: 'MTTR' + idx },
                React.createElement(Column, {
                    columns: columnData,
                    rowData: each,
                    rowIdx: idx,
                    onChangeColumn: onChangeColumn
                }),
                React.createElement(
                    'div',
                    { onClick: onDeleteRow(idx), className: 'delete' },
                    '-'
                )
            );
        })
    );
};

var AddRow = function AddRow(props) {

    var columns = props.columns;
    var data = props.newData;
    var onChange = props.onChange;

    return columns.map(function (each, idx) {
        return React.createElement(
            'div',
            { key: 'MTADDTD$' + idx, className: 'MTTD MTTD-add table-column' },
            React.createElement('input', {
                value: each.value in data ? data[each.value] : '',
                onChange: onChange(each.value),
                className: 'input'
            })
        );
    });
};

var MaintainTable = function (_React$Component) {
    _inherits(MaintainTable, _React$Component);

    function MaintainTable(props) {
        _classCallCheck(this, MaintainTable);

        var _this = _possibleConstructorReturn(this, (MaintainTable.__proto__ || Object.getPrototypeOf(MaintainTable)).call(this, props));

        _this.onChangeAdd = function (key) {
            return function (e) {
                var newData = _.cloneDeep(_this.state.newData);
                newData[key] = e.target.value;
                _this.setState({
                    newData: newData
                });
            };
        };

        _this.deleteRow = function (index) {
            return function (e) {
                var newData = _.cloneDeep(_this.state.listData);
                newData.splice(index, 1);
                _this.setState({
                    listData: newData
                });
            };
        };

        _this.addRow = function () {

            var data = _.cloneDeep(_this.state.newData);
            var columnData = _this.state.listColumnName;

            _.forEach(columnData, function (each, idx) {
                if (!(each.value in data)) {
                    data[each.value] = null;
                }
            });

            var newData = _.cloneDeep(_this.state.listData);
            newData.push(_this.state.newData);

            _this.setState({
                listData: newData,
                newData: {}
            });
        };

        _this.onChangeInput = function (rowIdx, key) {
            return function (e) {
                var value = e.target.value;

                var newListData = _.cloneDeep(_this.state.listData);
                newListData[rowIdx][key] = value;

                _this.setState({
                    listData: newListData
                });
            };
        };

        _this.onSave = function () {
            var data = _this.state.listData;
            _this.props.onSave(data);
        };

        _this.state = {
            listColumnName: [],
            listData: [],
            newData: {},
            columnWidth: props.columnWidth
        };
        return _this;
    }

    _createClass(MaintainTable, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var data = this.state.listData;
            this.props.onChange(data);
        }
    }, {
        key: 'render',
        value: function render() {

            var globalWidth = this.state.columnWidth;

            return React.createElement(
                'div',
                { style: this.props.backStyle || null, className: _JSXStyle.dynamic([['3936761195', [globalWidth]]]) + ' ' + 'AppBody'
                },
                React.createElement(
                    'div',
                    { style: this.props.tableStyle || null, className: _JSXStyle.dynamic([['3936761195', [globalWidth]]]) + ' ' + 'table'
                    },
                    React.createElement(
                        'div',
                        {
                            className: _JSXStyle.dynamic([['3936761195', [globalWidth]]])
                        },
                        React.createElement(
                            'div',
                            {
                                className: _JSXStyle.dynamic([['3936761195', [globalWidth]]]) + ' ' + 'MT-header flex-row'
                            },
                            this.state.listColumnName.map(function (each, idx) {
                                return React.createElement(
                                    'div',
                                    { key: idx, className: _JSXStyle.dynamic([['3936761195', [globalWidth]]]) + ' ' + 'MTTD'
                                    },
                                    each.label
                                );
                            })
                        ),
                        React.createElement(
                            'div',
                            {
                                className: _JSXStyle.dynamic([['3936761195', [globalWidth]]]) + ' ' + 'MT-outter'
                            },
                            React.createElement(Row, {
                                data: this.state.listData,
                                columnData: this.state.listColumnName,
                                onChangeColumn: this.onChangeInput,
                                onDeleteRow: this.deleteRow
                            }),
                            React.createElement(
                                'div',
                                {
                                    className: _JSXStyle.dynamic([['3936761195', [globalWidth]]]) + ' ' + 'MTTR flex-row'
                                },
                                React.createElement(AddRow, {
                                    columns: this.state.listColumnName,
                                    newData: this.state.newData,
                                    onChange: this.onChangeAdd
                                }),
                                React.createElement(
                                    'div',
                                    { onClick: this.addRow, className: _JSXStyle.dynamic([['3936761195', [globalWidth]]]) + ' ' + 'add'
                                    },
                                    '+'
                                )
                            )
                        )
                    )
                ),
                this.props.hasSaveButton && React.createElement(
                    'button',
                    {
                        onClick: this.onSave,
                        style: this.props.saveButtonStyle || null,
                        className: _JSXStyle.dynamic([['3936761195', [globalWidth]]]) + ' ' + 'saveButton'
                    },
                    '\u5B58\u6A94'
                ),
                React.createElement(_JSXStyle, {
                    styleId: '3936761195',
                    css: '.table.__jsx-style-dynamic-selector{position:relative;width:100%;padding-right:25px;box-sizing:border-box;}.AppBody.__jsx-style-dynamic-selector{width:' + globalWidth + 'px;position:relative;box-shadow:1px 1px 4px 0px rgba(0,0,0,0.5);padding:0px 10px 5px 10px;border-radius:5px;text-align:left;}.AppBody.__jsx-style-dynamic-selector .flex-row{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:stretch;-webkit-justify-content:stretch;-ms-flex-pack:stretch;justify-content:stretch;}.AppBody.__jsx-style-dynamic-selector .input{width:100%;border-top:none;border-right:none;border-left:none;}.AppBody.__jsx-style-dynamic-selector .delete{width:22px;position:absolute;right:0px;padding:0px 7px;border-radius:2px;color:white;background:rgba(255,118,223,0.8);font-weight:bold;cursor:pointer;box-sizing:border-box;text-align:center;display:none;}.AppBody.__jsx-style-dynamic-selector .delete:active{background:rgba(255,118,223,0.4);}.AppBody.__jsx-style-dynamic-selector .add{width:22px;position:absolute;right:-25px;cursor:pointer;padding:0px 7px;background:rgba(23,198,136,0.8);border-radius:2px;font-weight:bold;color:white;text-align:center;box-sizing:border-box;}.AppBody.__jsx-style-dynamic-selector .add:active{background:rgba(23,198,136,0.4);}.AppBody.__jsx-style-dynamic-selector .MTTD{padding:2px 0px 0px 4px;margin-right:4px;-webkit-flex:1;-ms-flex:1;flex:1;}.AppBody.__jsx-style-dynamic-selector .MTTR{position:relative;}.AppBody.__jsx-style-dynamic-selector .MTTR:hover .delete{display:block;}.AppBody.__jsx-style-dynamic-selector .MT-header .MTTD{border-bottom:2px solid #52a8ff;}.saveButton.__jsx-style-dynamic-selector{position:relative;left:70%;border:none;border-radius:5px;padding:6px 10px;margin:15px 0px 5px 0px;background:none;box-shadow:1px 1px 4px 0px rgba(50,88,192,0.5);cursor:pointer;}.saveButton.__jsx-style-dynamic-selector:focus{outline:1px dashed rgba(50,88,192,0.1);}.saveButton.__jsx-style-dynamic-selector:active{box-shadow:0px 0px 1px 1px rgba(50,88,192,0.2);}',
                    dynamic: [globalWidth]
                })
            );
        }
    }], [{
        key: 'getDerivedStateFromProps',
        value: function getDerivedStateFromProps(nextProps, preState) {
            if (preState.listColumnName != nextProps.listColumnName && preState.listData != nextProps.listData) {
                return {
                    listColumnName: nextProps.listColumnName,
                    listData: nextProps.listData,
                    newData: {}
                };
            } else {
                return null;
            }
        }
    }]);

    return MaintainTable;
}(React.Component);

MaintainTable.defaultProps = {
    columnWidth: 250,
    listColumnName: [{
        "label": "名稱",
        "value": "label"
    }, {
        "label": "代碼",
        "value": "value"
    }],
    listData: [{
        "label": "R1",
        "value": "R1"
    }, {
        "label": "R9",
        "value": "R8",
        "order": 9
    }],
    hasSaveButton: true,
    onSave: function onSave() {},
    onChange: function onChange() {},
    backStyle: null,
    tableStyle: null,
    saveButtonStyle: null
};
export default MaintainTable;