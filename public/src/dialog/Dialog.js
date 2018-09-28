var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _JSXStyle from 'styled-jsx/style';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

var TaoDialog = function (_React$Component) {
    _inherits(TaoDialog, _React$Component);

    function TaoDialog(props) {
        _classCallCheck(this, TaoDialog);

        var _this = _possibleConstructorReturn(this, (TaoDialog.__proto__ || Object.getPrototypeOf(TaoDialog)).call(this, props));

        _this.onBackClick = function (e) {
            if (e.target.id == _this.props.id) {
                if (_this.props.onBackClick) {
                    _this.props.onBackClick(e);
                }
            }
        };

        _this.state = {
            open: props.open
        };
        return _this;
    }

    _createClass(TaoDialog, [{
        key: 'render',
        value: function render() {
            var open = this.props.open;
            var body = this.props.children;

            var mainClassN = this.props.id + '_class';
            var bodyClassN = this.props.bodyId + '_class';

            if (!open) {
                return React.createElement('div', { style: { display: 'none' } });
            } else {
                return React.createElement(
                    'div',
                    {
                        id: this.props.id,
                        style: this.props.backStyle,
                        onClick: this.onBackClick,
                        className: _JSXStyle.dynamic([['4110285388', [mainClassN, bodyClassN]]]) + ' ' + (mainClassN || '')
                    },
                    React.createElement(
                        'div',
                        {
                            id: this.props.dialogBodyID,
                            style: this.props.bodyStyle,
                            className: _JSXStyle.dynamic([['4110285388', [mainClassN, bodyClassN]]]) + ' ' + (bodyClassN || '')
                        },
                        body
                    ),
                    React.createElement(_JSXStyle, {
                        styleId: '4110285388',
                        css: '@-webkit-keyframes fadeIn-__jsx-style-dynamic-selector{from{opacity:0;-webkit-transform:translate3d(0,-10%,0);-ms-transform:translate3d(0,-10%,0);transform:translate3d(0,-10%,0);}to{opacity:1;-webkit-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);transform:translate3d(0,0,0);}}@keyframes fadeIn-__jsx-style-dynamic-selector{from{opacity:0;-webkit-transform:translate3d(0,-10%,0);-ms-transform:translate3d(0,-10%,0);transform:translate3d(0,-10%,0);}to{opacity:1;-webkit-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);transform:translate3d(0,0,0);}}.' + mainClassN + '.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;position:absolute;top:0px;left:0px;right:0px;bottom:0px;width:100%;background:rgba(0,0,0,0.2);background-size:4px 4px;z-index:5;}.' + bodyClassN + '.__jsx-style-dynamic-selector{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:70%;height:70%;padding:15px 25px 15px 25px;border-radius:5px;font-family:arial,\u5FAE\u8EDF\u6B63\u9ED1\u9AD4;background:white;overflow-y:auto;margin:0 auto;box-shadow:0px 2px 10px 5px #80808036;-webkit-animation:fadeIn-__jsx-style-dynamic-selector .2s linear;animation:fadeIn-__jsx-style-dynamic-selector .2s linear;}',
                        dynamic: [mainClassN, bodyClassN]
                    })
                );
            }
        }
    }]);

    return TaoDialog;
}(React.Component);

TaoDialog.defaultProps = {
    open: true,
    bodyStyle: {},
    backStyle: {},
    id: "tao-dialog",
    bodyId: "tao-dialog-body",
    onBackClick: function onBackClick() {}
};

export default TaoDialog;