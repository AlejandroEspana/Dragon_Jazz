// utils/DoublyLinkedList.ts
export class SongNode {
  name: string;
  file: File;
  url: string;
  id: string;
  next: SongNode | null = null;
  prev: SongNode | null = null;

  constructor(file: File) {
    this.file = file;
    this.name = file.name.replace(/\.(mp3|mpeg)$/i, '');
    this.url = URL.createObjectURL(file);
    this.id = `${this.name}-${Math.random().toString(36).substr(2, 9)}`;
  }

  cleanup() {
    URL.revokeObjectURL(this.url);
  }
}

export class DoublyLinkedList {
  head: SongNode | null = null;
  tail: SongNode | null = null;
  size: number = 0;

  addSong(file: File): SongNode {
    const newNode = new SongNode(file);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      if (this.tail) this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this.size++;
    return newNode;
  }

  removeSong(node: SongNode): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    node.cleanup();
    this.size--;
  }

  moveToPosition(startIndex: number, targetIndex: number): void {
    if (startIndex === targetIndex || startIndex < 0 || startIndex >= this.size || targetIndex < 0 || targetIndex >= this.size) {
      return;
    }
  
    // 1. Find and remove the node from its current position
    let nodeToMove = this.head;
    let currentIndex = 0;
    while(nodeToMove && currentIndex < startIndex) {
        nodeToMove = nodeToMove.next;
        currentIndex++;
    }

    if (!nodeToMove) return;

    if (nodeToMove.prev) {
      nodeToMove.prev.next = nodeToMove.next;
    } else {
      this.head = nodeToMove.next;
    }
    if (nodeToMove.next) {
      nodeToMove.next.prev = nodeToMove.prev;
    } else {
      this.tail = nodeToMove.prev;
    }
    
    // 2. Find the target node at the target index
    let targetNode = this.head;
    currentIndex = 0;
    while(targetNode && currentIndex < targetIndex) {
        targetNode = targetNode.next;
        currentIndex++;
    }

    // 3. Insert the node before the target node
    if (!targetNode) { // Insert at the end
        if (this.tail) {
            this.tail.next = nodeToMove;
        }
        nodeToMove.prev = this.tail;
        nodeToMove.next = null;
        this.tail = nodeToMove;
        if (!this.head) {
            this.head = nodeToMove;
        }
    } else {
        nodeToMove.next = targetNode;
        nodeToMove.prev = targetNode.prev;

        if (targetNode.prev) {
            targetNode.prev.next = nodeToMove;
        } else {
            this.head = nodeToMove;
        }
        targetNode.prev = nodeToMove;
    }
  }

  toArray(): SongNode[] {
    const result: SongNode[] = [];
    let current = this.head;
    while (current) {
      result.push(current);
      current = current.next;
    }
    return result;
  }
  
  find(id: string): SongNode | null {
    let current = this.head;
    while (current) {
      if (current.id === id) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  shuffle(): void {
    const nodes = this.toArray();
    for (let i = nodes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    }

    this.head = null;
    this.tail = null;
    this.size = 0;

    for (const node of nodes) {
        const newNode = new SongNode(node.file);
        if (!this.head) {
          this.head = newNode;
          this.tail = newNode;
        } else {
          newNode.prev = this.tail;
          if (this.tail) this.tail.next = newNode;
          this.tail = newNode;
        }
        this.size++;
    }
  }


  clear(): void {
    let current = this.head;
    while (current) {
      const next = current.next;
      current.cleanup();
      current = next;
    }
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}
