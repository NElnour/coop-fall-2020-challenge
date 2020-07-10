class EventSourcer {
  constructor() {
    this.value = 0;
    this.forward = [];
    this.backward = [];
    this.ur = 0;
  }
  add(num) {
    this.value += num;
    this.forward.push(`add ${num}`);
  }
  subtract(num) {
    this.value -= num;
    this.forward.push(`subtract ${num}`);
  }
  undo() {
    if (this.forward.length > 0) {
      let last_event = this.forward.pop();

      // parse out number if applicable
      let tmp = last_event.split(" ");
      let num = parseInt(tmp[1]);

      if (this.ur === 0) { // undo addition/subtraction
        if (last_event.includes("add")) {
          this.value -= num;
          this.backward.push(last_event);
        } else if (last_event.includes("subtract")) {
          this.value += num;
          this.backward.push(last_event);
        }
      } else { // undo the redo
        this.undo();
      }
      this.ur = 0; //set flag that undo is active
    }
  }
  redo() {
    if (this.backward.length > 0) {
      let last_event = this.backward.pop();

      // parse out number if applicable
      let tmp = last_event.split(" ");
      let num = parseInt(tmp[1]);

      if (this.ur === 0) { // redo what is undone
        if (last_event.includes("add")) {
          this.value += num;
          this.forward.push(last_event);
        } else if (last_event.includes("subtract")) {
          this.value -= num;
          this.forward.push(last_event);
        }
      }
      this.ur = 1; //set flag that redo is active
    }
  }
  bulk_undo(num) {
    for (let index = 0; index < num; index++) {
      this.undo();
    }
  }
  bulk_redo(num) {
    if (num < this.backward.length) { // ensure bulk redos is fewer than supported
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
