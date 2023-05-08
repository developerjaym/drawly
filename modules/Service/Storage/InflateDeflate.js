const deflateInfateMarkMap = {
    "g": "strokeGroupId",
    "t": "type",
    "c": "color"
  }
  
  const reverseMap = (map) => {
    const newMap = {}
    for(const key in map) {
      newMap[map[key]] = key;
    }
    return newMap;
  }
  
  const inflateDeflateMarkMap = reverseMap(deflateInfateMarkMap)
  
  
  const deflateInflateTypeMap = {
    "w": "width",
    "n": "name"
  }
  
  const inflateDeflateTypeMap = reverseMap(deflateInflateTypeMap)
  
  const transformWithMap = (obj, map) => {
    obj = {...obj}
    for(const key in map) {
      obj[map[key]] = obj[key]
      delete obj[key]
    }
    return obj;
  }
  
  const deflate = (state) => {
    state = {...state}
    state.marks = state.marks.map(mark => 
      transformWithMap(mark, inflateDeflateMarkMap)
    )
    state.marks.forEach(mark => 
      mark[inflateDeflateMarkMap["type"]] = transformWithMap(mark[inflateDeflateMarkMap["type"]], inflateDeflateTypeMap)
    )
    return state;
  }
  
  const inflate = (state) => {
    state = {...state}
    state.marks = state.marks.map(mark => 
      transformWithMap(mark, deflateInfateMarkMap)
    )
    state.marks.forEach(mark => 
      mark["type"] = transformWithMap(mark.type, deflateInflateTypeMap)
    )
    return state;
  }

  export {inflate, deflate}