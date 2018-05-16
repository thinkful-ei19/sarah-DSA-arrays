'use strict';
// import memory from './memory';
const Memory = require('./memory');

const memory = new Memory();

class Array {
  constructor() {
    this.length = 0;
    this._capacity = 0;
    this.ptr = memory.allocate(this.length);
  }

  push(value) {
    if (this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }

    memory.set(this.ptr + this.length, value);
    this.length++;
  }

  _resize(size) {
    const oldPtr = this.ptr;
    this.ptr = memory.allocate(size);
    if (this.ptr === null) {
      throw new Error('Out of memory');
    }
    memory.copy(this.ptr, oldPtr, this.length);
    memory.free(oldPtr);
    this._capacity = size;
  }

  get(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('Index error');
    }
    return memory.get(this.ptr + index);
  }
  pop() {
    if (this.length == 0) {
      throw new Error('Index error');
    }
    const value = memory.get(this.ptr + this.length - 1);
    this.length--;
    return value;
  }
  insert(index, value) {
    if (index < 0 || index >= this.length) {
      throw new Error('Index error');
    }

    if (this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }

    memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
    memory.set(this.ptr + index, value);
    this.length++;
  }

  remove(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('Index error');
    }
    memory.copy(this.ptr + index, this.ptr + index + 1, this.length - index - 1);
    this.length--;
  }
}
Array.SIZE_RATIO = 3;

function main(){

  Array.SIZE_RATIO = 3;

  //create an instance of the array class
  let arr = new Array();

  //add an item to the array
  arr.push(3); //Array { length: 1, _capacity: 3, ptr: 0 }
  arr.push(5); //Array { length: 2, _capacity: 3, ptr: 0 }
  arr.push(15); //Array { length: 3, _capacity: 3, ptr: 0 }
  arr.push(19); //Array { length: 4, _capacity: 12, ptr: 3 }
  arr.push(45); //Array { length: 5, _capacity: 12, ptr: 3 }
  arr.push(10); //Array { length: 6, _capacity: 12, ptr: 3 }
  arr.pop(); //Array { length: 5, _capacity: 12, ptr: 3 }
  arr.pop(); //Array { length: 4, _capacity: 12, ptr: 3 }
  arr.pop(); //Array { length: 3, _capacity: 12, ptr: 3 }
  //after code we added 6 elements to the array, once we reached the capacity (where array length exceeds capacity) we resize (arr.length +1) then multiplied the capcity by 3 to get a capacity of 12. Then we popped (decreased arr.length) by 3 indices.
  // console.log(arr);
  console.log(arr.get(0)); //3
  arr.pop();
  arr.pop();
  arr.pop();
  console.log(arr); //Array { length: 0, _capacity: 12, ptr: 3 }
  arr.push("tauhida"); 
  console.log(arr.get(0)); //NaN - we input a string. The pointer is comparing to a number value in the get funcion and so output would necessarily not be a numer when compared to a string...?
  console.log(arr); //Array { length: 1, _capacity: 12, ptr: 3 }
  arr.push([2, 55]); //NaN
  console.log(arr.get(1));
  console.log(arr);
}

main();

//The purpose of _resize is to increase the memory capacity onece the array reaches a certain length. This helps diminish the time spent copying and searching for new contiguous memory blocks when pushing.
