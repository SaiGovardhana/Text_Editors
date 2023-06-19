import { Component, Host, h, Element, Prop, Event, EventEmitter } from '@stencil/core';
/* Import TinyMCE */

import tinymce, { Editor } from 'tinymce';
import  'tinymce/models/dom/model';
 /* Default icons are required for TinyMCE 5.3 or above */
import 'tinymce/icons/default';
 /* A theme is also required */
import 'tinymce/themes/silver';
 /* Import the skin */
import 'tinymce/skins/ui/oxide/skin.css';
/* Import plugins */
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/code';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
/* Import content css */
import contentUiCss from 'tinymce/skins/ui/oxide/content.css';
import contentCss from 'tinymce/skins/content/default/content.css';
import { toolbarConfigParser } from './toolbar/ToolbarConfigParser.util';
import { EditorChangeEvent } from './db-tinymce.types';
import { autoComplete, matchesCheck, onAction, parseAutoCompleteWords } from './autocomplete/autocomplete.util';

//Get The Scripts Origin For Fetching CSS
let scriptOrigin=new URL(import.meta.url).origin;

@Component({
  tag: 'db-tinymce-editor',
  styleUrl: 'db-tinymce-editor-component.css',
  shadow: false,
})
export class DbTinymceEditorComponent {
  //Id
  @Prop({attribute:'id'})
    id:string
  //Get The Toolbar config
  @Prop({attribute:"toolbar-config"})
  toolbarConfigString!:string
  //Attribute For Hiding Toolbar
  @Prop({"attribute":"disable-toolbar"})
  disableToolbar:boolean
  @Prop({attribute:'disable-statusbar'})
  disableStatusBar:boolean
  //Read-only attribute
  
  @Prop({attribute:"read-only"})
  readOnly=false
  //Editor Width 
  @Prop({attribute:"editor-width"})
    editorWidth:string
  //Editor Height
  @Prop({attribute:"editor-height"})
    editorHeight:string
  @Prop({attribute:"editor-html-content"})
    initialEditorHTMLContent:string
  @Prop({attribute:"editor-text-content"})
    initialEditorTextContent:string
  
  //Auto Complete Configuration
  @Prop({attribute:'enable-autocomplete'})
    enableAutoComplete:boolean
  @Prop({attribute:"autocomplete-words"})
    autoCompleteWordsString:string

  
  //Internal Variables Used To Maintain Data between DOM insertion and deletion
  editorHTMLContent:string
  editorTextContent:string

  //DOM Element For This Component, Injected By Stencil
  @Element() 
    nativeEditorDOMElement:HTMLElement;
  //DOM Element For Text Area, that will the modified by TinyMCE
  private nativeTextAreaDOMElement:HTMLTextAreaElement;

  @Event({eventName:"editorchange",bubbles:false})
  editorInputChangeEvent:EventEmitter<EditorChangeEvent>;

  //Called Only Once, After first Render
  componentDidLoad()
  { console.log("[TinyMCE COMPONENT] Initial Load");
    if(this.initialEditorTextContent == null)
      this.editorTextContent="";
    if(this.initialEditorHTMLContent == null)
      this.editorHTMLContent=this.initialEditorTextContent;
    else
      this.editorHTMLContent=this.initialEditorHTMLContent;
    this.initEditor();
  
  }
  //Called Everytime When Taken Out Of DOM
  disconnectedCallback()
  {

    console.log("[TinyMCE Component] Disconnecting. Cleaning Up ");
    tinymce.get(`${this.id}-underlying`).destroy()

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
    
            
            let htmlContent=editor.getBody().innerHTML;
            let textContent=editor.getBody().innerText;
            this.editorHTMLContent=htmlContent;
            this.editorTextContent=textContent;
            this.nativeEditorDOMElement.dataset.editorHtmlContent=this.editorHTMLContent;
            this.nativeEditorDOMElement.dataset.editorTextContent=this.editorTextContent;
            this.editorInputChangeEvent.emit({htmlContent,textContent});
            
  }

  initEditor()
  {
    let toolBarConfig="fontsize bold italic strikethrough indent outdent";
    if(this.toolbarConfigString!= null && this.toolbarConfigString.trim()!= "")
    {
      toolBarConfig=toolbarConfigParser(this.toolbarConfigString);

    }
    
    //Remove .shadowRoot before querySelectoe when, shadow:false
    this.nativeTextAreaDOMElement=this.nativeEditorDOMElement.querySelector(`#${this.id}-underlying`);
    if(this.nativeTextAreaDOMElement!=null)
      {   
       tinymce.init({
          //DOM Element for transforming into RICH Editor
          selector:`#${this.id}-underlying`,//->Used when shawdowdom is false
          //target:this.nativeEditorDOMElement,
          //Dont Use Css For Content
          content_css: false,
          //Use The Css from above imports
          content_style: contentUiCss.toString() + '\n' + contentCss.toString(),
          //Used to remove the editors branding
          branding:false,
          //Used to remove promition of upgrade
          promotion:false,
          //Disable MenuBar (i.e) File,Edit.etc drop down options
          menubar:false,
          //Fixed Height
          resize:false,
          //Base Url To Find CSS files for themes
           base_url:`${scriptOrigin}/assets/tinymce`,
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
          //Set Up CallBack
          init_instance_callback:(editor)=>
          {
            let currentUpdateHandler=this.updateHandler.bind(this,editor);
            //Triggered When Input Typed
            editor.on('input',currentUpdateHandler);
            //Triggered For Change In Editor, like applying Bold, change font size .etc
            editor.on('Change',currentUpdateHandler);
          },
          //Code To Fix Text wrapping to new-line instead of horizontal scroll And AutoComplete.
          setup:  (editor) =>{
            editor.on('init', ()=> {
              
                let contentContainer = (editor.getContainer().querySelector('.tox-edit-area__iframe') as HTMLIFrameElement).contentDocument.body;
                contentContainer.style.whiteSpace = 'nowrap';
                contentContainer.style.overflowX = 'auto';
                //AutoComplete Functionality
                if(this.enableAutoComplete==true && this.autoCompleteWordsString!=null)
                {
                let parsedWords=parseAutoCompleteWords(this.autoCompleteWordsString);
                let autoCompleteFetchCallback=autoComplete.bind(null,parsedWords);
                let onActionCallback=onAction.bind(null,editor);
                //Note: Couldn't Import Types
                //@ts-ignore
                editor.ui.registry.addAutocompleter("Demo",{matches:matchesCheck,trigger:"@",minChars:0,onAction:onActionCallback,fetch:autoCompleteFetchCallback})
                }
            });
        }
        });
        
      }
  
  }

  render() {
    let content=this.editorHTMLContent;
    if(content == null)
      content=this.initialEditorHTMLContent||this.initialEditorTextContent;
    return (
      <Host>
        <textarea value={content} id={this.id+"-underlying"}></textarea>
      </Host>
    );
  }

}
