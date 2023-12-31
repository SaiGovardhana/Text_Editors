import { Component, Host, h, Element, Prop, Event, EventEmitter, Watch } from '@stencil/core';
/* Import TinyMCE */
import tinymce, { Editor } from 'tinymce';

import { toolbarConfigParser } from './toolbar/ToolbarConfigParser.util';
import { EditorChangeEvent } from './db-tinymce.types';
import { autoComplete, matchesCheck, onAction, parseAutoCompleteWords } from './autocomplete/autocomplete.util';

//Get The Scripts Origin For Fetching CSS
let scriptOrigin=new URL(import.meta.url).origin;


import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';

/* Import a skin (can be a custom skin instead of the default) */
import  'tinymce/skins/ui/oxide/skin.css';

/* Import plugins */
import 'tinymce/plugins/code';
import 'tinymce/plugins/lists';


/* content UI CSS is required */
import contentUiSkinCss from 'tinymce/skins/ui/oxide/content.css';

/* The default content CSS can be changed or replaced with appropriate CSS for the editor content. */
import contentCss from 'tinymce/skins/content/default/content.css';


@Component({
  tag: 'db-tinymce-editor',
  styleUrl: 'db-tinymce-editor-component.css',
  shadow:true,
})
export class DbTinymceEditorComponent {
  //Id
  @Prop({attribute:'id'})
    id:string
  //Base url Of Assets
  @Prop({attribute:'assets-url'})
    baseUrl:string='/assets/tinymce'
  //Get The Toolbar config
  @Prop({attribute:"toolbar-config"})
  toolbarConfigString!:string
  //Attribute For Hiding Toolbar
  @Prop({"attribute":"disable-toolbar"})
  disableToolbar:boolean
  @Prop({attribute:'disable-statusbar'})
  disableStatusBar:boolean
  //Read-only attribute
  @Prop({attribute:"read-only",mutable:true,reflect:true})
  readOnly=false
  //Editor Width 
  @Prop({attribute:"editor-width"})
    editorWidth:string
  //Editor Height
  @Prop({attribute:"editor-height"})
    editorHeight:string
  @Prop({attribute:'placeholder'})
    placeholder:string
  //Auto Complete Configuration
  @Prop({attribute:'enable-autocomplete'})
    enableAutoComplete:boolean
  @Prop({attribute:"autocomplete-words"})
    autoCompleteWordsString:string

  
  //Internal Variables Used To Maintain Data between DOM insertion and deletion
  @Prop({attribute:'editor-html-content',reflect:true,mutable:true})
  editorHTMLContent:string
  @Prop({attribute:'editor-text-content',reflect:true,mutable:true})
  editorTextContent:string
  editor:Editor

  //Update content if any props change, triggers render
  componentShouldUpdate()
  { 
    return true;
  }

  //Updates tinymce if content changed from outside
  @Watch("editorHTMLContent")
    updateChangeFromExternal()
    {
    if(this.editor == null)
      return;
    if(this.editor.getContent({format:'html'}).localeCompare(this.editorHTMLContent) !=0 )
      this.editor.setContent(this.editorHTMLContent)
      
    }
  //Updates Read Only Dynamically
  @Watch("readOnly")
    updateMode(newValue:boolean)
    {
      if(this.editor == null)
        return;

      if(newValue)
        this.editor.mode.set('readonly')
      else
        this.editor.mode.set('design')
    }


  //DOM Element For This Component, Injected By Stencil
  @Element() 
    nativeEditorDOMElement:HTMLElement;
  //DOM Element For Text Area, that will the modified by TinyMCE
  private nativeTextAreaDOMElement:HTMLTextAreaElement;

  @Event({eventName:"content-change",bubbles:false})
  editorInputChangeEvent:EventEmitter<EditorChangeEvent>;

  //Called Only Once, After first Render
  componentDidLoad()
  { console.log("[TinyMCE COMPONENT] Initial Load");

    this.initEditor();
  
  }
  //Called Everytime When Taken Out Of DOM
  disconnectedCallback()
  {

    console.log("[TinyMCE Component] Disconnecting. Cleaning Up ");
    //tinymce.get(`${this.id}-underlying`).destroy()
    if(this.editor == null)
      return;
    this.editor.destroy()
  }
  //Called Everytime Connected to DOM
  connectedCallback()
  {
    if(this.nativeTextAreaDOMElement !=null)
    {
      console.log("[TinyMCE Component] Reconnectiong To DOM");
      this.initEditor();
    }
  }
  //Called When there in change in TinyMCE
  updateHandler=(editor:Editor)=>
  {
            if(this.editor == null)
              return;
            let htmlContent=editor.getContent({format:'html'});
            let textContent=editor.getContent({format:'text'});
            this.editorHTMLContent=htmlContent;
            this.editorTextContent=textContent;
            if(this.nativeEditorDOMElement.isConnected)
              this.editorInputChangeEvent.emit({htmlContent,textContent});
            
  }

  async initEditor()
  {
    let toolBarConfig="undo redo blocks bold italic underline forecolor backcolor alignleft aligncenter alignright";
    if(this.toolbarConfigString!= null && this.toolbarConfigString.trim()!= "")
    {
      toolBarConfig=toolbarConfigParser(this.toolbarConfigString);

    }
    
    //Remove .shadowRoot before querySelectoe when, shadow:false
    this.nativeTextAreaDOMElement=this.nativeEditorDOMElement.shadowRoot.querySelector(`textarea`);
    if(this.nativeTextAreaDOMElement!=null)
      {   

        tinymce.init({
          content_style:contentCss.toString()+"\n"+contentUiSkinCss.toString(),
          content_css:false,
          
        
          //DOM Element for transforming into RICH Editor
          target:this.nativeTextAreaDOMElement,
          //Used to remove the editors branding
          branding:false,
          //Used to remove promition of upgrade
          promotion:false,
          //Disable MenuBar (i.e) File,Edit.etc drop down options
          menubar:false,
          //Fixed Height
          resize:false,
          //Base Url To Find CSS files for themes
          base_url:`${scriptOrigin}${this.baseUrl}`,
          //plugins
          plugins:"lists",
          //Specify Options as Space Seperated values
          toolbar:this.disableToolbar?false:toolBarConfig,
          //Specify status bar visibilty
          statusbar:this.disableStatusBar?false:true,
          //Read Only Property
          readonly:this.readOnly,
          //Set Height And Width
          height:this.editorHeight,
          inline:false,
          width:this.editorWidth,
          placeholder:this.placeholder||"Enter Text Here",
          block_formats: 'H1=h1;H2=h2;H3=h3;H4=h4;H5=h5;H6=h6;Paragraph=p',
          //Stup Initalization Callback,
          //Code To Fix Text wrapping to new-line instead of horizontal scroll
          //AutoComplete.
          setup:  (editor) =>{
            editor.on('SkinLoadError',()=>{console.log("[TinyMCE Component]Error! Couldn't Fetch Css")});

            editor.on('init', ()=> 
            { try{
              
              if(!this.nativeEditorDOMElement.isConnected)
              {
                console.log("[TinyMCE Component] DOM Element Already Removed")
                if(editor!=null)
                editor.destroy();
              }
              this.editor=editor;
              let currentUpdateHandler=this.updateHandler.bind(this,editor);
              //Triggered When Input Typed
              editor.on('input undo redo Change',currentUpdateHandler);

                //Note:UnComment To Go TO Next Line Only When Enter Pressed
              // let contentContainer = (editor.getContainer().querySelector('.tox-edit-area__iframe') as HTMLIFrameElement).contentDocument.body;
                //Style to prevent text from wraping into two lines
              // contentContainer.style.whiteSpace = 'nowrap';
              // contentContainer.style.overflowX = 'auto';
                
              //Modified Style For Square Border 
                editor.getContainer().style.borderRadius="0px";
                
                //AutoComplete Functionality
                if(this.enableAutoComplete==true && this.autoCompleteWordsString!=null)
                {
                let parsedWords=parseAutoCompleteWords(this.autoCompleteWordsString);
                let autoCompleteFetchCallback=autoComplete.bind(null,parsedWords);
                let onActionCallback=onAction.bind(null,editor);
                //Note: Couldn't Import Types
                //@ts-ignore
                editor.ui.registry.addAutocompleter("RootAutoCompleter",{matches:matchesCheck,trigger:"@",minChars:0,onAction:onActionCallback,fetch:autoCompleteFetchCallback})
                }
            
              }
              catch(E)
              {
                console.log("[TinyMCE Component] Error While Initalizing TinyMCE")
                if(editor!=null)
                  editor.destroy();

              }
            });
        }
        });
    }
  
  }

  render() {
    
    let content=this.editorHTMLContent;
    if(content == null)
      content=this.editorTextContent;
    return (
      <Host>
          <textarea  >{content}</textarea>
      </Host>
    );
  }

}
