export const getDiff = (inputOne, inputTwo) => ((inputOne.length > inputTwo.length) ?  inputOne.substring(inputTwo.length, inputOne.length ) :  inputTwo.substring(inputOne.length, inputTwo.length) )

//input.wordList, input.rootList, inputText, input.inputRoot, root
export const filterTokenList = (wordListArray, rootListArray, inputFilter, inputRoot, isRoot) =>  
{
  if(isRoot)
  {
    
    return rootListArray.filter((i) => (i.toLowerCase().startsWith( i.substring(inputRoot.length).toLowerCase())))
  } 
  else
  {
    return wordListArray.filter((i) => (i.toLowerCase().startsWith( i.substring(inputRoot.length).toLowerCase())))
  }
}

export const setDropdownIndex = (index, length, move) => {
  return; //TODO = next setDropdownIndex complete this function
}

export const updateInputAttributeFromId = (inputs, id=NaN, attribute, newValue) => {
    for (let object of inputs) {
      if (!isNaN(id) && object.id === id) {
          object[attribute] = newValue;
      }
      else if(isNaN(id))
      {
        object[attribute] = newValue;
      }
    }
    return;
  }
  
  export const updateInputAttributeFromIndex = (inputs, index, attribute, newValue) => {
    inputs[index][attribute] = newValue;
    return;
  }
  
  export const readInputAttribute = (inputs, id, attribute) => {
    let index = inputs.findIndex((input) => input.id === id);
    return inputs[index][attribute];
  }
  
  export const getFirstInputIdWithAttributeValue = (inputs,attribute,value,returnAttribute) => {
    for (let object of inputs) {
      if(object[attribute] === value)
      {
        return object[returnAttribute];
      }
    }
  }
  
  export const getFirstInputIndexWithAttributeValue = (inputs,attribute,value) => {
    let i = 0;
    for (let object of inputs) {
      if(object[attribute] === value)
      {
        return i;
      }
      i++;
    }
  }
  
//   export updateInputAttributeFromId,updateInputAttributeFromIndex,getFirstInputIndexWithAttributeValue,getFirstInputIdWithAttributeValue,readInputAttribute;