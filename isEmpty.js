import React from 'react';

// CHECK IF OBJ OF ANY TYPE IS EMPTY 
function isEmpty(obj) {
  if (typeof obj === 'undefined' || obj === null) {
    return true;
  }

  if (typeof obj === 'string' && obj.trim() === '') {
    return true;
  }

  if (Array.isArray(obj) && obj.length === 0) {
    return true;
  }

  if (typeof obj === 'object' && Object.keys(obj).length === 0) {
    return true;
  }

  return false;
}


export default isEmpty