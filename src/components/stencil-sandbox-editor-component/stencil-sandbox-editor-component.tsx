import { Component, Host, h, Element, Prop, Watch, Event, EventEmitter } from '@stencil/core';
import { toolbarConfigParser } from './toolbar/ToolbarConfigParser.util';


@Component({
  tag: 'stencil-sandbox-editor-component',
  styleUrl: 'stencil-sandbox-editor-component.css',
  shadow: true,
})
export class StencilSandboxEditorComponent {
  @Element()
    el:HTMLElement
  @Prop({attribute:'editor-html-content',mutable:true,reflect:true})
    editorHTMLContent:string
  @Prop({attribute:'read-only',mutable:true,reflect:true})
    readOnly=false

  @Prop({attribute:'editor-width'})
    editorWidth:'string'
  @Prop({attribute:'disable-toolbar'})
    disableToolbar=false
  
  @Prop({attribute:'editor-height'})
    editorHeight:string="300px"

  @Prop({attribute:'toolbar-config'})
    toolbarConfigString:string='bold'
  @Prop({attribute:'placeholder'})
    placeholder:string='This Is A Demo Placeholder'
  editorIframe:HTMLIFrameElement;

  @Event({eventName:'content-change',bubbles:false})
    contentChangeEmitter:EventEmitter<{htmlContent:string}>
  //Used To Communicate with iframe
  messageChannel=new MessageChannel();

  
  @Watch('readOnly')
  watchReadOnly(newValue:boolean)
  {
    this.messageChannel.port1.postMessage({eventType:'read-only-change',readOnly:newValue})
  }

  @Watch('editorHTMLContent')
  watchHtmlContent(newValue:string)
  { 
    if(newValue==""||newValue==null)
      newValue="<p><br></p>"
    this.contentChangeEmitter.emit({htmlContent:newValue});
    this.messageChannel.port1.postMessage({eventType:'content-change',content:newValue})
  }

  //Initialize Component
  initializeComponent()
  {
    this.editorIframe=this.el.shadowRoot.querySelector("iframe");
    this.editorIframe.onload=()=>this.initIframeCallback();
    
  }

  //Set Content When Changed in IFrame Editor
  updateContentCallback(content:string)
  {
    
    this.editorHTMLContent=content;
  }
  //Intialize Height After SummerNote init callback
  initHeight()
  {
      let height=this.editorIframe.contentWindow.document.body.scrollHeight;
      this.editorIframe.style.height=height+"px";
  }
  

  //Send Initial Config,Content,Read-Only
  initIframeCallback()
  {
    //Send IFrame to Initialize Editor in IFrame
    this.editorIframe.contentWindow.postMessage({eventType:'init-editor',placeholder:this.placeholder,config:this.disableToolbar?false:toolbarConfigParser(this.toolbarConfigString),editorHeight:this.editorHeight,content:this.editorHTMLContent,readOnly:this.readOnly},"*",[this.messageChannel.port2]);
    this.messageChannel.port1.onmessage=this.messageHandler;
  }
  //Handle Message From IFrame
  messageHandler=(event:MessageEvent<{eventType:string,content:string}>)=>
  { 
    let {eventType,content}=event.data;
    switch(eventType)
    {
      case 'init-summernote':
        this.initHeight();
        break;
      case 'editor-content-change':
        this.updateContentCallback(content);
        break;


    }

  }


  componentDidLoad()
  {
    this.initializeComponent()
  }
  render() {
    
    return (
      <Host>
        <iframe style={{width:this.editorWidth}}  src='/assets/summernote/summernote.iframe.html'></iframe>
      </Host>
    );
  }

}
