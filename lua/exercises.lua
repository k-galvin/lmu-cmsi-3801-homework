function change(amount)
  if math.type(amount) ~= "integer" then
    error("Amount must be an integer")
  end
  if amount < 0 then
    error("Amount cannot be negative")
  end
  local counts, remaining = {}, amount
  for _, denomination in ipairs({25, 10, 5, 1}) do
    counts[denomination] = remaining // denomination
    remaining = remaining % denomination
  end
  return counts
end

-- Write your first then lower case function here
function first_then_lower_case(a, p)
  for _, str in ipairs(a) do
    if p(str) then return str:lower() end
  end
  return nil
end

-- Write your powers generator here
function powers_generator(base, limit)
  local exponent = 0
  local current_power = 1

  return coroutine.create(function()
    while current_power <= limit do
      coroutine.yield(current_power)
      exponent = exponent + 1
      current_power = base^exponent
    end
  end)
end

-- Write your say function here
function say(word)
  local words = {}

  local function add_string(input)
    if input == nil then
      return table.concat(words, " ")
    else
      table.insert(words, input)
      return add_string
    end
  end

  if word ~= nil then
    table.insert(words, word)
    return add_string
  end

  return ""
end

-- Write your line count function here
function meaningful_line_count(filename)
  local file, err = io.open(filename, "r")
  if not file then
    error(err)
  end

  local count = 0

  for line in file:lines() do
    local trimmed_line = string.gsub(line, "%s+", "")

    if trimmed_line ~= "" and not trimmed_line:match("^#") then
      count = count + 1
    end
  end

  file:close()

  return count
end

-- Write your Quaternion table here
Quaternion = (function()
  local class = {}
  local meta = {}
  local prototype = {}

  class.new = function (a, b, c, d)
    return setmetatable({a = a, b = b, c = c, d = d}, meta)
  end

  prototype.conjugate = function(self)
    return class.new(self.a, -self.b, -self.c, -self.d)
  end

  prototype.coefficients = function(self)
    return {self.a, self.b, self.c, self.d}
  end

  meta.__add = function(self, other)
    return class.new(self.a + other.a, self.b + other.b, self.c + other.c, self.d + other.d)
  end

  meta.__mul = function(self, other)
    return class.new(
      self.a * other.a - self.b * other.b - self.c * other.c - self.d * other.d,
      self.a * other.b + self.b * other.a + self.c * other.d - self.d * other.c,
      self.a * other.c - self.b * other.d + self.c * other.a + self.d * other.b,
      self.a * other.d + self.b * other.c - self.c * other.b + self.d * other.a
    )
  end

  meta.__eq = function(self, other)
    return(self.a == other.a and self.b == other.b and self.c == other.c and self.d == other.d)
  end 

  meta.__tostring = function(self)
    local function process_coefficients(coefficient, letter)
      if coefficient == 0 then
          return ""
      elseif coefficient == 1 then
          if letter == "" then
            return tostring(coefficient)
          else
            return ("+" .. letter)  
          end
      elseif coefficient == -1 then
        if letter == "" then
          return tostring(coefficient)
        else
          return ("-" .. letter)  
        end
      elseif coefficient > 0 then
          return "+" .. coefficient .. letter
      else
          return coefficient .. letter
      end
    end

    local parts = {
      process_coefficients(self.a, ""), 
      process_coefficients(self.b, "i"), 
      process_coefficients(self.c, "j"), 
      process_coefficients(self.d, "k")
    }
  
    local result = table.concat(parts, "") 
    if string.sub(result, 1, 1) == "+" then
      result = string.sub(result, 2)
    end

    if result == "" then
      return "0"
    else 
      return result
    end
  end

  meta.__index = prototype

  return class
end)({}, {}, {})
