import React from 'react'
import {Editor, EditorState, SelectionState, RichUtils, Modifier, ContentState } from 'draft-js'
import { OrderedSet } from 'immutable'
import _ from 'lodash'

import similarS from 'similarity'

import '../css/FreeTextWithSnippet.css'

class SnippetDiv extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.refList = []
    }

    componentDidUpdate(){
        // 選項滑至可視
        if( this.props.focus != null ){
            if(this.refList){
                if (this.refList[this.props.focus]){
                    if( this.refList[this.props.focus].current ){
                        this.refList[this.props.focus].current.scrollIntoView({ block:'center' })
                    }
                }
            }
        }
    }

    processing = ( snippetList, searchStr ) => {

        // 用關鍵字搜尋片語

        if (searchStr.trim() === ''){
            return []
        }
        const re = new RegExp(`^${searchStr}.*`)
        
        let fData = _.filter(snippetList, (eachdata) => {
            const key = eachdata.shortCut
            return key.toUpperCase().indexOf(searchStr.toUpperCase()) > -1
        })
        
        fData = fData.sort((a, b)=>{
            return -similarS(searchStr, a.shortCut) + similarS(searchStr, b.shortCut)
        })

        fData = fData.sort((a, b)=>{
            if (!b.shortCut.toUpperCase().match(re)){
                return -1
            }else {
                if(a.shortCut.toUpperCase().match(re)){
                    return -1
                }else {
                    return 1
                }
            }
        })

        return fData
    }

    render() {

        const snippetList = this.props.snippet
        const searchStr   = this.props.searchStr
        const nowFocus = this.props.focus

        const snippet = this.processing( snippetList, searchStr )
        
        if (nowFocus!=null){
            this.props.onChange( snippet[nowFocus] )
        }

        if ( snippet.length === 0 ){
            return null
        }

        this.refList = snippet.map( ()=>React.createRef() )

        return (
            <div className = 'snippetDiv'>
                {
                    _.map( snippet, (eachdata, idx)=>{
                        return (
                            <div 
                                key={ idx } 
                                className={`snippetItemDiv${nowFocus===idx?' focus':''}`} 
                                id={`snippet${idx}`} 
                                ref={ this.refList[idx]}
                            >
                                { eachdata.shortCut }
                            </div>
                        )
                    } )
                }
            </div>
        )
    }
}

class FreeTextWithSnippet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState     :  props.defaultText?EditorState.createWithContent(ContentState.createFromText(props.defaultText))
                                     :EditorState.createWithContent(ContentState.createFromText('')),
            defaultText     : props.defaultText || '',
            paste           : props.paste || '',
            pureText        : '',
            snippetList     : [],
            snippetPosition : {
                left  : null,
                right : null,
                top   : null,
                bottom: null
            },
            openSnippetHint: true,
            searchStr: '',
            nowFocusSnippet : null,
        }

        this.editor = null
        this.draftBody = null

        this.personalSnippet    = []
        this.openSnippetHint    = true
        this.searchStr          = ''
        this.searchStrIndex = [ 0, 0 ]
        this.nowSnippetConstent = ''
        this.hash = []
        
        this.tabListener = null
        this.shiftListener = null
        this.pasteListener = null
        this.touchendListener = null
        
        this.copyCursor= null
        this.StyleMap={
            'gray': {
                color: 'gray',
            },
            'noStyled':{
            }
        }

        this.fontHeight = 16
    }
    
    componentDidMount() {
        const draftBody    = this.draftBody
        this.tabListener   = draftBody.addEventListener('keydown', this.keyDownFn, true )
        this.shiftListener = draftBody.addEventListener('keyup'  , this.keyUpFn )
        this.pasteListener = draftBody.addEventListener('paste'  , this.handlePaste )
        this.touchendListener = draftBody.addEventListener('touchend', this.keyUpFn )

        // -- 拿片語
        fetch( `https://emr.kfsyscc.org/python/note-get_snipp/001965`, { credentials: 'include' } )
        .then( response => response.json() )
        .then( backdata => {
            let tempArray = []

            const rawData = _.map(backdata, (eachdata, idx) => {
                let data = {}
                data.shortCut = eachdata.PHR_CODE
                data.name = eachdata.CONTENTS
                if (tempArray.indexOf(data.name) > -1) {
                    data.name += ' '
                }
                tempArray.push(data.name)
                return data
            })
            
            this.personalSnippet = rawData
            
            this.setState( { 
                snippetList: this.personalSnippet 
            } )
        })
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        const selection        = prevState.editorState.getSelection()
        const nowContentState  = prevState.editorState.getCurrentContent()
        
        // 從外部傳入預設內容
        if ( prevState.defaultText != nextProps.defaultText ){
            if ( nextProps.defaultText ){
                const nextContentState = Modifier.insertText( nowContentState, selection, nextProps.defaultText )
                const nextEditorState  = EditorState.push(
                    prevState.editorState,
                    nextContentState,
                    'insert-characters'
                )
                return {
                    editorState: nextEditorState
                }
            }
        }

        // 從外部傳入要貼上的內容
        if ( nextProps.paste ) {
            let nextContentState
            let nextEditorState

            if( prevState.paste != nextProps.paste ){
                // 非片語貼上
                if (!selection.isCollapsed()){
                    nextContentState = Modifier.replaceText(nowContentState, selection, text, styleName)
                    nextEditorState = EditorState.push(
                        prevState.editorState,
                        nextContentState,
                        'replace-characters'
                    )
                }else{
                    nextContentState = Modifier.insertText(nowContentState, selection, text, styleName)
                    nextEditorState = EditorState.push(
                        prevState.editorState,
                        nextContentState,
                        'insert-characters'
                    )
                }

                nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, 'gray')
                nextEditorState = EditorState.setInlineStyleOverride(nextEditorState, OrderedSet.of('noStyled'))
                
                nextProps.onChange( prevState.editorState.getCurrentContent().getPlainText() + text )
                
                return { 
                    editorState: nextEditorState,
                    openSnippetHint: false,
                    searchStr: '',
                    nowFocusSnippet: null
                }
            }
        }
        
        return null
    }

    // -- 貼上
    handlePaste = ( text, isSnippetPaste = false ) => {

        if (!text){
            return 'handled'
        }
        if (typeof(text) == 'object'){
            return 'handled'
        }
        text = text.replace(/\r/g, '' )
        text = text.replace(/\n$/, '' )

        let editorState = this.state.editorState

        const nowContentState = editorState.getCurrentContent()
        let selection = this.state.editorState.getSelection()

        const styleName = OrderedSet.of('gray')
        let nextContentState, nextEditorState
        
        // 如果是片語貼上，要取代片語前的字
        if ( isSnippetPaste == true ){
            let newSelection = SelectionState.createEmpty()
            this.copyCursor  = selection

            const updatedSelection = newSelection.merge({
                focusKey: selection.getAnchorKey(),
                focusOffset: this.searchStrIndex[1],
                anchorKey: selection.getAnchorKey(),
                anchorOffset: this.searchStrIndex[0] === 0 ? 0 : this.searchStrIndex[0]+1,
                isBackward: false,
                hasFocus: true
            })
            
            nextContentState = Modifier.replaceText(nowContentState, updatedSelection, text, styleName)
            nextEditorState = EditorState.push(
                editorState,
                nextContentState,
                'replace-characters'
            )

        } else {
        // 非片語貼上
            if (!selection.isCollapsed()){
                nextContentState = Modifier.replaceText(nowContentState, selection, text, styleName)
                nextEditorState = EditorState.push(
                    editorState,
                    nextContentState,
                    'replace-characters'
                )
            }else{
                nextContentState = Modifier.insertText(nowContentState, selection, text, styleName)
                nextEditorState = EditorState.push(
                    editorState,
                    nextContentState,
                    'insert-characters'
                )
            }
        }

        nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, 'gray')
        nextEditorState = EditorState.setInlineStyleOverride(nextEditorState, OrderedSet.of('noStyled'))
        
        this.setHashList(nextEditorState)

        this.setState({ 
            editorState: nextEditorState,
            openSnippetHint: false,
            searchStr: '',
            nowFocusSnippet: null
        })
        this.props.onChange(editorState.getCurrentContent().getPlainText() + text)
        
        return 'handled'
    }
    
    keyDownFn = (e) => {

        if (e.which == 9) {
            e.preventDefault()
        }

        // -- tab
        if (e.which == 16) {
            this.isShift = true
        }

        // -- 下
        if ( e.which == 40 ) {
            if ( this.state.openSnippetHint ){
                e.stopPropagation()
                e.preventDefault()

                if ( this.state.nowFocusSnippet != null ) {
                    this.setState( {
                        nowFocusSnippet: this.state.nowFocusSnippet + 1
                    } )
                }else{
                    this.setState( {
                        nowFocusSnippet: 0
                    } )
                }
            }
        }

        // -- 上
        if ( e.which == 38 ) {
            if ( this.state.openSnippetHint ){
                e.stopPropagation()
                e.preventDefault()
    
                if (this.state.nowFocusSnippet){
                    this.setState( {
                        nowFocusSnippet: this.state.nowFocusSnippet - 1
                    } )
                }
            }
        }

        // -- enter
        if ( e.which == 13 ) {
            if ( this.state.openSnippetHint && this.state.nowFocusSnippet !== null ){
                e.stopPropagation()
                e.preventDefault()
    
                this.handlePaste( this.nowSnippetConstent, true )
            }
        }
    }
    
    keyUpFn = (e) => {
        if (e.which == 16) {
            this.isShift = false
        }
        this.getCursorPosition()
    }

    // 決定要不要展開搜尋格
    toggleSnippetOptions = (editorState) => {
        const textSelection  = editorState.getSelection()
        const currentContent = editorState.getCurrentContent()
        const currentContentText = currentContent.getPlainText()
        const preContentText = this.state.editorState.getCurrentContent().getPlainText()
        const currentContentBlock = currentContent.getBlockForKey( textSelection.getStartKey() )
        const currentContentBlockText = currentContentBlock.getText()

        // 沒改變就不要有
        if ( currentContentText === preContentText ){
            this.openSnippetHint = false

        } else {

            if ( currentContentBlockText.length > 1 ){
                
                const startKey = textSelection.getStartOffset()
                const preText  = currentContentBlockText.substring( startKey - 1 , startKey )
                
                if ( preText !== ' ' ){
                    const isEnd = (startKey === currentContentBlockText.length)? true : false
                    const isBeforeSpace = (currentContentBlockText.substring( startKey, startKey +1 ) === ' ')? true : false
    
                    if ( isEnd || isBeforeSpace ){
                        this.openSnippetHint = true
                    } else {
                        this.openSnippetHint = false
                    }
                
                } else {
                    this.openSnippetHint = false
                
                }
            }
            // 沒字不要有
            else if ( currentContentBlockText.length === 0 ){
                this.openSnippetHint = false

            // 第一個字 always 要有
            } else {
                this.openSnippetHint = true
            }
        }
    }
    
    // -- 搜尋字串 ---------------------------------------------------------------------
    setSearchStr = (editorState) =>{
        const textSelection  = editorState.getSelection()
        const currentContent = editorState.getCurrentContent()
        const currentContentText = currentContent.getPlainText()
        const currentContentBlock = currentContent.getBlockForKey( textSelection.getStartKey() )
        const currentContentBlockText = currentContentBlock.getText()
        
        const preContentText = this.state.editorState.getCurrentContent().getPlainText()
        
        if ( this.openSnippetHint === false ){
            this.searchStr = ''
            
        } else if ( currentContentText === preContentText ){
            this.searchStr = ''

        } else {
            if ( currentContentBlockText.length > 0 ){
                const startKey = textSelection.getStartOffset()
                const preText  = currentContentBlockText.substring( startKey - 1 , startKey )
                
                if ( preText === ' ' ){
                    this.searchStr = ''
                    
                } else {
                    // 從 0 到游標前的最後一個空白鍵
                    const lastSpace = currentContentBlockText.substring( 0, startKey ).lastIndexOf(' ') 
                    this.searchStr = currentContentBlockText.substring( lastSpace, startKey ).trim()
                    this.searchStrIndex = [ lastSpace>=0?lastSpace:0, startKey ]
                }
            } else {
                this.searchStr = ''
            }
        }
    } 

    // -- 把 有 ___ 的內容位置存起來 ---------------------------------------------------------------------
    setHashList = (editorState) =>{
        const nowContentState   = editorState.getCurrentContent()
        const textBlockMapArray = nowContentState.getBlockMap().toArray()

        let hashArray = []

        let count = 0
        while( count < textBlockMapArray.length ){
            const searchKey = /___/g
            let match = null

            const content = textBlockMapArray[count].getText()
            const blockName = textBlockMapArray[count].key

            while ( ( match = searchKey.exec(content) ) != null ) {
                let hashElement = {}
                hashElement.index = count
                hashElement.blockName = blockName
                hashElement.position = match.index
                hashArray.push(hashElement)
            }
            count += 1
        }

        this.hash = hashArray
    }

    onChange = (editorState) => {
        const nowContentState   = editorState.getCurrentContent()
        const textContent       = nowContentState.getPlainText() || ''        
        const textContentArray  = textContent.split('\n')
        const textSelection     = editorState.getSelection()
        const textAnchor        = textSelection.getFocusKey()

        // -- 判斷要不要跳出選擇片語窗 ---------------------------------------------------------------------
        // ---------------------------------------------------------------------------------------------
        this.toggleSnippetOptions(editorState)

        // -- 設置搜尋字串 ---------------------------------------------------------------------
        // ---------------------------------------------------------------------------------------------
        this.setSearchStr(editorState)
        
        // -- 把 style 轉回一般 style ---------------------------------------------------------------------
        // -----------------------------------------------------------------------------------------------
        if ( editorState.getCurrentInlineStyle().toJSON().indexOf('gray') > -1 ) {
            editorState = EditorState.setInlineStyleOverride( editorState, OrderedSet.of('noStyled') )
        }

        // -- 把 有 ___ 的內容位置存起來 ---------------------------------------------------------------------
        this.setHashList(editorState)

        // --------------------------------------------------------------------------------

        this.setState({
            editorState: editorState,
            searchStr: this.searchStr
        })

        this.props.onChange(editorState.getCurrentContent().getPlainText())
    }

    handleMouseUp = () =>{
        console.log('up')
        this.getCursorPosition()
    }

    handleSnippetChange = ( data ) => {
        if (data) {
            this.nowSnippetConstent = data.name
        }
    }

    getCursorPosition = ()=>{
        let snippetPosition = {
            left  : null,
            right : null,
            top   : null,
            bottom: null
        }
        
        if ( window.getSelection().anchorNode ){
            snippetPosition = window.getSelection().getRangeAt(0).getBoundingClientRect()
        }

        this.setState({
            snippetPosition: snippetPosition,
            openSnippetHint: this.openSnippetHint,
            nowFocusSnippet: this.openSnippetHint? this.state.nowFocusSnippet: null
        })
    }

    focus = () => {
        this.editor.focus()
    }

    // 按 tab 選擇三底線
    forceSelect = (backward) => {
        const nowEditor = this.state.editorState
        const hash = this.hash

        // --- 找到 key map --- //
        const textBlockMap = nowEditor.getCurrentContent().getBlockMap()
        let textBlockKeys = []
        for (let item of textBlockMap.keys() ) {
            textBlockKeys.push(item)
        }

        // --- 找到目前游標 --- //
        const nowCursor = this.copyCursor?this.copyCursor:{
            key: nowEditor.getSelection().getFocusKey(),
            focusOffset: nowEditor.getSelection().getFocusOffset(),
            anchorOffset: nowEditor.getSelection().getAnchorOffset(),
        }
        // --- 找到目前游標後的第一個 search key --- //
        const nowCursorIndex = textBlockKeys.indexOf(nowCursor.key)
        let targetHash = false

            // --- 濾掉之前(後)的行
        const prePostHashArray = _.filter( hash, (eachHash, idx)=>{
            if (backward){
                return (eachHash.index > nowCursorIndex)?false:true
            }else{
                return (eachHash.index < nowCursorIndex)?false:true
            }
        })
            // --- 濾掉同行之前(後)的 searchkey
        const postHashArray = _.filter( prePostHashArray, (eachHash)=>{
            if (backward){
                return ( eachHash.blockName == nowCursor.key && eachHash.position >= nowCursor.focusOffset )? false:true
            }else{
                return ( eachHash.blockName == nowCursor.key && eachHash.position < nowCursor.anchorOffset )? false:true
            }
        })
        // --------------------------------------------
        
        if(postHashArray.length > 0){
            const thisHash = backward?postHashArray.slice(-1)[0]:postHashArray[0]
            const selectionState = SelectionState.createEmpty(thisHash.blockName);
            const updatedSelection = selectionState.merge({
                focusKey: thisHash.blockName,
                focusOffset: thisHash.position,
                anchorKey: thisHash.blockName,
                anchorOffset: thisHash.position+3,
                isBackward: true
            })

            let newState = EditorState.forceSelection(
                this.state.editorState,
                updatedSelection
            )

            newState = RichUtils.toggleInlineStyle(newState, 'gray')
            newState = EditorState.setInlineStyleOverride(newState, OrderedSet.of('noStyled'))

            this.setState({
                editorState: newState,
            })

            this.copyCursor = null
        } 
    }

    onTab = (e) => {
        if(this.hash.length!=0){
            this.forceSelect( this.isShift ? true : false )
        }
    }

    render() {
        const suggestions = this.state.snippetList
        const id = this.props.id || 'draftJSBody'

        let snippetHintDiv = null

        if ( this.state.openSnippetHint && this.state.snippetPosition.left != null ){
            snippetHintDiv = (
                <span style = {{ position: 'absolute', left: this.state.snippetPosition.x, top: this.state.snippetPosition.y + this.fontHeight }}>
                    <SnippetDiv 
                        snippet   = {this.state.snippetList} 
                        searchStr = {this.state.searchStr} 
                        focus     = {this.state.nowFocusSnippet} 
                        onChange  = { this.handleSnippetChange }
                    />
                </span>
            )
        }

        return (
            <div style={{ width:'100%', position:'relative' }}>
                <div
                    style={{ 
                        width: '100%',
                        overflow: 'auto'
                    }}>
                    <div
                        id={id}
                        className = 'draftjsWithMention' 
                        style={{ 
                            display: 'inline-block',
                            border: '1px solid gray', 
                            padding: '5px', 
                            height: 'auto', 
                            width: '100%',
                            overflow: 'auto',
                            fontFamily: 'monospace'
                        }}
                        onClick={this.focus}
                        ref={div=>this.draftBody=div}
                    >
                        <Editor
                            editorState = {this.state.editorState}
                            onChange    = {this.onChange}
                            ref         = {(element) => { this.editor = element }}
                            onTab       = {this.onTab}
                            spellCheck  = {true}
                            handlePastedText = {this.handlePaste} 
                            customStyleMap   = {this.StyleMap}
                        />
                    </div>
                </div>
                { snippetHintDiv }
            </div>
        )
    }
}

FreeTextWithSnippet.defaultProps = {
    defaultText: '5678',
    onChange: ()=>{}
}

export default FreeTextWithSnippet


