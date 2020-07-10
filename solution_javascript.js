class EventSourcer {
  constructor() {
    this.value = 0;
    this.forawrd = [];
    this.backward = [];
    this.ur = 0;
  }

  add(num) {
    this.value += num;
    this.forward.push(`add ${num}`);
  }

  subtract(num) {
    if (this.value > 0) {
      this.value -= num;
      this.forward.push(`subtract ${num}`);
    }
  }
  undo() {
    let last_event = this.forward.pop();
    let tmp = last_event.split(" ");
    let num = parseInt(tmp[1]);

    if (this.ur === 0) { // undo addition/subtraction
      if ("add" in last_event) {
        this.value -= num;
        this.backward.push(last_event);
      } else if ("subract" in last_event) {
        this.value += num;
        this.backward.push(last_event);
      }
    } else { // undo the redo
      this.undo();
    }
    this.ur = 0; //set flag that undo is active
  }
  redo() {
    let last_event = this.backward.pop();
    let tmp = last_event.split(" ");
    let num = parseInt(tmp[1]);
    
    if (this.ur === 0) { // redo what is undone
      if ("add" in last_event) {
        this.value += num;
        this.forward.push(last_event);
      } else if ("subract" in last_event) {
        this.value -= num;
        this.forward.push(last_event);
      }
    }
    this.ur = 1; //set flag that redo is active
  }
  bulk_undo(num) {
    if (num < this.forward.length) { // ensure bulk undos is fewer than supported
      for (let index = 0; index < num; index++) {
        this.undo();
      }
    } else {
      for (let index = 0; index < this.forward.length; index++) {
        this.undo();
      }
    }
  }
  bulk_redo(num) {
    if (num < this.backward.length) { // ensure bulk uredos is fewer than supported
      for (let index = 0; index < num; index++) {
        this.redo();
      }
    } else {
      for (let index = 0; index < this.backward.length; index++) {
        this.redo();
      }
    }
  }
}

// ----- Do not modify anything below this line (needed for test suite) ------
module.exports = EventSourcer;
