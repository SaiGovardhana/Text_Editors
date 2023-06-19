/**These functions are used for Autocomplete Functionality  */

//Used to parse single word string to array of string
export function parseAutoCompleteWords(wordsString:string)
{
    return wordsString.split("|");
}
//Fetch Function Return A promise containing Results
//Used as fetch function for autocomplete
export async function autoComplete(words:string[],pattern:string):Promise<{type:'autocompleteitem',value:string,text:string}[]>
{   pattern=pattern.replace(/@/g, '');
    let filteredResult=words.filter(word=>word.startsWith(pattern));
    if(filteredResult.length == 0 )
        filteredResult.push(`@`+pattern);
    
    return filteredResult.map(word=>({type:'autocompleteitem',value:word,text:word}))
}

//Used For CallBack On Select Of Auto Complete
//@ts-ignore
export async function onAction(editor,autocompleteApi, rng, value) {
    editor.selection.setRng(rng);
    editor.insertContent(value);
    autocompleteApi.hide();
  };
//Used to check whether to trigger drop down for AutoCompleter
//@ts-ignore
export async function matchesCheck(rng,text,pattern)
{ 
    
    return true;
}