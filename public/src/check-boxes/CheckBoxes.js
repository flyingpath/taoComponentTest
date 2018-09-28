var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n            display: flex;\n            flex-direction: row;\n            align-items: center;\n        '], ['\n            display: flex;\n            flex-direction: row;\n            align-items: center;\n        ']),
    _templateObject2 = _taggedTemplateLiteral(['\n            display: flex;\n            flex-flow: wrap row;\n        '], ['\n            display: flex;\n            flex-flow: wrap row;\n        ']),
    _templateObject3 = _taggedTemplateLiteral(['\n            width: 18px;\n            height: 18px;\n        '], ['\n            width: 18px;\n            height: 18px;\n        ']),
    _templateObject4 = _taggedTemplateLiteral(['\n            padding: 5px;\n            font-family: \u6A19\u6977\u9AD4;\n        '], ['\n            padding: 5px;\n            font-family: \u6A19\u6977\u9AD4;\n        ']),
    _templateObject5 = _taggedTemplateLiteral(['\n            margin-bottom: 5px;\n            font-size: 120%;\n            font-weight: bold;\n        '], ['\n            margin-bottom: 5px;\n            font-size: 120%;\n            font-weight: bold;\n        ']),
    _templateObject6 = _taggedTemplateLiteral(['\n            margin-right: 5px;\n            padding: 2px;\n        '], ['\n            margin-right: 5px;\n            padding: 2px;\n        ']),
    _templateObject7 = _taggedTemplateLiteral(['\n            max-width: 120px;\n        '], ['\n            max-width: 120px;\n        ']),
    _templateObject8 = _taggedTemplateLiteral(['\n        '], ['\n        ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import _ from 'lodash';
import styled from 'styled-components';

var Checkboxes = function (_React$Component) {
    _inherits(Checkboxes, _React$Component);

    function Checkboxes(props) {
        _classCallCheck(this, Checkboxes);

        // -- 抓出中文名稱

        var _this = _possibleConstructorReturn(this, (Checkboxes.__proto__ || Object.getPrototypeOf(Checkboxes)).call(this, props));

        _this.styledComponent = {
            itemDiv: styled.div(_templateObject),
            constentDiv: styled.div(_templateObject2),
            input: styled.input(_templateObject3),
            outterDiv: styled.div(_templateObject4),
            titleDiv: styled.div(_templateObject5),
            labelSpan: styled.span(_templateObject6),
            inputText: styled.input(_templateObject7),
            inputMemo: styled.textarea(_templateObject8)
        };
        _this.data = props.data.map(function (x) {
            return x.name;
        });
        if (props.withOther) {
            _this.data.push('其它'); //-- 需要其它的話加上其它
        }

        // -- 置入預設值
        var value = [];
        _.forEach(_this.data, function (item, key) {
            if (props.uni && props.defaultValue === key) {
                value.push(true);
            } else {
                value.push(false);
            }
        });

        // -- 初始化 state
        _this.state = {
            value: value,
            textValue: '',
            memo: ''
        };

        _this.handleChange = _this.handleChange.bind(_this);
        _this.textOtherChange = _this.textOtherChange.bind(_this);
        _this.textMemoChange = _this.textMemoChange.bind(_this);
        _this.firePreOnchange = _this.firePreOnchange.bind(_this);

        // -- 要送出的資料
        _this.ouputData = {
            data: _this.data.filter(function (x, idx) {
                return value[idx];
            }),
            other: '',
            memo: ''
        };
        return _this;
    }
    // -- 初始後送出資料(全預設值)


    _createClass(Checkboxes, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _.delay(this.firePreOnchange, 500);
        }

        // -- onChange 時送出資料

    }, {
        key: 'firePreOnchange',
        value: function firePreOnchange() {
            this.props.onChange(this.ouputData, this.props.order);
        }
    }, {
        key: 'textOtherChange',
        value: function textOtherChange(e) {
            var v = e.target.value;
            this.ouputData.other = v;
            this.setState({
                textValue: v
            });
            this.firePreOnchange();
        }
    }, {
        key: 'textMemoChange',
        value: function textMemoChange(e) {
            var v = e.target.value;
            this.ouputData.memo = v;
            this.setState({
                memo: v
            });
            this.firePreOnchange();
        }
    }, {
        key: 'handleChange',
        value: function handleChange(value) {
            var _this2 = this;

            return function () {
                var data = _this2.data;
                var uni = _this2.props.uni;
                var prevValue = _this2.state.value;

                var newValue = [];
                _.forEach(data, function (item, key) {
                    if (uni && value == key) {
                        newValue.push(true);
                    } else if (!uni && value == key) {
                        newValue.push(!prevValue[key]);
                    } else if (!uni) {
                        newValue.push(prevValue[key]);
                    } else {
                        newValue.push(false);
                    }
                });

                _this2.ouputData.data = data.filter(function (each, idx) {
                    return newValue[idx];
                });
                var othertext = _this2.state.textValue;
                if (_this2.ouputData.data.indexOf('其它') == -1) {
                    othertext = '';
                    _this2.ouputData.other = '';
                }

                _this2.setState({
                    value: newValue,
                    textValue: othertext
                });

                _this2.firePreOnchange();
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var data = this.data;
            var withOther = this.props.withOther;
            var label = this.props.label;

            var nowCheck = this.state.value;
            var withMemo = this.props.withMemo;

            var OutterDiv = this.styledComponent.outterDiv;
            var TitleDiv = this.styledComponent.titleDiv;
            var LabelSpan = this.styledComponent.labelSpan;
            var ConstentDiv = this.styledComponent.constentDiv;
            var ItemDiv = this.styledComponent.itemDiv;
            var Input = this.styledComponent.input;

            var memoText = null;
            if (withMemo) {
                var InputMemo = this.styledComponent.inputMemo;
                memoText = React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        { style: { padding: '5px 0px' } },
                        '\u5099\u8A3B\uFF1A'
                    ),
                    React.createElement(InputMemo, {
                        value: this.state.memo,
                        onChange: this.textMemoChange
                    })
                );
            }

            var body = _.map(data, function (item, key) {
                var checked = nowCheck[key];
                var withOther = _this3.props.withOther;
                var isOther = item === '其它';
                var InputText = _this3.styledComponent.inputText;

                var inputItem = null;
                if (checked && isOther) {
                    inputItem = React.createElement(InputText, {
                        type: 'text',
                        value: _this3.state.textValue,
                        onChange: _this3.textOtherChange
                    });
                }
                return React.createElement(
                    ItemDiv,
                    { key: key },
                    React.createElement(Input, {
                        type: 'checkbox',
                        name: item,
                        onChange: _this3.handleChange(key),
                        checked: nowCheck[key]
                    }),
                    React.createElement(
                        LabelSpan,
                        { onClick: _this3.handleChange(key) },
                        item
                    ),
                    inputItem
                );
            });

            return React.createElement(
                OutterDiv,
                null,
                React.createElement(
                    TitleDiv,
                    { className: 'optionTitleLabel' },
                    label
                ),
                React.createElement(
                    ConstentDiv,
                    null,
                    body
                ),
                memoText
            );
        }
    }]);

    return Checkboxes;
}(React.Component);

Checkboxes.defaultProps = {
    label: '選擇:',
    data: [{
        value: "a",
        name: "a"
    }, {
        value: "b",
        name: "b"
    }, {
        value: "c",
        name: "c"
    }],
    defaultValue: 0,
    uni: false,
    withOther: false,
    withMemo: false,
    onChange: function onChange() {}
};

export default Checkboxes;