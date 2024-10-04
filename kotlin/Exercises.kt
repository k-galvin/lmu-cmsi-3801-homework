import java.io.BufferedReader
import java.io.FileReader
import java.io.IOException

fun change(amount: Long): Map<Int, Long> {
    require(amount >= 0) { "Amount cannot be negative" }
    
    val counts = mutableMapOf<Int, Long>()
    var remaining = amount
    for (denomination in listOf(25, 10, 5, 1)) {
        counts[denomination] = remaining / denomination
        remaining %= denomination
    }
    return counts
}

// Write your first then lower case function here
fun firstThenLowerCase(strings: List<String>, predicate: (String) -> Boolean): String? {
    return strings.firstOrNull(predicate)?.lowercase()
}

// Write your say function here
fun say(phrase: String = ""): Say {
    return Say(phrase)
}

data class Say(val phrase: String) {
    fun and(nextPhrase: String): Say {
        return Say("$phrase $nextPhrase")
    }
}

// Write your meaningfulLineCount function here
@Throws(IOException::class)
fun meaningfulLineCount(filename: String): Long {
    BufferedReader(FileReader(filename)).use { reader ->
        return reader.lines()
            .filter { line -> line.trim().isNotEmpty() && !line.trim().startsWith("#") }
            .count()
    }
}

// Write your Quaternion data class here
data class Quaternion(val a: Double, val b: Double, val c: Double, val d: Double) {
    companion object {
        val ZERO = Quaternion(0.0, 0.0, 0.0, 0.0)
        val I = Quaternion(0.0, 1.0, 0.0, 0.0)
        val J = Quaternion(0.0, 0.0, 1.0, 0.0)
        val K = Quaternion(0.0, 0.0, 0.0, 1.0)
    }

    fun coefficients(): List<Double> = listOf(a, b, c, d)

    operator fun plus(other: Quaternion): Quaternion {
        return Quaternion(a + other.a, b + other.b, c + other.c, d + other.d)
    }

    operator fun times(other: Quaternion): Quaternion {
        val q1 = a * other.a - b * other.b - c * other.c - d * other.d
        val q2 = a * other.b + b * other.a + c * other.d - d * other.c
        val q3 = a * other.c - b * other.d + c * other.a + d * other.b
        val q4 = a * other.d + b * other.c - c * other.b + d * other.a
        return Quaternion(q1, q2, q3, q4)
    }

    fun conjugate(): Quaternion = Quaternion(a, -b, -c, -d)

    override fun toString(): String {
        val parts = listOf(
            processCoefficient(a, ""),
            processCoefficient(b, "i"),
            processCoefficient(c, "j"),
            processCoefficient(d, "k")
        )
        val result = parts.joinToString("")
        return when {
            result.isNotEmpty() && result[0] == '+' -> result.substring(1)
            result.isEmpty() -> "0"
            else -> result
        }
    }

    private fun processCoefficient(coefficient: Double, letter: String): String {
        return when {
            coefficient == 0.0 -> ""
            coefficient == 1.0 && letter.isNotEmpty() -> "+$letter"
            coefficient == -1.0 && letter.isNotEmpty() -> "-$letter"
            coefficient > 0 -> "+${coefficient}${letter}"
            else -> "${coefficient}${letter}"
        }
    }
}

// Write your Binary Search Tree interface and implementing classes here
sealed interface BinarySearchTree {
    fun size(): Int
    fun contains(value: String): Boolean
    fun insert(value: String): BinarySearchTree

    object Empty : BinarySearchTree {
        override fun size(): Int = 0
        override fun contains(value: String): Boolean = false
        override fun insert(value: String): BinarySearchTree = Node(value, Empty, Empty)
        override fun toString(): String = "()"
    }

    data class Node(
        private val value: String,
        private val left: BinarySearchTree,
        private val right: BinarySearchTree
    ) : BinarySearchTree {

        override fun size(): Int = 1 + left.size() + right.size()

        override fun contains(value: String): Boolean =  when {
            value < this.value -> left.contains(value)
            value > this.value -> right.contains(value)
            else -> true
        }

        override fun insert(value: String): BinarySearchTree = when {
            value < this.value -> Node(this.value, left.insert(value), right)
            value > this.value -> Node(this.value, left, right.insert(value))
            else -> this
        }

        override fun toString(): String {
            val result = StringBuilder()

            if (left !is Empty) {
                result.append(left.toString())
            }

            result.append(value)

            if (right !is Empty) {
                result.append(right.toString())
            }

            return "(${result})"
        }
    }
}