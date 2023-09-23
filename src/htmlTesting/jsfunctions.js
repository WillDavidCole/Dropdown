const grammars = { // the possible grammars (see those used below)
  1: ['fixed'], // eventually, this could just be a value, int or between quotations for a string, needs a regex verifier for the errors
  2: ['data','node'],
  3: ['data','node', 'nodestep'],
  4: ['data','enhanceddata'],
  5: ['data','enhanceddata','enhanceddatastep'],
  6: ['data','performancestatistic'],
  7: ['data', 'level', 'datatype', 'key'],
  8: ['data', 'level', 'datatype', 'definition'],
  9: ['data', 'level', 'datatype', 'key', "currency"],
  10: ['data', 'level', 'datatype', 'definition', "currency"],
  11: ['data', 'level', 'datatype', 'key', "currencytype"],
  12: ['data', 'level', 'datatype', 'definition', "currencytype"]
};

const followingSymbol = { 'fixed':'.' ,'data':'.' ,'node':'(','nodestep':'(','enhanceddata':'(' ,
                          'enhanceddatastep':'(' ,'performancestatistic':'(','level':'(','datatype':'(',
                          'key':'(','definition':'(','currency':'(','currencytype':'('}

