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
  for (let i = 0; i < a.length; i++) {
    if (p(a[i])) {
      return a[i]?.toLowerCase()
    }
  }
  return undefined
}

/**
 * Generator that yields successive powers of a given base up to a given limit.
 */
export function* powersGenerator({ ofBase, upTo }) {
  let exponent = 0
  let power = 1
  while (power <= upTo) {
    yield power
    exponent += 1
    power = ofBase ** exponent
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
 * Returns the number of meaningful lines in a given file
 */
export async function meaningfulLineCount(filePath) {
  try {
    const fileHandle = await open(filePath, "r")
    const fileContent = await fileHandle.readFile({ encoding: "utf-8" })
    await fileHandle.close()

    const lines = fileContent.split("\n")

    const filteredLines = lines.filter((line) => {
      const trimmedLine = line.trim()
      return trimmedLine !== "" && !trimmedLine.startsWith("#")
    })

    return filteredLines.length
  } catch (error) {
    console.error("Error reading file;", error)
    throw error
  }
}

/**
 * Class that build a Quaternion.
 */
export class Quaternion {
  constructor(a, b, c, d) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d

    Object.freeze(this)
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
   * Gets the quaternion's conjugate.
   */
  get conjugate() {
    return new Quaternion(this.a, -this.b, -this.c, -this.d)
  }

  /**
   * Gets the quaternion's coefficients.
   */
  get coefficients() {
    return [this.a, this.b, this.c, this.d]
  }

  /**
   * Determines equivalence of two quaternions.
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
    if (other.isArray()) {
      arr = [this.a, this.b, this.c, this.d]
      return arr.every((value, index) => value === other[index])
    }
    return false
  }

  /**
   * Displays the quaternion as a string.
   */
  toString() {
    /**
     * Inner function to process a given coefficient for the string.
     */
    function processCoefficient(coefficient, letter) {
      if (coefficient === 0) {
        return ""
      } else if (coefficient === 1) {
        return letter ? `+${letter}` : `${coefficient}`
      } else if (coefficient === -1) {
        return letter ? `-${letter}` : `${coefficient}`
      } else if (coefficient > 0) {
        return `+${coefficient}${letter}`
      } else {
        return `${coefficient}${letter}`
      }
    }

    const parts = [
      processCoefficient(this.a, ""),
      processCoefficient(this.b, "i"),
      processCoefficient(this.c, "j"),
      processCoefficient(this.d, "k"),
    ]

    let result = parts.join("")
    if (result.startsWith("+")) {
      result = result.slice(1)
    }

    return result ? result : "0"
  }
}
