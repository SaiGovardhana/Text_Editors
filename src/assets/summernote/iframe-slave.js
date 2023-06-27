let isInitComplete=false;
let messageChannel=null;
let port=null;
let lastTimeout=null;
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

window.onmessage=MessageHandler

function onInitMessage(e)
{
    port=e.ports[0];
    port.onmessage=MessageHandler
    initializeEditor(e.data.placeholder,e.data.config,e.data.editorHeight,e.data.content,e.data.readOnly);

}

function onContentChange(e)
{   
    if(e.data.content.localeCompare($("#summernote").summernote("code"))!=0)
        $("#summernote").summernote("code",e.data.content);
}

function onReadOnlyChange(e)
{
    if(e.data.readOnly)
        $("#summernote").summernote('disable');
    else
        $("#summernote").summernote('enable');
}

function initializeEditor(placeholder,toolBarConfig,editorHeight,content,isReadOnly)
{   
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
                    if(lastTimeout!=null)
                        clearTimeout(lastTimeout);
                    lastTimeout=setTimeout(()=>port.postMessage({eventType:'editor-content-change',content:contents}),250)
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
