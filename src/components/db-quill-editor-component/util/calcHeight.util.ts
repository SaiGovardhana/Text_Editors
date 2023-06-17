//Subtracts 42 pixels if units in px
export function calcHeightForEditor(height:string)
{
    if(height.endsWith("px"))
    {
        let totalHeight=Number.parseInt(height);
        return totalHeight-42+"px";
    }
    else
        return height;
}