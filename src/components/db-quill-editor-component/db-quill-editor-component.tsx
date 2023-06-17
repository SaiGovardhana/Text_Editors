import { Component, Element, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import Quill from 'quill';
import { EditorChangeEvent } from './quill-editor.types';
import { DefaultToolbarOptions } from './toolbar/DefaultToolbar.options';
import { toolbarConfigParser } from './toolbar/ToolbarConfigParser.util';
import { calcHeightForEditor } from './util/calcHeight.util';

@Component({
  tag: 'db-quill-editor',
  styleUrls:[ "db-quill-editor-component.css"],
  shadow: false,

})
export class DbQuillEditorComponent {
  @Prop({attribute:"id"})
    id:string|null
  @Prop({attribute:"editor-html-content",reflect:false})
    initalEditorHtmlContent:string|null
  @Prop({attribute:"editor-text-content",reflect:false})
    initialEditorTextContent:string|null
  @Prop({attribute:"read-only"})
    readOnly=false
  @Prop({attribute:"toolbar-config"})
    toolbarConfigString!:string
  @Prop({"attribute":"disable-toolbar"})
    disableToolbar:boolean
  @Prop({attribute:"editor-height"})
    editorHeight:string;
  @Prop({attribute:"editor-width"})
    editorWidth:string;
  @Element() 
    nativeEditorDOMElement:HTMLElement;
  
  @Event({bubbles:false,eventName:"editorchange"})
    editorInputChangeEvent:EventEmitter<EditorChangeEvent>;
  //Internal Variables Dont Trigger Render By Changing
  private editor!:Quill
  private editorTextContent:string
  private editorHtmlContent:string

  componentDidLoad()
  { console.log("[Quill Editor Component] First Time Component Load");
    //Load Default Config Object
    let configObject=DefaultToolbarOptions;

    //No Html Content Passesd Set The Text Content
    if(this.initalEditorHtmlContent == null)
      this.editorHtmlContent=this.initialEditorTextContent||"";
    else
      this.editorHtmlContent=this.initalEditorHtmlContent    
    this.editorTextContent=this.initialEditorTextContent||"";

    //If Toolbar Config Passed Parse It And Get Config Object
    if(this.toolbarConfigString != null)
      configObject=toolbarConfigParser(this.toolbarConfigString);
    
    //Find The Editor
    let editorDiv=this.nativeEditorDOMElement.querySelector("#"+this.id+'-underlying');   
     //Modules For Quill
     let modules:Record<string,any>={toolbar:configObject};
     //If Toolbar disabled
     if(this.disableToolbar)
       modules={toolbar:false}
  
    if(editorDiv !=null)
      this.editor=new Quill(editorDiv,{modules:modules, readOnly:this.readOnly,theme:'snow'}); 
    this.editor.on("text-change",this.updateHandler)
  }
  //Event Handler When An Input Is Given To Text Editor
  //Updates hiddent text areas, sets dataset attributes on native Element
  updateHandler=()=>
  { 
    this.editorHtmlContent=this.editor.root.innerHTML;
    this.editorTextContent=this.editor.root.textContent||"";
    this.nativeEditorDOMElement.dataset.htmlContent=this.editorHtmlContent;
    this.nativeEditorDOMElement.dataset.textContent=this.editorTextContent;
    this.editorInputChangeEvent.emit({htmlContent:this.editorHtmlContent,textContent:this.editorTextContent});

  }

  //If the Element is Connected to DOM, add Event Listener
  //Editor Is NULL for first time, since connected Callback called before
  //ComponentDidLoad
  connectedCallback()
  {
    
    if(this.editor!=null)
    { console.log("[Quill Editor Component] Re-Connecting To DOM");
      this.editor.on('text-change',this.updateHandler);
    }

  }

  //If The Element Is Taken Off DOM, Remove Event Listeners
  disconnectedCallback()
  {
    console.log("[Quill Editor Component] Disconnecting From DOM");
    this.editor.off("text-change",this.updateHandler);
  }
  
  
  render() {
    let editorHeight=this.editorHeight|| "200px";
    let editorWidth=this.editorWidth || "100%";
    return (
    <Host >
    <div style={{width:editorWidth,height:editorHeight}}  id={this.id+"-quill-container"} >
      <div style={{width:editorWidth,height:calcHeightForEditor(editorHeight),"overflow-y":"auto"}} id={this.id+'-underlying'}></div>
    </div>
  </Host>
    );
  }

}

