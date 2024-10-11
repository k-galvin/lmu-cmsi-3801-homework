import { PathLike } from "node:fs"
import { open } from "node:fs/promises"

export function change(amount: bigint): Map<bigint, bigint> {
  if (amount < 0) {
    throw new RangeError("Amount cannot be negative")
  }
  let counts: Map<bigint, bigint> = new Map()
  let remaining = amount
  for (const denomination of [25n, 10n, 5n, 1n]) {
    counts.set(denomination, remaining / denomination)
    remaining %= denomination
  }
  return counts
}

// Applies a function to the first element in array that satifies predicate
export function firstThenApply<T>(
  array: T[],
  predicate: (item: T) => boolean,
  funct: (item: T) => T
): T | undefined {
  const item = array.find(predicate)
  return item ? funct(item) : undefined
}

// Infinite sequence of powers of base b
export function* powersGenerator(base: bigint): Generator<bigint> {
  let power: bigint = 1n
  while (true) {
    yield power
    power *= base
  }
}

// Number of meaningful lines in a given file
export async function meaningfulLineCount(filePath: PathLike): Promise<number> {
  let count: number = 0
  const file = await open(filePath, "r")
  for await (const line of file.readLines()) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith("#")) {
      count++
    }
  }
  return count
}

// Three dimensional shape data types
type Box = {
  kind: "Box"
  width: number
  depth: number
  length: number
}

type Sphere = {
  kind: "Sphere"
  radius: number
}

export type Shape = Box | Sphere

export function volume(shape: Shape): number {
  switch (shape.kind) {
    case "Box": {
      return shape.length * shape.width * shape.depth
    }
    case "Sphere": {
      return (4 / 3) * Math.PI * shape.radius ** 3
    }
  }
}

export function surfaceArea(shape: Shape): number {
  switch (shape.kind) {
    case "Box": {
      return (
        2 * shape.length * shape.depth +
        2 * shape.length * shape.width +
        2 * shape.width * shape.depth
      )
    }
    case "Sphere": {
      return 4 * Math.PI * shape.radius ** 2
    }
  }
}

// Binary search tree implementation
export abstract class BinarySearchTree<T> {
  abstract insert(value: T): BinarySearchTree<T>
  abstract contains(value: T): boolean
  abstract size(): number
  abstract inorder(): Generator<T>
  abstract toString(): string
}

export class Empty<T> extends BinarySearchTree<T> {
  insert(value: T): BinarySearchTree<T> {
    return new Node(value, new Empty<T>(), new Empty<T>())
  }

  contains(value: T): boolean {
    return false
  }

  size(): number {
    return 0
  }

  *inorder(): Generator<T> {}

  toString(): string {
    return "()"
  }
}

class Node<T> extends BinarySearchTree<T> {
  constructor(
    private value: T,
    private left: BinarySearchTree<T> = new Empty<T>(),
    private right: BinarySearchTree<T> = new Empty<T>()
  ) {
    super()
  }

  insert(value: T): BinarySearchTree<T> {
    if (value < this.value) {
      return new Node(this.value, this.left.insert(value), this.right)
    } else if (value > this.value) {
      return new Node(this.value, this.left, this.right.insert(value))
    } else {
      return this
    }
  }

  contains(value: T): boolean {
    if (value < this.value) {
      return this.left.contains(value)
    } else if (value > this.value) {
      return this.right.contains(value)
    } else {
      return true
    }
  }

  size(): number {
    return 1 + this.left.size() + this.right.size()
  }

  *inorder(): Generator<T> {
    yield* this.left.inorder()
    yield this.value
    yield* this.right.inorder()
  }

  toString(): string {
    const leftStr = this.left.toString() === "()" ? "" : this.left.toString()
    const rightStr = this.right.toString() === "()" ? "" : this.right.toString()
    return `(${leftStr}${this.value}${rightStr})`
  }
}
