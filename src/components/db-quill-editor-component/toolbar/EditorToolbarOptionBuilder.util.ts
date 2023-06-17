export class EditorToolbarOptionBuilder
{   
    configObject!:any[];
    constructor(){this.configObject=[]}
    
    addBold(){this.configObject.push("bold")}
    addItalic(){this.configObject.push("italic")}
    addUnderline(){this.configObject.push("underline")}
    addStrike(){this.configObject.push("strike")}
    addFormatClean(){this.configObject.push("clean")}
    addBlockQuote(){this.configObject.push("blockquote")}
    addCode(){this.configObject.push("code")}
    addOrderdList(){this.configObject.push({ 'list': 'ordered'})}
    addUnorderedList(){this.configObject.push({ 'list': 'bullet'})}
    addIdentation(){this.configObject.push({ 'indent': '-1'}, { 'indent': '+1' })}
    addColorPicker(){this.configObject.push({ 'color': [] })}
    addFontSelector(){this.configObject.push({'font':[]})}
    addSizeSelector(){this.configObject.push({size:["small",false,"large","huge"]})}
    

    build()
    {
        return [...this.configObject];
    }

}