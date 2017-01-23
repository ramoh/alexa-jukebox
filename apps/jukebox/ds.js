function DoublyLinkedList() {
  this.head = null;
  this._length = 0;
  this.tail = null;
}

function Node(value) {
  this.data = value;
  this.previous = null;
  this.next = null;
}

DoublyLinkedList.prototype.add = function(val) {

  var node = new Node(val);

  if (this._length) {
    this.tail.next = node;
    node.previous = this.tail;
    this.tail = node;
  } else {
    this.head = node;
    this.tail = node;
  }
  this._length++;
  return node;
};

DoublyLinkedList.prototype.searchNodeAt = function(position) {

  var currentNode = this.head;
  var lenght = this._length;
  var count = 1;
  var message = {
    failure: "Failure : non existent node in this list"
  };

  //invalid position
  if (lenght === 0 || position < 1 || position > lenght) {
    throw new Error(message.failure);
  }

  //valid position
  while (count < position) {
    currentNode = currentNode.next;
    count++;
  }

  return currentNode;
};

DoublyLinkedList.prototype.remove = function(position) {
  var currentNode = this.head;
  var length = this._length;
  var count = 1;
  var message = {
    failure: "Failure : non exsitent postion",
    success: "Node has been deleted"
  };


  //invalid position
  if (lenght === 0 || position < 1 || position > lenght) {
    throw new Error(message.failure);
  }
  //first node to be removed
  if (position === 1) {
    this.head = currentNode.next;

    if (!this.head) {
      this.head.previous = null;
    } else {
      this.tail = null;
    }
  } else if (position === this._length) {
    //last node to be removed
    this.tail = this.tail.previous;
    this.tail.next = null;
  } else {
    //in the middle
    while (count < position) {
      currentNode = currentNode.next;
      count++;
    }

    var beforeNodeToDelete = currentNode.previous;
    var nodeToDelete = currentNode;
    var afterNodeToDelte = currentNode.next;

    beforeNodeToDelete.next = afterNodeToDelte;
    afterNodeToDelte.previous = beforeNodeToDelete;
  }
  this._length--;

  return message.success;
};

module.exports = {
  DoublyLinkedList: DoublyLinkedList
};
