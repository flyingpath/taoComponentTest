var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n            display: flex;\n            width: ', 'px;\n            height: ', 'px;\n            border-radius: 50%;\n            border: 1px solid;\n            align-items: center;\n            justify-content: center;\n            position: relative;\n            color:#00208c;\n            border: none;\n            font-family: monospace;\n            background: radial-gradient(circle at 10px 5px,#b8dbff,#8fc6fd,#407dab);\n            cursor:pointer;\n        '], ['\n            display: flex;\n            width: ', 'px;\n            height: ', 'px;\n            border-radius: 50%;\n            border: 1px solid;\n            align-items: center;\n            justify-content: center;\n            position: relative;\n            color:#00208c;\n            border: none;\n            font-family: monospace;\n            background: radial-gradient(circle at 10px 5px,#b8dbff,#8fc6fd,#407dab);\n            cursor:pointer;\n        ']),
    _templateObject2 = _taggedTemplateLiteral(['\n            from {\n                opacity: 0;\n            }\n            to {\n                opacity: 1;\n            }\n        '], ['\n            from {\n                opacity: 0;\n            }\n            to {\n                opacity: 1;\n            }\n        ']),
    _templateObject3 = _taggedTemplateLiteral(['\n                display: flex;\n                width: ', 'px;\n                height: ', 'px;\n                border-radius: 50%;\n                border: 1px solid;\n                align-items: center;\n                justify-content: center;\n                position: absolute;\n                top: ', 'px;\n                left: ', 'px;\n                animation: ', ' .4s linear;\n                animation-delay: ', 's;\n                opacity: 0;\n                animation-fill-mode: forwards;\n                color: white;\n                border: none;\n                font-family: monospace;\n                background: radial-gradient(circle at 2px 0px,#87d2ff,#1348c6);\n                cursor: pointer;\n                font-weight: bold;\n            '], ['\n                display: flex;\n                width: ', 'px;\n                height: ', 'px;\n                border-radius: 50%;\n                border: 1px solid;\n                align-items: center;\n                justify-content: center;\n                position: absolute;\n                top: ', 'px;\n                left: ', 'px;\n                animation: ', ' .4s linear;\n                animation-delay: ', 's;\n                opacity: 0;\n                animation-fill-mode: forwards;\n                color: white;\n                border: none;\n                font-family: monospace;\n                background: radial-gradient(circle at 2px 0px,#87d2ff,#1348c6);\n                cursor: pointer;\n                font-weight: bold;\n            ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

var RoundButtonGroup = function (_React$Component) {
    _inherits(RoundButtonGroup, _React$Component);

    function RoundButtonGroup(props) {
        _classCallCheck(this, RoundButtonGroup);

        var _this = _possibleConstructorReturn(this, (RoundButtonGroup.__proto__ || Object.getPrototypeOf(RoundButtonGroup)).call(this, props));

        _this.state = {
            openSub: false
        };
        _this.clickSend = _this.clickSend.bind(_this);
        _this.bodyClick = _this.bodyClick.bind(_this);
        return _this;
    }

    _createClass(RoundButtonGroup, [{
        key: 'clickSend',
        value: function clickSend() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'bodyClick',
        value: function bodyClick() {
            this.setState({
                openSub: !this.state.openSub
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var subNum = 3;
            var width = 30;
            var bodyContent = this.props.body;
            var content = this.props.subArray;
            var Body = styled.div(_templateObject, width, width);

            return React.createElement(
                Body,
                { onClick: this.bodyClick },
                function () {
                    if (_this2.state.openSub) {
                        return _this2.makeSub(subNum, width, content);
                    }
                }(),
                React.createElement(
                    'div',
                    null,
                    bodyContent
                )
            );
        }
    }, {
        key: 'makeSub',
        value: function makeSub(num, bodyWidth, content) {
            var _this3 = this;

            var rtnArray = [];
            var width = bodyWidth * 0.8;
            var longSide = width + 5;
            var appear = keyframes(_templateObject2);

            var _loop = function _loop(i) {
                var x = longSide * Math.cos(-Math.PI / 2 + Math.PI * (i - 1) / 3);
                var y = longSide * Math.sin(-Math.PI / 2 + Math.PI * (i - 1) / 3);

                var Element = styled.div(_templateObject3, width, width, y, bodyWidth - width + x, appear, 0.1 * (i - 1));
                rtnArray.push(React.createElement(
                    Element,
                    { key: i, onClick: function onClick() {
                            _this3.props.onClick(i);
                        } },
                    React.createElement(
                        'div',
                        null,
                        content[i - 1]
                    )
                ));
            };

            for (var i = 1; i <= num; i++) {
                _loop(i);
            }

            return rtnArray;
        }
    }]);

    return RoundButtonGroup;
}(React.Component);

RoundButtonGroup.defaultProps = {
    onClick: function onClick(i) {},
    body: 'V1',
    subArray: ['V1', 'V2', 'V3']
};

export default RoundButtonGroup;