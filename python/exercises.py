from dataclasses import dataclass
from collections.abc import Callable


def change(amount: int) -> dict[int, int]:
    if not isinstance(amount, int):
        raise TypeError('Amount must be an integer')
    if amount < 0:
        raise ValueError('Amount cannot be negative')
    counts, remaining = {}, amount
    for denomination in (25, 10, 5, 1):
        counts[denomination], remaining = divmod(remaining, denomination)
    return counts


def first_then_lower_case(a: list[str], p: Callable[[str], bool], /) -> None | str:
    '''Returns the lowercased version of the first element of a that satisfies p'''
    for string in a:
        if p(string):
            return string.lower()
    return None


def powers_generator(*, base: int, limit: int):
    '''Generator that yields successive powers of the given base going up to the given limit'''
    exponent = 0
    power = 1
    while power <= limit:
        yield power
        exponent += 1
        power = base ** exponent


def say(first_input = None, /):
    '''Chainable function that outputs a combination of strings'''
    inputs = []
    
    def add_string(input = None):
        '''Inner function that adds inputs to the output string'''
        if input is not None:
            inputs.append(input)
            return add_string
        return ' '.join(inputs)          
    
    if first_input != None:
        return add_string(first_input)
        
    return ''


def meaningful_line_count(file, /) -> int:
    '''Function that returns the number of meaningful lines in the given file'''
    try:
        with open(file, 'r') as f:
            meaningful_lines = 0
            for line in f:
                stripped_line = line.strip()
                if stripped_line and not stripped_line.startswith('#'):
                    meaningful_lines += 1
            return meaningful_lines
    except FileNotFoundError:
        raise FileNotFoundError('No such file') 


@dataclass(frozen=True)
class Quaternion:
    a: float
    b: float
    c: float
    d: float

    @property
    def coefficients(self) -> tuple[float, float, float, float]:
        '''Returns a tuple of the Quaternion coefficients'''
        return (self.a, self.b, self.c, self.d)

    @property
    def conjugate(self) -> 'Quaternion':
        '''Returns the conjugate of the Quaternion'''
        return Quaternion(self.a, -self.b, -self.c, -self.d)

    def __add__(self, other: 'Quaternion') -> 'Quaternion':
        '''Adds two Quaternions'''
        return Quaternion(self.a + other.a, self.b + other.b, self.c + other.c, self.d + other.d)

    def __mul__(self, other: 'Quaternion') -> 'Quaternion':
        '''Calculates the product of two quaternions'''
        a1, b1, c1, d1 = self.a, self.b, self.c, self.d
        a2, b2, c2, d2 = other.a, other.b, other.c, other.d

        a = a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2
        b = a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2
        c = a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2
        d = a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2

        return Quaternion(a, b, c, d)

    def __eq__(self, other) -> bool:
        '''Determines whether a Quaternion is equivalent to another object'''
        if isinstance(other, Quaternion):
            return (self.a == other.a and self.b == other.b and 
            self.c == other.c and self.d == other.d)
        else:
            return False

    def __str__(self) -> str:
        '''Formats a Quaternion as a string'''
        def process_coefficient(coefficient: float, letter: str) -> str:
            '''Helper method to process Quaternion coefficients into strings'''
            if coefficient == 0:
                return ''
            elif coefficient == 1:
                return '+' + letter if letter else f'{coefficient}'
            elif coefficient == -1:
                return '-' + letter if letter else f'{coefficient}'
            elif coefficient > 0:
                return f'+{coefficient}{letter}'
            else:
                return f'{coefficient}{letter}'

        parts = [
            process_coefficient(self.a, ''),
            process_coefficient(self.b, 'i'),
            process_coefficient(self.c, 'j'),
            process_coefficient(self.d, 'k')
        ]

        result = ''.join(parts)
        if result.startswith('+'):
            result = result[1:]

        return result if result else '0'
