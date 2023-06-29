//Communcation Port Sent From WebComponent, Initialized in init-editor callback
let port=null;
//Used For DebounceType
let lastTimeout=null;
//Store the lastContent Of Editor, set in onChange Of SummerNote
let lastContent=null;
//Last Timeout For Resize Event
let lastResizeTimeout=null;

/**
 * Message Handler For Callback
 * @param {MessageEvent<{eventType:string,readonly?:boolean,content?:string}>} e 
 */
const MessageHandler=(e)=>
{
    
        switch(e.data.eventType)
        {
            case 'init-editor':
                onInitMessage(e);
                break;
            case 'content-change':
                onContentChange(e);
                break;
            case 'read-only-change':
                onReadOnlyChange(e)
                break;


        }
    
    

}


//First Message Handled By Window As No Port Recieved at this point
//After message passing happens through port
window.onmessage=MessageHandler

//Resize Event Listener Send Message To Parent
window.onresize=()=>
{
    if(port!=null)
    {
        if(lastResizeTimeout!=null)
            clearTimeout(lastResizeTimeout)
        lastResizeTimeout=setTimeout(()=>port.postMessage({eventType:'editor-resize'}),100);
    }
}

/**
 * 
 * @param {MessageEvent<{ports:Array<MessagePort>}>} e 
 */
function onInitMessage(e)
{
    port=e.ports[0];
    port.onmessage=MessageHandler;
    initializeEditor(e.data.placeholder,e.data.config,e.data.editorHeight,e.data.content,e.data.readOnly);

}

/**
 *Callback helper when content change message sent from web component 
 * @param {MessageEvent<{eventType:string,content?:string}>} e 
 */
function onContentChange(e)
{   
    //Change Content From OutSide IFrame
    if(e.data.content.localeCompare(lastContent)!=0)
    {
        if(lastTimeout!=null)
            clearTimeout(lastTimeout);

        $("#summernote").summernote("code",e.data.content);
        lastContent=e.data.content;


    }
    
}

/**
 * 
 * @param {MessageEvent<{readOnly:boolean}>} e 
 */
function onReadOnlyChange(e)
{
    if(e.data.readOnly)
        $("#summernote").summernote('disable');
    else
        $("#summernote").summernote('enable');
}
/**
 * Initialize The SummerNote Editor
 * @param {string} placeholder 
 * @param {any} toolBarConfig 
 * @param {string} editorHeight 
 * @param {string} content 
 * @param {boolean} isReadOnly 
 */
function initializeEditor(placeholder,toolBarConfig,editorHeight,content,isReadOnly)
{       lastContent=content;
        let config={
            placeholder: "<p>"+placeholder.replace(/</g, '&lt;').replace(/>/g, '&gt;')+"</p>",
            height: editorHeight,
            minHeight: editorHeight,
            toolbar: toolBarConfig,
            disableDragAndDrop : true,
            spellCheck:false,
            callbacks:
            {
                onInit:()=>port.postMessage({eventType:'init-summernote'}),
                onChange:(contents)=>{
                    //Debounce
                    if(contents=="")
                    {    $("#summernote").summernote("code","<p><br></p>");
                        contents="<p><br></p>";
                    }
                
                    if(lastTimeout!=null)
                        clearTimeout(lastTimeout);
                    lastTimeout=setTimeout(()=>{lastContent=contents;if(port!=null)port.postMessage({eventType:'editor-content-change',content:contents})},100)
                }
            }
          }
    $('#summernote').summernote(config);
    $("#summernote").summernote("code",content);
    if(isReadOnly)
        $("#summernote").summernote('disable')
    else
          $('#summernote').summernote('enable')
}
