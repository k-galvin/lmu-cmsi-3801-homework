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

export function firstThenApply<T, U>(
  items: T[],
  predicate: (item: T) => boolean,
  consumer: (item: T) => U
): U | undefined {
  const item = items.find(predicate)
  return item ? consumer(item) : undefined
}

export function* powersGenerator(base: bigint): Generator<bigint> {
  for (let power = 1n; ; power *= base) {
    yield power
  }
}

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

interface Box {
  kind: "Box"
  readonly width: number
  readonly depth: number
  readonly length: number
}

interface Sphere {
  kind: "Sphere"
  readonly radius: number
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
        2 *
        (shape.length * shape.depth +
          shape.length * shape.width +
          shape.width * shape.depth)
      )
    }
    case "Sphere": {
      return 4 * Math.PI * shape.radius ** 2
    }
  }
}

export interface BinarySearchTree<T> {
  insert(value: T): BinarySearchTree<T>
  contains(value: T): boolean
  size(): number
  inorder(): Generator<T>
  toString(): string
}

export class Empty<T> implements BinarySearchTree<T> {
  insert(value: T): BinarySearchTree<T> {
    return new Node(value, new Empty<T>(), new Empty<T>())
  }

  contains(value: T): boolean {
    return false
  }

  size(): number {
    return 0
  }

  *inorder(): Generator<T> {
    return
  }

  toString(): string {
    return "()"
  }
}

class Node<T> implements BinarySearchTree<T> {
  constructor(
    private value: T,
    private left: BinarySearchTree<T> = new Empty<T>(),
    private right: BinarySearchTree<T> = new Empty<T>()
  ) {}

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
