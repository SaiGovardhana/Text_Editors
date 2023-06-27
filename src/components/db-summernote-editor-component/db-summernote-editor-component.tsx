import { Component, Host, h, ComponentDidLoad, Element, Prop, Watch, Event, EventEmitter } from '@stencil/core';
import { toolbarConfigParser } from './toolbar/ToolbarConfigParser.util';

// import '../../assets/summernote/jquery.min.js'
// import '../../assets/summernote/bootstrap.bundle.min.js'
// import '../../assets/summernote/summernote.min.js'

import '../../assets/summernote/jquery.slim.min.js'
import "../../assets/summernote/summernote-lite.min.js"
@Component({
  tag: 'db-summernote-editor-component',
  styleUrl: 'db-summernote-editor-component.css',
  shadow: false,
})
export class DbSummernoteEditorComponent implements ComponentDidLoad{
  @Element()
    el:HTMLElement
  //Id
  @Prop({attribute:'id'})
    id:string

  //Get The Toolbar config
  @Prop({attribute:"toolbar-config"})
  toolbarConfigString:string="orderedList|indent|font|fontSize"
  //Attribute For Hiding Toolbar
  @Prop({"attribute":"disable-toolbar"})
  disableToolbar:boolean=false
  //Read-only attribute
  @Prop({attribute:"read-only",mutable:true,reflect:true})
  readOnly=false
  //Editor Width 
  @Prop({attribute:"editor-width"})
    editorWidth:string="auto"
  //Editor Height
  @Prop({attribute:"editor-height"})
    editorHeight:string
  @Prop({attribute:'placeholder'})
    placeholder:string="Enter Text"

  @Prop({attribute:'editor-html-content',reflect:true,mutable:true})
    editorHTMLContent:string

  
  isIntializedOnce=false;
  @Watch("readOnly")
    externalReadOnlyUpdate(newValue)
    {
        if(newValue)
          //@ts-ignore
          $(this.el).find(".db-underlying-textarea").summernote('disable')
        else
          //@ts-ignore
          $(this.el).find(".db-underlying-textarea").summernote('enable')

    }

  @Watch("editorHTMLContent")
    externalHTMLUpdate(newValue)
    { 
      //Prevent Text Being Empty, For Visual Purpose
      if(newValue==""){
      //@ts-ignore
        $(this.el).find(".db-underlying-textarea").summernote("code","<p><br></p>")
        return ;
      }

      //@ts-ignore
      if(newValue==null||newValue.localeCompare($(this.el).find(".db-underlying-textarea").summernote("code")))
      {

      //@ts-ignore
      $(this.el).find(".db-underlying-textarea").summernote("code",newValue||"")
      }
      
    }

  @Event({eventName:'content-change',bubbles:false})
    editorInputChangeEvent:EventEmitter<{htmlContent:string}>;



  //Destroy SummerNote Editor Instance
  destroyEditor()
  {
    //@ts-ignore
    $(this.el).find(".db-underlying-textarea").summernote("destroy")
  }

  //Function Used To Initialize The Editor
  initializeEditor()
  {     let parsedConfig=this.disableToolbar?false:toolbarConfigParser(this.toolbarConfigString)
        //@ts-ignore
        //Initalize Editor
        $(this.el).find(".db-underlying-textarea").summernote(
          { contents:this.editorHTMLContent,
            toolbar:parsedConfig,
            placeholder:"<p>"+this.placeholder.replace(/</g, '&lt;').replace(/>/g, '&gt;')+"</p>",
            width:this.editorWidth,
            height:this.editorHeight,
            disableDragAndDrop : true,
            shortcuts:!this.disableToolbar,
            disabled:this.readOnly,
            spellCheck:false,
            callbacks:{

              onChange:(content:string)=>this.updateContent(content)
            }  
          
          }
          );
        if(this.readOnly)
          //@ts-ignore
          $(this.el).find(".db-underlying-textarea").summernote('disable')
        else
          //@ts-ignore
          $(this.el).find(".db-underlying-textarea").summernote('enable')
          
          
      
  }
  //Used as callback by SummerNote
  updateContent(content:string)
  {
    this.editorInputChangeEvent.emit({htmlContent:content});
    this.editorHTMLContent=content;
  }

  componentDidLoad()
  {
    console.log("[SummerNote Component] First Initalization");
    this.isIntializedOnce=true;
    this.initializeEditor();

  }

  //Called When Component Disconnected From DOM
  disconnectedCallback()
  {
    console.log("[SummerNote Component] Disconnecting From DOM");
    this.destroyEditor();
  }

  //Called When Component Connected To DOM
  connectedCallback()
  {
    if(this.isIntializedOnce)
      {
        console.log("[SummerNot Component] Reconnecting To DOM");
        this.initializeEditor();
      }

  }


  render() {
    return (
      <Host>
          <textarea class={"db-underlying-textarea"}>{this.editorHTMLContent}</textarea>
      </Host>
    );
  }

}
