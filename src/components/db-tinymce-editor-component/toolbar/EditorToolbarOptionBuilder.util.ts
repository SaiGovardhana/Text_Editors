//Helper Class For Building The Options
export class EditorToolbarOptionBuilder
{   
    configObject!:any[];
    constructor(){this.configObject=[]}
    
    addBold(){this.configObject.push("bold")}
    addItalic(){this.configObject.push("italic")}
    addUnderline(){this.configObject.push("underline")}
    addStrike(){this.configObject.push("strikethrough")}
    addFormatClean(){this.configObject.push("removeformat")}
    addBlockQuote(){this.configObject.push("blockquote")}
    addCode(){this.configObject.push("code")}
    addOrderdList(){this.configObject.push("numlist")}
    addUnorderedList(){this.configObject.push("bullist")}
    addIdentation(){this.configObject.push("indent outdent")}
    addColorPicker(){this.configObject.push("forecolor")}
    addFontSelector(){this.configObject.push("fontfamily")}
    addSizeSelector(){this.configObject.push("fontsize")}
    addLineHeight(){this.configObject.push("lineheight")}
    addUndoRedo(){this.configObject.push("undo","redo")}
    addAlignments(){this.configObject.push("alignleft","aligncenter","alignright","alignjustify")}
    addBackgroundColor(){this.configObject.push("backcolor")}
    addHeaders(){this.configObject.push("blocks");}
    addCopy(){this.configObject.push("copy")}

    build()
    {
        return this.configObject.join(" ");
    }

}