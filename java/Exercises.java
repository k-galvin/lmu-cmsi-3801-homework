import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.function.Predicate;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Exercises {
    static Map<Integer, Long> change(long amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        var counts = new HashMap<Integer, Long>();
        for (var denomination : List.of(25, 10, 5, 1)) {
            counts.put(denomination, amount / denomination);
            amount %= denomination;
        }
        return counts;
    }

    // Write your first then lower case function here
    public static Optional<String> firstThenLowerCase(List<String> strings, Predicate<String> predicate) {
        return strings.stream()
                    .filter(predicate)
                    .findFirst()
                    .map(String::toLowerCase);
    }

    // Write your say function here
    static record Sayer(String phrase) {
        Sayer and(String word) {
            return new Sayer(phrase + " " + word);
        }
    }
    
    public static Sayer say() {
        return new Sayer("");
    }

    public static Sayer say(String word) {
        return new Sayer(word);
    }
 
    // Write your line count function here
    public static long meaningfulLineCount(String filename) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            return reader.lines()
                    .filter(line -> !line.isBlank() && !line.trim().startsWith("#"))
                    .count();
        } catch (java.io.FileNotFoundException e) {
            throw new java.io.FileNotFoundException("No such file: " + filename);
        } catch (IOException e) {
            throw new IOException(e);
        }
    }
}

// Write your Quaternion record class here
record Quaternion(double a, double b, double c, double d) {
    public static final Quaternion ZERO = new Quaternion(0.0, 0.0, 0.0, 0.0);
    public static final Quaternion I = new Quaternion(0.0, 1.0, 0.0, 0.0);
    public static final Quaternion J = new Quaternion(0.0, 0.0, 1.0, 0.0);
    public static final Quaternion K = new Quaternion(0.0, 0.0, 0.0, 1.0);

    public Quaternion {
        if(Double.isNaN(a) || Double.isNaN(b) || Double.isNaN(c) || Double.isNaN(d)) {
            throw new IllegalArgumentException("Coefficients cannot be NaN");
        }
    }

    public List<Double> coefficients() {
        return List.of(a, b, c, d);
    }

    public Quaternion plus(Quaternion other) {
        return new Quaternion(this.a + other.a, this.b + other.b, this.c + other.c, this.d + other.d);
    }

    public Quaternion times(Quaternion other) {
        double q1 = this.a * other.a - this.b * other.b - this.c * other.c - this.d * other.d;
        double q2 = this.a * other.b + this.b * other.a + this.c * other.d - this.d * other.c;
        double q3 = this.a * other.c - this.b * other.d + this.c * other.a + this.d * other.b;
        double q4 = this.a * other.d + this.b * other.c - this.c * other.b + this.d * other.a;

        return new Quaternion(q1, q2, q3, q4);
    }

    public Quaternion conjugate() {
        return new Quaternion(a, -b, -c, -d);
    }

    @Override
    public String toString() {
        List<String> parts = List.of(
            processCoefficient(this.a, ""), 
            processCoefficient(this.b, "i"), 
            processCoefficient(this.c, "j"), 
            processCoefficient(this.d, "k"));
            
        String result = String.join("", parts);
        if (!result.isEmpty() && result.charAt(0) == '+') {
            result = result.substring(1);
        }
        if (result.equals("")) {
            return "0";
        }
        return result;
    }

    private String processCoefficient(double coefficient, String letter) {
        if (coefficient == 0) {
            return "";
        } else if (coefficient == 1) {
            if (letter != "") {
                return "+" + letter;
            }
            return "+" + Double.toString(coefficient);
        } else if (coefficient == -1) {
            if (letter != "") {
                return "-" + letter;
            }
            return Double.toString(coefficient);
        } else if (coefficient > 0) {
            return "+" + Double.toString(coefficient) + letter;
        } else {
            return Double.toString(coefficient) + letter;
        }
    }
}

// Write your BinarySearchTree sealed interface and its implementations here
sealed interface BinarySearchTree permits Empty, Node {
    int size();
    boolean contains(String value);
    BinarySearchTree insert(String value);
}

final record Empty() implements BinarySearchTree {
    @Override
    public int size() {
        return 0;
    }

    @Override
    public boolean contains(String value) {
        return false;
    }

    @Override
    public BinarySearchTree insert(String value) {
        return new Node(value, this, this); 
    }

    @Override
    public String toString() {
        return "()";
    }
}

final class Node implements BinarySearchTree {
    private final String value;
    private final BinarySearchTree left;
    private final BinarySearchTree right;

    Node(String value, BinarySearchTree left, BinarySearchTree right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }

    @Override
    public int size() {
        return 1 + left.size() + right.size();
    }

    @Override
    public boolean contains(String value) {
        return this.value.equals(value) || left.contains(value) || right.contains(value);
    }

    @Override
    public BinarySearchTree insert(String value) {
        if (value.compareTo(this.value) < 0) {
            return new Node(this.value, left.insert(value), right);
        } else {
            return new Node(this.value, left, right.insert(value));
        }
    }

    @Override
    public String toString() {
        return "(" + (left instanceof Empty ? "" : left) + value + (right instanceof Empty ? "" : right) + ")";
    }
}