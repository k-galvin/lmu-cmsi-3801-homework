import Foundation

struct NegativeAmountError: Error {}
struct NoSuchFileError: Error {}

func change(_ amount: Int) -> Result<[Int:Int], NegativeAmountError> {
    if amount < 0 {
        return .failure(NegativeAmountError())
    }
    var (counts, remaining) = ([Int:Int](), amount)
    for denomination in [25, 10, 5, 1] {
        (counts[denomination], remaining) = 
            remaining.quotientAndRemainder(dividingBy: denomination)
    }
    return .success(counts)
}

// Write your first then lower case function here
func firstThenLowerCase(of strings: [String], satisfying predicate: (String) -> Bool) -> String? {
    return strings.first(where: predicate)?.lowercased()
}

// Write your say function here
struct Sayer {
    let phrase: String
    func and(_ word: String) -> Sayer {
        return Sayer(phrase: phrase + " " + word)
    }
}

func say(_ word: String = "") -> Sayer {
    return Sayer(phrase: word)
}

// Write your meaningfulLineCount function here
func meaningfulLineCount(_ filename: String) async -> Result<Int, NoSuchFileError> {
    var lineCount = 0
    do { 
        let contents = try String(contentsOfFile: filename)
        for line in contents.split(separator: "\n") {
            let trimmedLine = line.trimmingCharacters(in: .whitespacesAndNewlines)
            if !trimmedLine.isEmpty && !trimmedLine.hasPrefix("#") {
                lineCount += 1
            }
        }    
        return .success(lineCount)
    } catch {
        return .failure(NoSuchFileError())
    }
}

// Write your Quaternion struct here
struct Quaternion: CustomStringConvertible, Equatable {
    let a, b, c, d: Double

    static let ZERO = Quaternion(a: 0, b: 0, c: 0, d: 0)
    static let I = Quaternion(a: 0, b: 1, c: 0, d: 0)
    static let J = Quaternion(a: 0, b: 0, c: 1, d: 0)
    static let K = Quaternion(a: 0, b: 0, c: 0, d: 1)

    init(a: Double = 0, b: Double = 0, c: Double = 0, d: Double = 0) {
        self.a = a
        self.b = b
        self.c = c
        self.d = d
    }

    var coefficients: [Double] {
        return [a, b, c, d]
    }

    static func +(lhs: Quaternion, rhs: Quaternion) -> Quaternion {
        return Quaternion(a: lhs.a + rhs.a, b: lhs.b + rhs.b, c: lhs.c + rhs.c, d: lhs.d + rhs.d)
    }

    static func *(lhs: Quaternion, rhs: Quaternion) -> Quaternion {
        return Quaternion(
            a: lhs.a * rhs.a - lhs.b * rhs.b - lhs.c * rhs.c - lhs.d * rhs.d,
            b: lhs.a * rhs.b + lhs.b * rhs.a + lhs.c * rhs.d - lhs.d * rhs.c,
            c: lhs.a * rhs.c - lhs.b * rhs.d + lhs.c * rhs.a + lhs.d * rhs.b,
            d: lhs.a * rhs.d + lhs.b * rhs.c - lhs.c * rhs.b + lhs.d * rhs.a
        )
    }

    static func ==(lhs: Quaternion, rhs: Quaternion) -> Bool {
        return lhs.a == rhs.a && lhs.b == rhs.b && lhs.c == rhs.c && lhs.d == rhs.d
    }

    var conjugate: Quaternion {
        return Quaternion(a: a, b: -b, c: -c, d: -d)
    }

    var description: String {
        let parts = [
            processCoefficient(a, ""),
            processCoefficient(b, "i"),
            processCoefficient(c, "j"),
            processCoefficient(d, "k")
        ]
        let result = parts.joined()

        if !result.isEmpty && result.first == "+" {
            return String(result.dropFirst()).isEmpty ? "0" : String(result.dropFirst())
        } else {
            return result.isEmpty ? "0" : result
        }
    }

    private func processCoefficient(_ coefficient: Double, _ letter: String) -> String {
        switch coefficient {
        case 0.0:
            return ""
        case 1.0 where !letter.isEmpty:
            return "+\(letter)"
        case -1.0 where !letter.isEmpty:
            return "-\(letter)"
        case let value where value > 0:
            return "+\(value)\(letter)"
        default:
            return "\(coefficient)\(letter)"
        }
    }
}

// Write your Binary Search Tree enum here
enum BinarySearchTree: CustomStringConvertible {
    case empty
    indirect case node(BinarySearchTree, String, BinarySearchTree)

    var size: Int {
        switch self {
        case .empty:
            return 0
        case let .node(left, _, right):
            return left.size + 1 + right.size
        }
    }

    func contains(_ value: String) -> Bool {
        switch self {
        case .empty:
            return false
        case let .node(left, nodeValue, right):
            if value < nodeValue {
                return left.contains(value)
            } else if value > nodeValue {
                return right.contains(value)
            } else {
                return true
            }
        }
    }

    func insert(_ value: String) -> BinarySearchTree {
        switch self {
        case .empty:
            return .node(.empty, value, .empty)
        case let .node(left, nodeValue, right):
            if value < nodeValue {
                return .node(left.insert(value), nodeValue, right)
            } else if value > nodeValue {
                return .node(left, nodeValue, right.insert(value))
            } else {
                return self
            }
        }
    }

    var description: String {
        switch self {
        case .empty:
            return "()"
        case .node(let left, let nodeValue, let right):
            var result = ""
            if case .node = left {
                result += left.description
            }
            result += nodeValue
            if case .node = right {
                result += right.description
            }
            return "(\(result))"
        }
    }
}