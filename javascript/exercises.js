import { open } from "node:fs/promises"

export function change(amount) {
  if (!Number.isInteger(amount)) {
    throw new TypeError("Amount must be an integer")
  }
  if (amount < 0) {
    throw new RangeError("Amount cannot be negative")
  }
  let [counts, remaining] = [{}, amount]
  for (const denomination of [25, 10, 5, 1]) {
    counts[denomination] = Math.floor(remaining / denomination)
    remaining %= denomination
  }
  return counts
}

/**
 * Returns the lower case of the first string in a that satisfies predicate p.
 */
export function firstThenLowerCase(a, p) {
  for (const item of a) {
    if (p(item)) {
      return item?.toLowerCase()
    }
  }
  return undefined
}

/**
 * Generator that yields successive powers of a given base up to a given limit.
 */
export function* powersGenerator({ ofBase, upTo }) {
  let power = 1
  while (power <= upTo) {
    yield power
    power *= ofBase
  }
}

/**
 * Returns string of inputs seperated by spaces.
 */
export function say(param) {
  const inner = (nextParam) => {
    if (nextParam === undefined) {
      return param
    }
    return say(`${param} ${nextParam}`)
  }

  if (param === undefined) {
    return ""
  }

  return inner
}

/**
 * Returns the number of meaningful lines in a given file.
 */
export async function meaningfulLineCount(filePath) {
  let file
  try {
    let count = 0
    const file = await open(filePath, "r")
    for await (const line of file.readLines()) {
      const trimmedLine = line.trim()
      if (trimmedLine !== "" && !trimmedLine.startsWith("#")) {
        count++
      }
    }

    return count
  } catch (error) {
    console.error("Error reading file:", error)
    throw error
  } finally {
    if (file) {
      try {
        await file.close()
      } catch (closeError) {
        console.error("Error closing file:", closeError)
      }
    }
  }
}

/**
 * Class representing a Quaternion.
 */
export class Quaternion {
  constructor(a, b, c, d) {
    Object.assign(this, { a, b, c, d })
    Object.freeze(this)
  }

  /**
   * Returns the quaternion's conjugate.
   */
  get conjugate() {
    return new Quaternion(this.a, -this.b, -this.c, -this.d)
  }

  /**
   * Returns the quaternion's coefficients.
   */
  get coefficients() {
    return [this.a, this.b, this.c, this.d]
  }

  /**
   * Adds two quaternions.
   */
  plus(other) {
    return new Quaternion(
      this.a + other.a,
      this.b + other.b,
      this.c + other.c,
      this.d + other.d
    )
  }

  /**
   * Multiplies two quaternions.
   */
  times(other) {
    return new Quaternion(
      this.a * other.a - this.b * other.b - this.c * other.c - this.d * other.d,
      this.a * other.b + this.b * other.a + this.c * other.d - this.d * other.c,
      this.a * other.c - this.b * other.d + this.c * other.a + this.d * other.b,
      this.a * other.d + this.b * other.c - this.c * other.b + this.d * other.a
    )
  }

  /**
   * Checks if this quaternion is equal to another quaternion or an array.
   */
  deepEqual(other) {
    if (other instanceof Quaternion) {
      return (
        this.a === other.a &&
        this.b === other.b &&
        this.c === other.c &&
        this.d === other.d
      )
    }

    if (Array.isArray(other)) {
      return [this.a, this.b, this.c, this.d].every(
        (value, index) => value === other[index]
      )
    }

    return false
  }

  /**
   * Returns a string representation of the quaternion.
   */
  toString() {
    const processCoefficient = (coefficient, letter) => {
      if (coefficient === 0) return ""
      if (coefficient === 1) return letter ? `+${letter}` : "1"
      if (coefficient === -1) return letter ? `-${letter}` : "-1"
      return coefficient > 0
        ? `+${coefficient}${letter}`
        : `${coefficient}${letter}`
    }

    const parts = [
      processCoefficient(this.a, ""),
      processCoefficient(this.b, "i"),
      processCoefficient(this.c, "j"),
      processCoefficient(this.d, "k"),
    ]

    let result = parts.join("")
    if (result.startsWith("+")) result = result.slice(1)

    return result || "0"
  }
}
