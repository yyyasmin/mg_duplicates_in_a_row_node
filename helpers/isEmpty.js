// CHECK IF OBJ OF ANY TYPE IS EMPTY
function isEmpty(obj) {

  if (typeof obj === 'undefined') {
    console.log("OBJ is undefined: ", obj);
    return true;
  }

  if (obj === null) {
    console.log("OBJ is null: ", obj);
    return true;
  }
  
  if (obj === []) {
    console.log("OBJ is Empty: ", obj);
    return true;
  }

  if (typeof obj==='string' && obj.trim()==='') {
    console.log("OBJ is Empty str: ", obj);
    return true;
  }

  if (Array.isArray(obj) && obj.length===0) {
    console.log("OBJ is an empty array: ", obj);
    return true;
  }

  if (typeof obj==='object' && Object.keys(obj).length===0) {
    console.log("OBJ is an empty object: ", obj);
    return true;
  }

  return false;
}

module.exports = isEmpty;
