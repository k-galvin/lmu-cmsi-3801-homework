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
fun firstThenLowerCase(a: List<String>, p: (String) -> Boolean): String? {
    for (item in a) {
        if (p(item)) {
            return item?.lowercase()
        }
    }
    return null
}

// Write your say function here
fun say(): Exercises {
    return Exercises("")
}

fun say(input: String?): Exercises {
    return Exercises(input ?: "")
}

class Exercises constructor(private val accumulatedString: String) {

    fun and(word: String?): Exercises {
        if (word == null) {
            return Exercises(accumulatedString)
        }
        
        val newAccumulatedString = "$accumulatedString $word"
        return Exercises(newAccumulatedString)
    }

    val phrase: String
        get() = accumulatedString
}

// Write your meaningfulLineCount function here
fun meaningfulLineCount(filename: String): Long {
    return try {
        BufferedReader(FileReader(filename)).use { reader ->
            reader.lines()
                .filter { line -> line.trim().isNotEmpty() && !line.trim().startsWith("#") }
                .count()
        }
    } catch (e: IOException) {
        throw IOException(e)
    }
}

// Write your Quaternion data class here
class Quaternion(val a: Double, val b: Double, val c: Double, val d: Double) {

    init {
        require(!a.isNaN() && !b.isNaN() && !c.isNaN() && !d.isNaN()) {
            "Coefficients cannot be NaN"
        }
    }

    companion object {
        val ZERO = Quaternion(0.0, 0.0, 0.0, 0.0)
        val I = Quaternion(0.0, 1.0, 0.0, 0.0)
        val J = Quaternion(0.0, 0.0, 1.0, 0.0)
        val K = Quaternion(0.0, 0.0, 0.0, 1.0)
    }

    fun coefficients(): List<Double> {
        return listOf(a, b, c, d)
    }

    operator fun plus(other: Quaternion): Quaternion {
        return Quaternion(a + other.a, b + other.b, c + other.c, d + other.d)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Quaternion) return false
        return a == other.a && b == other.b && c == other.c && d == other.d
    }

    override fun hashCode(): Int {
        return listOf(a, b, c, d).hashCode()
    }

    operator fun times(other: Quaternion): Quaternion {
        val q1 = a * other.a - b * other.b - c * other.c - d * other.d
        val q2 = a * other.b + b * other.a + c * other.d - d * other.c
        val q3 = a * other.c - b * other.d + c * other.a + d * other.b
        val q4 = a * other.d + b * other.c - c * other.b + d * other.a
        return Quaternion(q1, q2, q3, q4)
    }

    fun conjugate(): Quaternion {
        return Quaternion(a, -b, -c, -d)
    }

    override fun toString(): String {
        val parts = listOf(
            processCoefficient(a, ""),
            processCoefficient(b, "i"),
            processCoefficient(c, "j"),
            processCoefficient(d, "k")
        )
        val result = parts.joinToString("")
        return if (result.isNotEmpty() && result[0] == '+') {
            result.substring(1).ifEmpty { "0" }
        } else {
            result.ifEmpty { "0" }
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
    override fun toString(): String

    object Empty : BinarySearchTree {
        override fun size(): Int = 0

        override fun contains(value: String): Boolean = false

        override fun insert(value: String): BinarySearchTree = TreeNode(value, this, this)

        override fun toString(): String = "()"
    }

    data class TreeNode(
        private val value: String,
        private val left: BinarySearchTree,
        private val right: BinarySearchTree
    ) : BinarySearchTree {

        override fun size(): Int = 1 + left.size() + right.size()

        override fun contains(value: String): Boolean {
            val compare = this.value.compareTo(value)
            return when {
                compare == 0 -> true
                compare > 0 -> left.contains(value)
                else -> right.contains(value)
            }
        }

        override fun insert(value: String): BinarySearchTree {
            val cmp = this.value.compareTo(value)
            return when {
                cmp > 0 -> TreeNode(this.value, left.insert(value), right)
                cmp < 0 -> TreeNode(this.value, left, right.insert(value))
                else -> this // No duplicates allowed
            }
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