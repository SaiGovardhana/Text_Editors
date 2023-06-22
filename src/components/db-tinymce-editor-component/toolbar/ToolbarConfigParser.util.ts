import { EditorToolbarOptionBuilder } from "./EditorToolbarOptionBuilder.util";
import { ToolbarOption } from "./Toolbar.types";

export function toolbarConfigParser(configString:string)
{   let configBuilder=new EditorToolbarOptionBuilder();
    let toolbarConfig:ToolbarOption[]=configString.split("|")  as ToolbarOption[];
    for(let option of toolbarConfig)
    {
        switch(option)
        {
            case "bold":
                configBuilder.addBold();
                break;
            case "italic":
                configBuilder.addItalic();
                break;
            case "underline":
                configBuilder.addUnderline();
                break;
            case "strike":
                configBuilder.addStrike();
                break;
            case "clean":
                configBuilder.addFormatClean();
                break;
            case "code":
                configBuilder.addCode();
                break;
            case "blockQuote":
                configBuilder.addBlockQuote();
                break;
            case "orderedList":
                configBuilder.addOrderdList();
                break;
            case "unOrderedList":
                configBuilder.addUnorderedList();
                break;
            case "indent":
                configBuilder.addIdentation();
                break;
            case "font":
                configBuilder.addFontSelector();
                break;
            case "fontSize":
                configBuilder.addSizeSelector();
                break;
            case "textColor":
                configBuilder.addColorPicker();
                break;
            case "undoRedo":
                configBuilder.addUndoRedo();
                break;
            case "lineHeight":
                configBuilder.addLineHeight();
                break;
            case "textAlign":
                configBuilder.addAlignments();
                break;
            case "backgroundColor":
                    configBuilder.addBackgroundColor();
                    break;
            case "headers":
                configBuilder.addHeaders();
                break;
            case "copy":
                configBuilder.addCopy();
                break;
            default:
                    console.error(`[ConfigParser.util.ts] Invalid Param For ToolBar Config Parser : ${option}`)
            }
    }
    return configBuilder.build();

}