var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { Editor, EditorState, SelectionState, RichUtils, Modifier, ContentState } from 'draft-js';
import { OrderedSet } from 'immutable';
import _ from 'lodash';

import similarS from 'similarity';

import '../css/FreeTextWithSnippet.css';

var SnippetDiv = function (_React$Component) {
    _inherits(SnippetDiv, _React$Component);

    function SnippetDiv(props) {
        _classCallCheck(this, SnippetDiv);

        var _this = _possibleConstructorReturn(this, (SnippetDiv.__proto__ || Object.getPrototypeOf(SnippetDiv)).call(this, props));

        _this.processing = function (snippetList, searchStr) {

            // 用關鍵字搜尋片語

            if (searchStr.trim() === '') {
                return [];
            }
            var re = new RegExp('^' + searchStr + '.*');

            var fData = _.filter(snippetList, function (eachdata) {
                var key = eachdata.shortCut;
                return key.toUpperCase().indexOf(searchStr.toUpperCase()) > -1;
            });

            fData = fData.sort(function (a, b) {
                return -similarS(searchStr, a.shortCut) + similarS(searchStr, b.shortCut);
            });

            fData = fData.sort(function (a, b) {
                if (!b.shortCut.toUpperCase().match(re)) {
                    return -1;
                } else {
                    if (a.shortCut.toUpperCase().match(re)) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });

            return fData;
        };

        _this.state = {};
        _this.refList = [];
        return _this;
    }

    _createClass(SnippetDiv, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            // 選項滑至可視
            if (this.props.focus != null) {
                if (this.refList) {
                    if (this.refList[this.props.focus]) {
                        if (this.refList[this.props.focus].current) {
                            this.refList[this.props.focus].current.scrollIntoView({ block: 'center' });
                        }
                    }
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var snippetList = this.props.snippet;
            var searchStr = this.props.searchStr;
            var nowFocus = this.props.focus;

            var snippet = this.processing(snippetList, searchStr);

            if (nowFocus != null) {
                this.props.onChange(snippet[nowFocus]);
            }

            if (snippet.length === 0) {
                return null;
            }

            this.refList = snippet.map(function () {
                return React.createRef();
            });

            return React.createElement(
                'div',
                { className: 'snippetDiv' },
                _.map(snippet, function (eachdata, idx) {
                    return React.createElement(
                        'div',
                        {
                            key: idx,
                            className: 'snippetItemDiv' + (nowFocus === idx ? ' focus' : ''),
                            id: 'snippet' + idx,
                            ref: _this2.refList[idx]
                        },
                        eachdata.shortCut
                    );
                })
            );
        }
    }]);

    return SnippetDiv;
}(React.Component);

var FreeTextWithSnippet = function (_React$Component2) {
    _inherits(FreeTextWithSnippet, _React$Component2);

    function FreeTextWithSnippet(props) {
        _classCallCheck(this, FreeTextWithSnippet);

        var _this3 = _possibleConstructorReturn(this, (FreeTextWithSnippet.__proto__ || Object.getPrototypeOf(FreeTextWithSnippet)).call(this, props));

        _this3.handlePaste = function (text) {
            var isSnippetPaste = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            if (!text) {
                return 'handled';
            }
            if ((typeof text === 'undefined' ? 'undefined' : _typeof(text)) == 'object') {
                return 'handled';
            }
            text = text.replace(/\r/g, '');
            text = text.replace(/\n$/, '');

            var editorState = _this3.state.editorState;

            var nowContentState = editorState.getCurrentContent();
            var selection = _this3.state.editorState.getSelection();

            var styleName = OrderedSet.of('gray');
            var nextContentState = void 0,
                nextEditorState = void 0;

            // 如果是片語貼上，要取代片語前的字
            if (isSnippetPaste == true) {
                var newSelection = SelectionState.createEmpty();
                _this3.copyCursor = selection;

                var updatedSelection = newSelection.merge({
                    focusKey: selection.getAnchorKey(),
                    focusOffset: _this3.searchStrIndex[1],
                    anchorKey: selection.getAnchorKey(),
                    anchorOffset: _this3.searchStrIndex[0] === 0 ? 0 : _this3.searchStrIndex[0] + 1,
                    isBackward: false,
                    hasFocus: true
                });

                nextContentState = Modifier.replaceText(nowContentState, updatedSelection, text, styleName);
                nextEditorState = EditorState.push(editorState, nextContentState, 'replace-characters');
            } else {
                // 非片語貼上
                if (!selection.isCollapsed()) {
                    nextContentState = Modifier.replaceText(nowContentState, selection, text, styleName);
                    nextEditorState = EditorState.push(editorState, nextContentState, 'replace-characters');
                } else {
                    nextContentState = Modifier.insertText(nowContentState, selection, text, styleName);
                    nextEditorState = EditorState.push(editorState, nextContentState, 'insert-characters');
                }
            }

            nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, 'gray');
            nextEditorState = EditorState.setInlineStyleOverride(nextEditorState, OrderedSet.of('noStyled'));

            _this3.setHashList(nextEditorState);

            _this3.setState({
                editorState: nextEditorState,
                openSnippetHint: false,
                searchStr: '',
                nowFocusSnippet: null
            });
            _this3.props.onChange(editorState.getCurrentContent().getPlainText() + text);

            return 'handled';
        };

        _this3.keyDownFn = function (e) {

            if (e.which == 9) {
                e.preventDefault();
            }

            // -- tab
            if (e.which == 16) {
                _this3.isShift = true;
            }

            // -- 下
            if (e.which == 40) {
                if (_this3.state.openSnippetHint) {
                    e.stopPropagation();
                    e.preventDefault();

                    if (_this3.state.nowFocusSnippet != null) {
                        _this3.setState({
                            nowFocusSnippet: _this3.state.nowFocusSnippet + 1
                        });
                    } else {
                        _this3.setState({
                            nowFocusSnippet: 0
                        });
                    }
                }
            }

            // -- 上
            if (e.which == 38) {
                if (_this3.state.openSnippetHint) {
                    e.stopPropagation();
                    e.preventDefault();

                    if (_this3.state.nowFocusSnippet) {
                        _this3.setState({
                            nowFocusSnippet: _this3.state.nowFocusSnippet - 1
                        });
                    }
                }
            }

            // -- enter
            if (e.which == 13) {
                if (_this3.state.openSnippetHint && _this3.state.nowFocusSnippet !== null) {
                    e.stopPropagation();
                    e.preventDefault();

                    _this3.handlePaste(_this3.nowSnippetConstent, true);
                }
            }
        };

        _this3.keyUpFn = function (e) {
            if (e.which == 16) {
                _this3.isShift = false;
            }
            _this3.getCursorPosition();
        };

        _this3.toggleSnippetOptions = function (editorState) {
            var textSelection = editorState.getSelection();
            var currentContent = editorState.getCurrentContent();
            var currentContentText = currentContent.getPlainText();
            var preContentText = _this3.state.editorState.getCurrentContent().getPlainText();
            var currentContentBlock = currentContent.getBlockForKey(textSelection.getStartKey());
            var currentContentBlockText = currentContentBlock.getText();

            // 沒改變就不要有
            if (currentContentText === preContentText) {
                _this3.openSnippetHint = false;
            } else {

                if (currentContentBlockText.length > 1) {

                    var startKey = textSelection.getStartOffset();
                    var preText = currentContentBlockText.substring(startKey - 1, startKey);

                    if (preText !== ' ') {
                        var isEnd = startKey === currentContentBlockText.length ? true : false;
                        var isBeforeSpace = currentContentBlockText.substring(startKey, startKey + 1) === ' ' ? true : false;

                        if (isEnd || isBeforeSpace) {
                            _this3.openSnippetHint = true;
                        } else {
                            _this3.openSnippetHint = false;
                        }
                    } else {
                        _this3.openSnippetHint = false;
                    }
                }
                // 沒字不要有
                else if (currentContentBlockText.length === 0) {
                        _this3.openSnippetHint = false;

                        // 第一個字 always 要有
                    } else {
                        _this3.openSnippetHint = true;
                    }
            }
        };

        _this3.setSearchStr = function (editorState) {
            var textSelection = editorState.getSelection();
            var currentContent = editorState.getCurrentContent();
            var currentContentText = currentContent.getPlainText();
            var currentContentBlock = currentContent.getBlockForKey(textSelection.getStartKey());
            var currentContentBlockText = currentContentBlock.getText();

            var preContentText = _this3.state.editorState.getCurrentContent().getPlainText();

            if (_this3.openSnippetHint === false) {
                _this3.searchStr = '';
            } else if (currentContentText === preContentText) {
                _this3.searchStr = '';
            } else {
                if (currentContentBlockText.length > 0) {
                    var startKey = textSelection.getStartOffset();
                    var preText = currentContentBlockText.substring(startKey - 1, startKey);

                    if (preText === ' ') {
                        _this3.searchStr = '';
                    } else {
                        // 從 0 到游標前的最後一個空白鍵
                        var lastSpace = currentContentBlockText.substring(0, startKey).lastIndexOf(' ');
                        _this3.searchStr = currentContentBlockText.substring(lastSpace, startKey).trim();
                        _this3.searchStrIndex = [lastSpace >= 0 ? lastSpace : 0, startKey];
                    }
                } else {
                    _this3.searchStr = '';
                }
            }
        };

        _this3.setHashList = function (editorState) {
            var nowContentState = editorState.getCurrentContent();
            var textBlockMapArray = nowContentState.getBlockMap().toArray();

            var hashArray = [];

            var count = 0;
            while (count < textBlockMapArray.length) {
                var searchKey = /___/g;
                var match = null;

                var content = textBlockMapArray[count].getText();
                var blockName = textBlockMapArray[count].key;

                while ((match = searchKey.exec(content)) != null) {
                    var hashElement = {};
                    hashElement.index = count;
                    hashElement.blockName = blockName;
                    hashElement.position = match.index;
                    hashArray.push(hashElement);
                }
                count += 1;
            }

            _this3.hash = hashArray;
        };

        _this3.onChange = function (editorState) {
            var nowContentState = editorState.getCurrentContent();
            var textContent = nowContentState.getPlainText() || '';
            var textContentArray = textContent.split('\n');
            var textSelection = editorState.getSelection();
            var textAnchor = textSelection.getFocusKey();

            // -- 判斷要不要跳出選擇片語窗 ---------------------------------------------------------------------
            // ---------------------------------------------------------------------------------------------
            _this3.toggleSnippetOptions(editorState);

            // -- 設置搜尋字串 ---------------------------------------------------------------------
            // ---------------------------------------------------------------------------------------------
            _this3.setSearchStr(editorState);

            // -- 把 style 轉回一般 style ---------------------------------------------------------------------
            // -----------------------------------------------------------------------------------------------
            if (editorState.getCurrentInlineStyle().toJSON().indexOf('gray') > -1) {
                editorState = EditorState.setInlineStyleOverride(editorState, OrderedSet.of('noStyled'));
            }

            // -- 把 有 ___ 的內容位置存起來 ---------------------------------------------------------------------
            _this3.setHashList(editorState);

            // --------------------------------------------------------------------------------

            _this3.setState({
                editorState: editorState,
                searchStr: _this3.searchStr
            });

            _this3.props.onChange(editorState.getCurrentContent().getPlainText());
        };

        _this3.handleMouseUp = function () {
            console.log('up');
            _this3.getCursorPosition();
        };

        _this3.handleSnippetChange = function (data) {
            if (data) {
                _this3.nowSnippetConstent = data.name;
            }
        };

        _this3.getCursorPosition = function () {
            var snippetPosition = {
                left: null,
                right: null,
                top: null,
                bottom: null
            };

            if (window.getSelection().anchorNode) {
                snippetPosition = window.getSelection().getRangeAt(0).getBoundingClientRect();
            }

            _this3.setState({
                snippetPosition: snippetPosition,
                openSnippetHint: _this3.openSnippetHint,
                nowFocusSnippet: _this3.openSnippetHint ? _this3.state.nowFocusSnippet : null
            });
        };

        _this3.focus = function () {
            _this3.editor.focus();
        };

        _this3.forceSelect = function (backward) {
            var nowEditor = _this3.state.editorState;
            var hash = _this3.hash;

            // --- 找到 key map --- //
            var textBlockMap = nowEditor.getCurrentContent().getBlockMap();
            var textBlockKeys = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = textBlockMap.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    textBlockKeys.push(item);
                }

                // --- 找到目前游標 --- //
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var nowCursor = _this3.copyCursor ? _this3.copyCursor : {
                key: nowEditor.getSelection().getFocusKey(),
                focusOffset: nowEditor.getSelection().getFocusOffset(),
                anchorOffset: nowEditor.getSelection().getAnchorOffset()
                // --- 找到目前游標後的第一個 search key --- //
            };var nowCursorIndex = textBlockKeys.indexOf(nowCursor.key);
            var targetHash = false;

            // --- 濾掉之前(後)的行
            var prePostHashArray = _.filter(hash, function (eachHash, idx) {
                if (backward) {
                    return eachHash.index > nowCursorIndex ? false : true;
                } else {
                    return eachHash.index < nowCursorIndex ? false : true;
                }
            });
            // --- 濾掉同行之前(後)的 searchkey
            var postHashArray = _.filter(prePostHashArray, function (eachHash) {
                if (backward) {
                    return eachHash.blockName == nowCursor.key && eachHash.position >= nowCursor.focusOffset ? false : true;
                } else {
                    return eachHash.blockName == nowCursor.key && eachHash.position < nowCursor.anchorOffset ? false : true;
                }
            });
            // --------------------------------------------

            if (postHashArray.length > 0) {
                var thisHash = backward ? postHashArray.slice(-1)[0] : postHashArray[0];
                var selectionState = SelectionState.createEmpty(thisHash.blockName);
                var updatedSelection = selectionState.merge({
                    focusKey: thisHash.blockName,
                    focusOffset: thisHash.position,
                    anchorKey: thisHash.blockName,
                    anchorOffset: thisHash.position + 3,
                    isBackward: true
                });

                var newState = EditorState.forceSelection(_this3.state.editorState, updatedSelection);

                newState = RichUtils.toggleInlineStyle(newState, 'gray');
                newState = EditorState.setInlineStyleOverride(newState, OrderedSet.of('noStyled'));

                _this3.setState({
                    editorState: newState
                });

                _this3.copyCursor = null;
            }
        };

        _this3.onTab = function (e) {
            if (_this3.hash.length != 0) {
                _this3.forceSelect(_this3.isShift ? true : false);
            }
        };

        _this3.state = {
            editorState: props.defaultText ? EditorState.createWithContent(ContentState.createFromText(props.defaultText)) : EditorState.createWithContent(ContentState.createFromText('')),
            defaultText: props.defaultText || '',
            paste: props.paste || '',
            pureText: '',
            snippetList: [],
            snippetPosition: {
                left: null,
                right: null,
                top: null,
                bottom: null
            },
            openSnippetHint: true,
            searchStr: '',
            nowFocusSnippet: null
        };

        _this3.editor = null;
        _this3.draftBody = null;

        _this3.personalSnippet = [];
        _this3.openSnippetHint = true;
        _this3.searchStr = '';
        _this3.searchStrIndex = [0, 0];
        _this3.nowSnippetConstent = '';
        _this3.hash = [];

        _this3.tabListener = null;
        _this3.shiftListener = null;
        _this3.pasteListener = null;
        _this3.touchendListener = null;

        _this3.copyCursor = null;
        _this3.StyleMap = {
            'gray': {
                color: 'gray'
            },
            'noStyled': {}
        };

        _this3.fontHeight = 16;
        return _this3;
    }

    _createClass(FreeTextWithSnippet, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this4 = this;

            var draftBody = this.draftBody;
            this.tabListener = draftBody.addEventListener('keydown', this.keyDownFn, true);
            this.shiftListener = draftBody.addEventListener('keyup', this.keyUpFn);
            this.pasteListener = draftBody.addEventListener('paste', this.handlePaste);
            this.touchendListener = draftBody.addEventListener('touchend', this.keyUpFn);

            // -- 拿片語
            fetch('https://emr.kfsyscc.org/python/note-get_snipp/001965', { credentials: 'include' }).then(function (response) {
                return response.json();
            }).then(function (backdata) {
                var tempArray = [];

                var rawData = _.map(backdata, function (eachdata, idx) {
                    var data = {};
                    data.shortCut = eachdata.PHR_CODE;
                    data.name = eachdata.CONTENTS;
                    if (tempArray.indexOf(data.name) > -1) {
                        data.name += ' ';
                    }
                    tempArray.push(data.name);
                    return data;
                });

                _this4.personalSnippet = rawData;

                _this4.setState({
                    snippetList: _this4.personalSnippet
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var suggestions = this.state.snippetList;
            var id = this.props.id || 'draftJSBody';

            var snippetHintDiv = null;

            if (this.state.openSnippetHint && this.state.snippetPosition.left != null) {
                snippetHintDiv = React.createElement(
                    'span',
                    { style: { position: 'absolute', left: this.state.snippetPosition.x, top: this.state.snippetPosition.y + this.fontHeight } },
                    React.createElement(SnippetDiv, {
                        snippet: this.state.snippetList,
                        searchStr: this.state.searchStr,
                        focus: this.state.nowFocusSnippet,
                        onChange: this.handleSnippetChange
                    })
                );
            }

            return React.createElement(
                'div',
                { style: { width: '100%', position: 'relative' } },
                React.createElement(
                    'div',
                    {
                        style: {
                            width: '100%',
                            overflow: 'auto'
                        } },
                    React.createElement(
                        'div',
                        {
                            id: id,
                            className: 'draftjsWithMention',
                            style: {
                                display: 'inline-block',
                                border: '1px solid gray',
                                padding: '5px',
                                height: 'auto',
                                width: '100%',
                                overflow: 'auto',
                                fontFamily: 'monospace'
                            },
                            onClick: this.focus,
                            ref: function ref(div) {
                                return _this5.draftBody = div;
                            }
                        },
                        React.createElement(Editor, {
                            editorState: this.state.editorState,
                            onChange: this.onChange,
                            ref: function ref(element) {
                                _this5.editor = element;
                            },
                            onTab: this.onTab,
                            spellCheck: true,
                            handlePastedText: this.handlePaste,
                            customStyleMap: this.StyleMap
                        })
                    )
                ),
                snippetHintDiv
            );
        }
    }], [{
        key: 'getDerivedStateFromProps',
        value: function getDerivedStateFromProps(nextProps, prevState) {
            var selection = prevState.editorState.getSelection();
            var nowContentState = prevState.editorState.getCurrentContent();

            // 從外部傳入預設內容
            if (prevState.defaultText != nextProps.defaultText) {
                if (nextProps.defaultText) {
                    var nextContentState = Modifier.insertText(nowContentState, selection, nextProps.defaultText);
                    var nextEditorState = EditorState.push(prevState.editorState, nextContentState, 'insert-characters');
                    return {
                        editorState: nextEditorState
                    };
                }
            }

            // 從外部傳入要貼上的內容
            if (nextProps.paste) {
                var _nextContentState = void 0;
                var _nextEditorState = void 0;

                if (prevState.paste != nextProps.paste) {
                    // 非片語貼上
                    if (!selection.isCollapsed()) {
                        _nextContentState = Modifier.replaceText(nowContentState, selection, text, styleName);
                        _nextEditorState = EditorState.push(prevState.editorState, _nextContentState, 'replace-characters');
                    } else {
                        _nextContentState = Modifier.insertText(nowContentState, selection, text, styleName);
                        _nextEditorState = EditorState.push(prevState.editorState, _nextContentState, 'insert-characters');
                    }

                    _nextEditorState = RichUtils.toggleInlineStyle(_nextEditorState, 'gray');
                    _nextEditorState = EditorState.setInlineStyleOverride(_nextEditorState, OrderedSet.of('noStyled'));

                    nextProps.onChange(prevState.editorState.getCurrentContent().getPlainText() + text);

                    return {
                        editorState: _nextEditorState,
                        openSnippetHint: false,
                        searchStr: '',
                        nowFocusSnippet: null
                    };
                }
            }

            return null;
        }

        // -- 貼上


        // 決定要不要展開搜尋格


        // -- 搜尋字串 ---------------------------------------------------------------------


        // -- 把 有 ___ 的內容位置存起來 ---------------------------------------------------------------------


        // 按 tab 選擇三底線

    }]);

    return FreeTextWithSnippet;
}(React.Component);

FreeTextWithSnippet.defaultProps = {
    defaultText: '5678',
    onChange: function onChange() {}
};

export default FreeTextWithSnippet;