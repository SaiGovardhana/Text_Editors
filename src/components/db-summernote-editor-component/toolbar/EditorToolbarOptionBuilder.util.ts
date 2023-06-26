//Helper Class For Building The Options
export class EditorToolbarOptionBuilder
{   
    configObject=new Map<string,Array<string>>;
    addToConfig(key:string,value:string)
    {
        if(this.configObject.has(key))
        {   
            let valueArray=this.configObject.get(key);
            if(!valueArray.includes(value))
                valueArray.push(value);
        }
        else
            this.configObject.set(key,[value]);
    }
    addBold(){this.addToConfig('style','bold')}
    addItalic(){this.addToConfig('style','italic')}
    addUnderline(){this.addToConfig('style','underline')}
    addStrike(){this.addToConfig("style","strikethrough")}
    addFormatClean(){this.addToConfig("style","clear")}
    addBlockQuote(){}
    addCode(){}
    addOrderdList(){this.addToConfig("para","ol")}
    addUnorderedList(){this.addToConfig("para","ul")}
    addIdentation(){this.addToConfig("para","paragraph")}
    addColorPicker(){this.addToConfig("color","forecolor")}
    addFontSelector(){this.addToConfig("font","fontname")}
    addSizeSelector(){this.addToConfig("font","fontsize")}
    addLineHeight(){this.addToConfig("height","height")}
    addUndoRedo(){this.addToConfig("undoRedo","undo");this.addToConfig("undoRedo","redo");}
    addAlignments(){this.addToConfig("para","paragraph")}
    addBackgroundColor(){this.addToConfig("color","backcolor")}
    addHeaders(){this.addToConfig("headers","style")}
    addCopy(){}

    build()
    {
        return Array.from(this.configObject.entries())
    }

}