```
function processTreeData(obj) {
   const keys = Object.keys(obj);
   const result = [];
    keys.forEach(key => {
    const val = obj[key];
    //current key 
     if (!Array.isArray(val)) {
       // console.log(Object.keys(val));
       const subkeys = Object.keys(val);
       // and sub key values are not array
       if (subkeys.length > 0 && !Array.isArray(val[subkeys[0]])) {
         result.push({
           label: key,
           children: processTreeData(val)
         });
       } else { // sub keys are array
         const subResult = [];
         subkeys.forEach(subkey => {
           subResult.push({
             id: getUniqueId(),
             title: subkey,
             data: val[subkey][0]
           });
         });
         result.push({
           label: key,
           data: subResult
         });
       }    
     } else {
       result.push({
         label: key
       });
     }
   });
   return result;
 } 
```