
// 128-character table with bitmask for token types
const charTable: number[] = new Array(128).fill(0);

// Token types
const TokenType = {
  NUMBER: 1 << 0,
  BIGINT: 1 << 1,
  STRING: 1 << 2,
  TEMPLATE: 1 << 3,
  IDENTIFIER: 1 << 4,
  PUNCTUATOR: 1 << 5,
  KEYWORD: 1 << 6,
  ESCAPED_KEYWORD: 1 << 7,
  REGEX: 1 << 8,
  JSX_TAG_START: 1 << 9,
  JSX_TAG_END: 1 << 10,
  JSX_TEXT: 1 << 11,
};

// Pre-compute token type masks for common characters
const tokenMasks: number[] = new Array(128).fill(0);

// Pre-computed character class lookup tables
const charClasses = {
  whitespace: new Array(128).fill(0),
  digits: new Array(128).fill(0),
  hexDigits: new Array(128).fill(0),
  octalDigits: new Array(128).fill(0),
  identifierChars: new Array(128).fill(0),
  jsxNameChars: new Array(128).fill(0),
  jsxAttributeNameChars: new Array(128).fill(0),
  jsxTagNameChars: new Array(128).fill(0),
};

// Initialize charTable, tokenMasks, and character class lookup tables
// Numbers (Decimal, Hex, Binary, Octal)
for (let i = 0x30; i <= 0x39; i++) {
  charTable[i] = TokenType.NUMBER;
  tokenMasks[i] = TokenType.NUMBER;
  charClasses.digits[i] = 1;
  charClasses.hexDigits[i] = 1;
  charClasses.octalDigits[i] = 1;
}
for (let i = 0x41; i <= 0x5A; i++) {
  charTable[i] = TokenType.IDENTIFIER | TokenType.NUMBER; // For hex numbers
  tokenMasks[i] = TokenType.IDENTIFIER | TokenType.NUMBER;
  charClasses.hexDigits[i] = 1;
  charClasses.identifierChars[i] = 1;
  charClasses.jsxNameChars[i] = 1;
  charClasses.jsxAttributeNameChars[i] = 1;
  charClasses.jsxTagNameChars[i] = 1;
}
for (let i = 0x61; i <= 0x7A; i++) {
  charTable[i] = TokenType.IDENTIFIER | TokenType.NUMBER; // For hex numbers
  tokenMasks[i] = TokenType.IDENTIFIER | TokenType.NUMBER;
  charClasses.hexDigits[i] = 1;
  charClasses.identifierChars[i] = 1;
  charClasses.jsxNameChars[i] = 1;
  charClasses.jsxAttributeNameChars[i] = 1;
  charClasses.jsxTagNameChars[i] = 1;
}
charTable[0x5F] = TokenType.IDENTIFIER;
tokenMasks[0x5F] = TokenType.IDENTIFIER;
charClasses.identifierChars[0x5F] = 1;
charClasses.jsxNameChars[0x5F] = 1;
charClasses.jsxAttributeNameChars[0x5F] = 1;
charClasses.jsxTagNameChars[0x5F] = 1;

// Strings
charTable[0x22] = TokenType.STRING;
tokenMasks[0x22] = TokenType.STRING;
charTable[0x27] = TokenType.STRING;
tokenMasks[0x27] = TokenType.STRING;

// Template Literals
charTable[0x60] = TokenType.TEMPLATE;
tokenMasks[0x60] = TokenType.TEMPLATE;

// Punctuators (using bitmask)
charTable[0x2B] = TokenType.PUNCTUATOR;
tokenMasks[0x2B] = TokenType.PUNCTUATOR;
charTable[0x2D] = TokenType.PUNCTUATOR;
tokenMasks[0x2D] = TokenType.PUNCTUATOR;
charTable[0x2A] = TokenType.PUNCTUATOR;
tokenMasks[0x2A] = TokenType.PUNCTUATOR;
charTable[0x2F] = TokenType.PUNCTUATOR;
tokenMasks[0x2F] = TokenType.PUNCTUATOR;
charTable[0x25] = TokenType.PUNCTUATOR;
tokenMasks[0x25] = TokenType.PUNCTUATOR;
charTable[0x3C] = TokenType.PUNCTUATOR;
tokenMasks[0x3C] = TokenType.PUNCTUATOR;
charTable[0x3E] = TokenType.PUNCTUATOR;
tokenMasks[0x3E] = TokenType.PUNCTUATOR;
charTable[0x3D] = TokenType.PUNCTUATOR;
tokenMasks[0x3D] = TokenType.PUNCTUATOR;
charTable[0x21] = TokenType.PUNCTUATOR;
tokenMasks[0x21] = TokenType.PUNCTUATOR;
charTable[0x3F] = TokenType.PUNCTUATOR;
tokenMasks[0x3F] = TokenType.PUNCTUATOR;
charTable[0x3A] = TokenType.PUNCTUATOR;
tokenMasks[0x3A] = TokenType.PUNCTUATOR;
charTable[0x3B] = TokenType.PUNCTUATOR;
tokenMasks[0x3B] = TokenType.PUNCTUATOR;
charTable[0x2C] = TokenType.PUNCTUATOR;
tokenMasks[0x2C] = TokenType.PUNCTUATOR;
charTable[0x2E] = TokenType.PUNCTUATOR;
tokenMasks[0x2E] = TokenType.PUNCTUATOR;
charTable[0x5B] = TokenType.PUNCTUATOR;
tokenMasks[0x5B] = TokenType.PUNCTUATOR;
charTable[0x5D] = TokenType.PUNCTUATOR;
tokenMasks[0x5D] = TokenType.PUNCTUATOR;
charTable[0x7B] = TokenType.PUNCTUATOR;
tokenMasks[0x7B] = TokenType.PUNCTUATOR;
charTable[0x7D] = TokenType.PUNCTUATOR;
tokenMasks[0x7D] = TokenType.PUNCTUATOR;
charTable[0x28] = TokenType.PUNCTUATOR;
tokenMasks[0x28] = TokenType.PUNCTUATOR;
charTable[0x29] = TokenType.PUNCTUATOR;
tokenMasks[0x29] = TokenType.PUNCTUATOR;
charTable[0x26] = TokenType.PUNCTUATOR;
tokenMasks[0x26] = TokenType.PUNCTUATOR;
charTable[0x7C] = TokenType.PUNCTUATOR;
tokenMasks[0x7C] = TokenType.PUNCTUATOR;
charTable[0x5E] = TokenType.PUNCTUATOR;
tokenMasks[0x5E] = TokenType.PUNCTUATOR;
charTable[0x7E] = TokenType.PUNCTUATOR;
tokenMasks[0x7E] = TokenType.PUNCTUATOR;

// Keywords
charTable[0x62] = TokenType.KEYWORD; // 'b' in 'break'
charTable[0x63] = TokenType.KEYWORD; // 'c' in 'case', 'const'
charTable[0x64] = TokenType.KEYWORD; // 'd' in 'default', 'do', 'delete'
charTable[0x65] = TokenType.KEYWORD; // 'e' in 'else', 'export'
charTable[0x66] = TokenType.KEYWORD; // 'f' in 'for', 'false', 'finally', 'function'
charTable[0x69] = TokenType.KEYWORD; // 'i' in 'if', 'import', 'in', 'instanceof'
charTable[0x6C] = TokenType.KEYWORD; // 'l' in 'let', 'let', 'loop'
charTable[0x6E] = TokenType.KEYWORD; // 'n' in 'new', 'null'
charTable[0x72] = TokenType.KEYWORD; // 'r' in 'return', 'readonly', 'require'
charTable[0x73] = TokenType.KEYWORD; // 's' in 'switch', 'static', 'super', 'super'
charTable[0x74] = TokenType.KEYWORD; // 't' in 'true', 'typeof', 'try', 'throw'
charTable[0x76] = TokenType.KEYWORD; // 'v' in 'var', 'void'
charTable[0x77] = TokenType.KEYWORD; // 'w' in 'while', 'with'
charTable[0x79] = TokenType.KEYWORD; // 'y' in 'yield'

// Pre-compute token type masks for keywords and their escaped forms
const keywords = [
  "break", "case", "const", "default", "do", "delete", "else", "export", "for",
  "false", "finally", "function", "if", "import", "in", "instanceof", "let",
  "new", "null", "return", "readonly", "require", "switch", "static", "super",
  "true", "typeof", "try", "throw", "var", "void", "while", "with", "yield"
];
const escapedKeywords = new Set<string>();
for (const keyword of keywords) {
  const firstCharCode = keyword.charCodeAt(0);
  tokenMasks[firstCharCode] |= TokenType.KEYWORD;
  escapedKeywords.add(`\\${keyword}`); // Add escaped keyword for lazy loading
}

// Initialize charTable with bitmask for number types
for (let i = 0x30; i <= 0x39; i++) {
  charTable[i] |= TokenType.NUMBER;
}
for (let i = 0x41; i <= 0x46; i++) {
  charTable[i] |= TokenType.NUMBER;
}
for (let i = 0x61; i <= 0x66; i++) {
  charTable[i] |= TokenType.NUMBER;
}
charTable[0x65] |= TokenType.NUMBER;
charTable[0x45] |= TokenType.NUMBER;
charTable[0x2E] |= TokenType.NUMBER;
charTable[0x2B] |= TokenType.NUMBER;
charTable[0x2D] |= TokenType.NUMBER;
charTable[0x6E] |= TokenType.BIGINT;
charTable[0x4E] |= TokenType.BIGINT;

// Regular expression state machine context mask (simplified)
const RegexState = {
  Start: 0,
  InCharacterClass: 1 << 0,
  Escaped: 1 << 1,
  ClassEscape: 1 << 2,
  CapturingGroup: 1 << 3,
  InQuantifier: 1 << 4,
  Unicode: 1 << 5,
  InFlags: 1 << 6,
  InvalidRegex: 1 << 7,
  Backreference: 1 << 8,
  InConditional: 1 << 9,
};

// Token location bitmasks
const Location = {
  LineBreak: 1 << 0,
  CommentBefore: 1 << 1,
  CommentAfter: 1 << 2,
  HtmlCommentBefore: 1 << 3,
  HtmlCommentAfter: 1 << 4,
};

// Diagnostic type
const DiagnosticType = {
  Error: 1,
  Warning: 2,
};

// Diagnostic object (packed in bits)
const DiagnosticMask = {
  Error: 1 << 0,
  Warning: 1 << 1,
};

// Packed diagnostic object
interface Diagnostic {
  type: number;
  message: string;
  line: number;
  column: number;
}

// Helper functions
// Removed isDigit, isHexDigit, isOctalDigit, isIdentifierChar

// Initialize whitespace character class lookup table
charClasses.whitespace[0x09] = 1; // Horizontal Tab
charClasses.whitespace[0x0A] = 1; // Line Feed or New Line
charClasses.whitespace[0x0B] = 1; // Vertical Tab
charClasses.whitespace[0x0C] = 1; // Form Feed
charClasses.whitespace[0x0D] = 1; // Carriage Return
charClasses.whitespace[0x20] = 1; // Space
charClasses.whitespace[0x85] = 1; // Next Line (NEL)
charClasses.whitespace[0xA0] = 1; // No-break space
for (let i = 0x1680; i <= 0x1687; i++) {
  charClasses.whitespace[i] = 1; // Ogham space mark
}
for (let i = 0x2000; i <= 0x200A; i++) {
  charClasses.whitespace[i] = 1; // Unicode spaces
}
for (let i = 0x2028; i <= 0x202F; i++) {
  charClasses.whitespace[i] = 1; // Unicode spaces
}
for (let i = 0x205F; i <= 0x206F; i++) {
  charClasses.whitespace[i] = 1; // Unicode spaces
}

// Function to check if a character is a valid JSX name character
function isJSXNameChar(charCode: number): boolean {
  return charClasses.jsxNameChars[charCode] === 1;
}

// Function to check if a character is a valid JSX attribute name character
function isJSXAttributeNameChar(charCode: number): boolean {
  return charClasses.jsxAttributeNameChars[charCode] === 1;
}

// Function to check if a character is a valid JSX tag name character
function isJSXTagNameChar(charCode: number): boolean {
  return charClasses.jsxTagNameChars[charCode] === 1;
}

// Unicode Character Property Bitmasks
const unicodePropertyBitmasks = {
  "L": { // Letters
    "Lu": 1 << 0, // Uppercase Letters
    "Ll": 1 << 1, // Lowercase Letters
    "Lt": 1 << 2, // Titlecase Letters
    "Lm": 1 << 3, // Modifier Letters
    "Lo": 1 << 4, // Other Letters
  },
  "N": { // Numbers
    "Nd": 1 << 5, // Decimal Numbers
    "Nl": 1 << 6, // Letter-like Numbers
    "No": 1 << 7, // Other Numbers
  },
  "P": { // Punctuation
    "Pc": 1 << 8, // Connector Punctuation
    "Pd": 1 << 9, // Dash Punctuation
    "Ps": 1 << 10, // Open Punctuation
    "Pe": 1 << 11, // Close Punctuation
    "Pi": 1 << 12, // Initial Punctuation
    "Pf": 1 << 13, // Final Punctuation
    "Po": 1 << 14, // Other Punctuation
  },
  "S": { // Symbols
    "Sm": 1 << 15, // Math Symbols
    "Sc": 1 << 16, // Currency Symbols
    "Sk": 1 << 17, // Modifier Symbols
    "So": 1 << 18, // Other Symbols
  },
  "Z": { // Separators
    "Zs": 1 << 19, // Space Separators
    "Zl": 1 << 20, // Line Separators
    "Zp": 1 << 21, // Paragraph Separators
  },
  "C": { // Other
    "Cc": 1 << 22, // Control
    "Cf": 1 << 23, // Format
    "Cn": 1 << 24, // Unassigned
    "Co": 1 << 25, // Private Use
    "Cs": 1 << 26, // Surrogate
  },
  "M": { // Marks
    "Mn": 1 << 27, // Nonspacing Mark
    "Mc": 1 << 28, // Spacing Mark
    "Me": 1 << 29, // Enclosing Mark
  },
  "G": { // Other
    "Gc": 1 << 30, // Other
  },
  "T": { // Other
    "Ti": 1 << 31, // Ideographic
  }
};

// Pre-computed Unicode property data (Packed into bits)
const unicodePropertyData: number[] = new Array(0x110000).fill(0); // Assuming Unicode range

// Function to populate the unicodePropertyData 
// This is still simplified and requires further expansion for all Unicode properties
function initializeUnicodePropertyTable(propertyData: any) { 
  for (const category of Object.keys(unicodePropertyBitmasks)) {
    const subcategories = unicodePropertyBitmasks[category];
    for (const subcategory in subcategories) {
      const bitmask = subcategories[subcategory];
      for (const charCode of propertyData[category][subcategory]) { 
        unicodePropertyData[charCode] = bitmask; 
      }
    }
  }
}

// Function to check if a character has a specific Unicode property
function hasUnicodeProperty(charCode: number, propertyName: string): boolean {
  const category = propertyName[0];
  const subcategory = propertyName.slice(1);
  const bitmask = unicodePropertyBitmasks[category][subcategory];
  return unicodePropertyData[charCode] === bitmask;
}

// ... (Previous code, including unicodePropertyBitmasks, unicodePropertyData, isValidUnicodeProperty)

// Function to scan and validate a regular expression (with Unicode properties)
function scanRegex(source: string, start: number, onDiagnostic: (diagnostic: Diagnostic) => void, line: number, column: number): { type: number, value: string, loc: number, start: number, end: number } | null {
  let i = start + 1; // Skip the initial '/'
  let regexState = RegexState.Start;
  let flags = "";
  let capturingGroupCount = 0; // Keep track of capturing group count
  let loc = 0;
  let inCharacterClass = false; // Track if we're in a character class
  let inAtomicGroup = false; // Track if we're in an atomic group
  let inUnicodeProperty = false; // Track if we're in a Unicode property
  let inConditional = false; // Track if we're in a conditional

  while (i < source.length) {
    const charCode = source.charCodeAt(i);

    if (regexState & RegexState.Escaped) {
      regexState &= ~RegexState.Escaped;
      i++; // Skip the escaped character
      if (regexState & RegexState.Unicode && charCode >= 0x30 && charCode <= 0x39) {
        // Handle Unicode escape sequences in Unicode mode
        let unicodeEscape = "\\u";
        let escapeLength = 4; // Default length for \uXXXX
        if (charCode === 0x7B) { // Check for \u{XXXXXX} escape sequence
          escapeLength = 7; // Max length for \u{XXXXXX}
          unicodeEscape = "\\u{";
          i++; // Skip the opening brace
        }
        while (i < source.length && (charCode >= 0x30 && charCode <= 0x39 || charCode === 0x7B || (charCode >= 0x41 && charCode <= 0x46)) && i - start < escapeLength) { // Up to 6 hex digits or '{'
          charCode = source.charCodeAt(i);
          unicodeEscape += String.fromCharCode(charCode);
          i++;
        }
        if (charCode === 0x7D) { // Check for closing brace in \u{XXXXXX}
          i++;
        } else if (i - start > 6) { // Check for too many digits in \uXXXX
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Invalid Unicode escape sequence in regular expression: ${unicodeEscape}`,
            line,
            column: i - start,
          });
          return null;
        }
      }
    } else if (charCode === 0x5C) { // Backslash - escape character
      regexState |= RegexState.Escaped;
      i++;
    } else if (regexState & RegexState.InCharacterClass) {
      if (charCode === 0x5D) { // Closing square bracket
        regexState &= ~RegexState.InCharacterClass;
        inCharacterClass = false;
        i++;
      } else if (charCode === 0x5C && !(regexState & RegexState.ClassEscape)) { // Backslash in character class
        regexState |= RegexState.ClassEscape;
        i++;
      } else if (charCode === 0x70 && source[i + 1] === 0x7B && inCharacterClass) { // Handle Unicode property in character class
        regexState |= RegexState.Unicode;
        inUnicodeProperty = true;
        i += 2; 
        let propertyName = "";
        let propertyValue = null;
        let hasEquals = false;
        while (i < source.length && source[i] !== 0x7D) {
          if (source[i] === '=') {
            if (hasEquals) {
              onDiagnostic({
                type: DiagnosticType.Error,
                message: `Invalid Unicode property syntax: ${source.substring(start, i)}`,
                line,
                column: i - start,
              });
              return null;
            }
            hasEquals = true;
            i++;
            propertyValue = "";
            while (i < source.length && source[i] !== 0x7D) {
              propertyValue += source[i];
              i++;
            }
          } else {
            propertyName += source[i];
            i++;
          }
        }
        if (source[i] === 0x7D) {
          i++;
          if (!isValidUnicodeProperty(propertyName, propertyValue)) {
            onDiagnostic({
              type: DiagnosticType.Error,
              message: `Invalid Unicode character property in character class: ${propertyName}${propertyValue ? '=' + propertyValue : ''}`,
              line,
              column: i - propertyName.length - 3, // Adjust for \p{
            });
            return null;
          }
          regexState &= ~RegexState.Unicode;
          inUnicodeProperty = false; 
        } else {
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Unmatched character property name in character class: ${source.substring(start, i)}`,
            line,
            column: i - start,
          });
          return null;
        }
      } else {
        i++;
      }
    } else if (charCode === 0x5B) { // Opening square bracket
      regexState |= RegexState.InCharacterClass;
      inCharacterClass = true;
      i++;
    } else if (charCode === 0x2F && !(regexState & RegexState.CapturingGroup) && !(regexState & RegexState.InQuantifier)) { // Forward slash - end of regex
      // Check for flags
      i++;
      const validFlags = new Set(['i', 'm', 's', 'u', 'y', 'g']); // Use a set for efficient flag checks
      while (i < source.length) {
        const flagCharCode = source.charCodeAt(i);
        const flag = String.fromCharCode(flagCharCode);
        if (validFlags.has(flag)) {
          if (flags.includes(flag)) {
            // Duplicate flag
            onDiagnostic({
              type: DiagnosticType.Error,
              message: `Duplicate flag '${flag}' in regular expression: ${source.substring(start, i)}`,
              line,
              column: i - start,
            });
            return null;
          }
          flags += flag;
          i++;
        } else {
          // Invalid flag character
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Invalid flag character '${flag}' in regular expression: ${source.substring(start, i)}`,
            line,
            column: i - start,
          });
          return null;
        }
      }
      return { type: TokenType.REGEX, value: source.substring(start, i), loc, start, end: i };
    } else if (charCode === 0x28 && !(regexState & RegexState.CapturingGroup) && !(regexState & RegexState.InQuantifier)) { // Opening parenthesis - start of a capturing group
      regexState |= RegexState.CapturingGroup;
      capturingGroupCount++; // Increment capturing group count
      i++;
    } else if (charCode === 0x29 && (regexState & RegexState.CapturingGroup) && !(regexState & RegexState.InQuantifier)) { // Closing parenthesis - end of a capturing group
      regexState &= ~RegexState.CapturingGroup;
      i++;
    } else if (charCode === 0x3F && !(regexState & RegexState.InQuantifier)) {
      // Optional quantifier (?), lookahead assertions (?=), or lookbehind assertions (?<=)
      if (source[i + 1] === '=') {
        // Lookahead assertion
        i += 2;
        if (source[i] === '!') {
          // Negative lookahead assertion
          i++;
        }
        while (i < source.length && source[i] !== 0x29) { // Continue until closing parenthesis
          i++;
        }
        if (source[i] === 0x29) {
          i++;
        } else {
          // Unmatched lookahead assertion
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Unmatched lookahead assertion in regular expression: ${source.substring(start, i)}`,
            line,
            column: i - start,
          });
          return null;
        }
      } else if (source[i + 1] === '<') {
        // Lookbehind assertion
        i += 2;
        if (source[i] === '!') {
          // Negative lookbehind assertion
          i++;
        }
        while (i < source.length && source[i] !== 0x29) { // Continue until closing parenthesis
          i++;
        }
        if (source[i] === 0x29) {
          i++;
        } else {
          // Unmatched lookbehind assertion
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Unmatched lookbehind assertion in regular expression: ${source.substring(start, i)}`,
            line,
            column: i - start,
          });
          return null;
        }
      } else if (source[i + 1] === '>' && !(regexState & RegexState.InQuantifier)) {
        // Atomic grouping (?>)
        i += 2; // Skip (?>
        inAtomicGroup = true;
        while (i < source.length && source[i] !== 0x29) { // Continue until closing parenthesis
          i++;
        }
        if (source[i] === 0x29) {
          i++;
          inAtomicGroup = false; 
        } else {
          // Unmatched atomic group
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Unmatched atomic group in regular expression: ${source.substring(start, i)}`,
            line,
            column: i - start,
          });
          return null;
        }
      } else if (source[i + 1] === '?') {
        // Conditional group (?(condition)yes|no)
        i += 2;
        inConditional = true;
        // ... Parse the condition 
        let condition = '';
        while (i < source.length && source[i] !== ')') {
          if (source[i] === '(') {
            // Handle nested conditional groups
            const conditionalToken = scanRegex(source, i, onDiagnostic, line, column); 
            if (conditionalToken) {
              i = conditionalToken.end; 
              condition += conditionalToken.value;
            } else {
              onDiagnostic({
                type: DiagnosticType.Error,
                message: `Invalid conditional expression: ${source.substring(start, i)}`,
                line,
                column: i - start,
              });
              return null;
            }
          } else {
            condition += source[i];
            i++;
          }
        }
        if (source[i] === ')') {
          i++;
        } else {
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Invalid conditional group: ${source.substring(start, i)}`,
            line,
            column: i - start,
          });
          return null;
        }

        // ... Parse the 'yes' branch
        let yesBranch = '';
        while (i < source.length && source[i] !== '|') {
          yesBranch += source[i];
          i++;
        }
        if (source[i] === '|') {
          i++;
        } else {
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Invalid conditional group: ${source.substring(start, i)}`,
            line,
            column: i - start,
          });
          return null;
        }

        // ... Parse the 'no' branch
        let noBranch = '';
        while (i < source.length && source[i] !== ')') {
          noBranch += source[i];
          i++;
        }
        if (source[i] === ')') {
          i++;
          inConditional = false; 
        } else {
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Invalid conditional group: ${source.substring(start, i)}`,
            line,
            column: i - start,
          });
          return null;
        }
      } else {
        // Optional quantifier (?)
        i++;
      }
    } else if (charCode === 0x2A || charCode === 0x2B || (charCode === 0x7B && !(regexState & RegexState.InQuantifier))) {
      // Quantifier - *, +, {n}, {n,m}
      regexState |= RegexState.InQuantifier;
      if (charCode === 0x2A || charCode === 0x2B) {
        // Single character quantifier
        i++;
        if (i < source.length && source[i] === 0x2B) {
          // Possessive quantifier (*+, +?)
          i++;
        } 
      } else {
        // Quantifier with curly braces
        i++;
        let min = 0;
        let max = Infinity;
        let hasComma = false;
        while (i < source.length && (charClasses.digits[source.charCodeAt(i)] === 1 || source[i] === 0x2C || source[i] === 0x7D)) {
          if (source[i] === 0x2C) { // Comma
            if (hasComma) {
              // Invalid quantifier format
              onDiagnostic({
                type: DiagnosticType.Error,
                message: `Invalid quantifier format in regular expression: ${source.substring(start, i)}`,
                line,
                column: i - start,
              });
              return null;
            }
            hasComma = true;
            i++;
          } else if (source[i] === 0x7D) { // Closing curly brace
            i++;
            break;
          } else {
            // Accumulate digits for min/max values
            min = min * 10 + parseInt(source[i], 10);
            if (hasComma) {
              max = max * 10 + parseInt(source[i], 10);
            }
            i++;
          }
        }
        if (source[i - 1] !== 0x7D) {
          // Invalid quantifier format
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Invalid quantifier format in regular expression: ${source.substring(start, i)}`,
            line,
            column: i - start,
          });
          return null;
        }
        if (i < source.length && source[i] === 0x3F) {
          // Possessive quantifier with curly braces
          i++;
        } 
      }
      regexState &= ~RegexState.InQuantifier;
    } else if (charCode === 0x3F && (regexState & RegexState.InQuantifier) && !(regexState & RegexState.Escaped)) { 
      // Possessive quantifier (??, {}?)
      i++;
    } else if (charCode === 0x5C && (charCode >= 0x31 && charCode <= 0x39) && !(regexState & RegexState.Escaped)) {
      // Handle backreferences
      regexState |= RegexState.Backreference;
      i++;
      if (i < source.length && charClasses.digits[source.charCodeAt(i)] === 1) {
        // Backreference can be two digits
        i++; 
      }
      const backreference = parseInt(source.substring(start + 1, i), 10);
      if (backreference > capturingGroupCount) {
        onDiagnostic({
          type: DiagnosticType.Error,
          message: `Invalid backreference: ${backreference} in regular expression: ${source.substring(start, i)}`,
          line,
          column: i - start,
        });
        return null;
      }
      regexState &= ~RegexState.Backreference;
    } else if (charCode === 0x5C && source[i + 1] === 0x70 && source[i + 2] === 0x7B) { // Check for \p{PropertyName} escape sequence
      i += 3; // Skip \p{
      let propertyName = "";
      let propertyValue = null;
      let hasEquals = false;
      while (i < source.length && source[i] !== 0x7D) { // Continue until closing brace
        if (source[i] === '=') {
          if (hasEquals) {
            onDiagnostic({
              type: DiagnosticType.Error,
              message: `Invalid Unicode property syntax: ${source.substring(start, i)}`,
              line,
              column: i - start,
            });
            return null;
          }
          hasEquals = true;
          i++;
          propertyValue = "";
          while (i < source.length && source[i] !== 0x7D) { // Capture property value
            propertyValue += source[i];
            i++;
          }
        } else {
          propertyName += source[i];
          i++;
        }
      }
      if (source[i] === 0x7D) {
        i++;
        if (!isValidUnicodeProperty(propertyName, propertyValue)) { 
          onDiagnostic({
            type: DiagnosticType.Error,
            message: `Invalid Unicode character property: ${propertyName}${propertyValue ? '=' + propertyValue : ''}`,
            line,
            column: i - propertyName.length - 3, // Adjust for \p{
          });
          return null;
        } 
        // ... (Your logic to handle the property)
      } else {
        // Unmatched character property name
        onDiagnostic({
          type: DiagnosticType.Error,
          message: `Unmatched character property name in regular expression: ${source.substring(start, i)}`,
          line,
          column: i - start,
        });
        return null;
      }
    } else {
      i++;
    }
  }
  // Handle incomplete regular expression literal
  if (i === source.length) {
    onDiagnostic({
      type: DiagnosticType.Error,
      message: "Unterminated regular expression",
      line,
      column: i - start,
    });
    return null;
  }
  return null; // It's not a regex 
}

// Function to check if the Unicode property name is valid
function isValidUnicodeProperty(propertyName: string, propertyValue: string | null): boolean {
  if (unicodeProperties[propertyName]) {
    return propertyValue === null || unicodeProperties[propertyName][propertyValue] !== undefined; 
  }
  return false;
}


// ... (Previous code, including TokenType, tokenMasks, charClasses, unicodePropertyBitmasks, unicodePropertyData, isValidUnicodeProperty, scanRegex, etc.)

// Main parser function
function lex(source: string, onDiagnostic: (diagnostic: Diagnostic) => void, annexB: boolean = false, scanJsx: boolean = false): Array<{ type: number; value: string; loc: number; start: number; end: number }> {
  const tokens: Array<{ type: number; value: string; loc: number; start: number; end: number }> = [];
  let result = tokens;
  let i = 0;
  let start = 0;
  let tokenType = 0;
  let regexState = RegexState.Start;
  let flags = "";
  let line = 1;
  let column = 0;
  let loc = 0;
  let jsxTagName: string | null = null;
  let jsxTagDepth = 0;
  let inRegex = false; // Track if we're in a regex
  let inTemplate = false;
  let templateDepth = 0;
  let isEscaped = false;

  // JSX Parsing State (only used if scanJsx is true)
  let jsxElementStack: string[] = []; 
  let inJSXAttribute = false; 
  let currentJSXAttributeName: string | null = null;
  let inJSXAttributeValue = false; // Flag for attribute values
  let attributeValueQuoteChar: string | null = null; // Quote character (', ")
  let inJSXExpression = false; // Flag for JSX expressions within curly braces
  let expressionStart: number | null = null; // Start position of the expression

  while (i < source.length) {
    const charCode = source.charCodeAt(i);
    const currentTokenType = charTable[charCode];

    // Fast path for common tokens (using bitmask)
    const tokenMask = tokenMasks[charCode];
    if (tokenMask & tokenType) {
      i++;
      while (tokenMasks[source.charCodeAt(i)] & tokenType) {
        i++;
      }
      result[tokens.length] = { type: tokenType, value: source.substring(start, i), loc, start, end: i };
      tokens.length++;
      start = i;
      tokenType = 0;
      loc = 0;
      continue;
    }

    // Handle comments and whitespace
    if (currentTokenType === 0) {
      // Whitespace or other non-token characters
      if (charCode === 0x0A) { // Line break
        loc |= Location.LineBreak;
        line++;
        column = 0;
      } else if (charCode === 0x2F) { // Potential comment start
        if (source[i + 1] === "*") { // Multi-line comment
          i += 2;
          while (!(source[i] === "*" && source[i + 1] === "/") && i < source.length) {
            if (source[i] === "\r" && source[i + 1] === "\n") {
              loc |= Location.LineBreak;
              line++;
              column = 0;
              i++;
            } else if (source[i] === "\n") {
              loc |= Location.LineBreak;
              line++;
              column = 0;
            } else {
              column++;
            }
            i++;
          }
          i += 2; // Skip the closing comment characters
          if (loc & Location.LineBreak) {
            loc |= Location.CommentAfter;
            loc &= ~Location.LineBreak;
          } else {
            loc |= Location.CommentAfter;
          }
        } else if (source[i + 1] === "/") { // Single-line comment
          i += 2;
          while (source[i] !== "\n" && i < source.length) {
            i++;
          }
          loc |= Location.CommentAfter;
        } else if (source[i + 1] === "!") { // HTML comment start
          i += 2; // Skip the "<!-"
          while (!(source[i] === "-" && source[i + 1] === "-" && source[i + 2] === ">") && i < source.length) {
            if (source[i] === "\r" && source[i + 1] === "\n") {
              loc |= Location.LineBreak;
              line++;
              column = 0;
              i++;
            } else if (source[i] === "\n") {
              loc |= Location.LineBreak;
              line++;
              column = 0;
            } else {
              column++;
            }
            i++;
          }
          if (loc & Location.LineBreak) {
            loc |= Location.HtmlCommentAfter;
            loc &= ~Location.LineBreak;
          } else {
            loc |= Location.HtmlCommentAfter;
          }
          i += 3;
        } else {
          // Whitespace or other non-token characters
          if (charClasses.whitespace[charCode] === 1) { // Using pre-computed lookup table
            if (charCode === 0x0A) { // Line break
              loc |= Location.LineBreak;
              line++;
              column = 0;
            } else {
              column++;
            }
          }
          i++;
          start = i;
          tokenType = 0;
          loc = 0;
        }
      } else {
        // Start of a token
        tokenType = currentTokenType;
        start = i;

        if (tokenType & TokenType.NUMBER) {
          // Aggressive number scanning using bitmask for number types
          if (source[i] === "0") {
            if (source[i + 1] === "x" || source[i + 1] === "X") {
              // Hexadecimal number
              i += 2;
              while (charClasses.hexDigits[source.charCodeAt(i)] === 1) { // Using pre-computed lookup table
                i++;
              }
            } else if (source[i + 1] === "b" || source[i + 1] === "B") {
              // Binary number
              i += 2;
              while (source[i] === "0" || source[i] === "1") {
                i++;
              }
            } else if (charClasses.octalDigits[source.charCodeAt(i + 1)] === 1) { // Using pre-computed lookup table
              // Octal number (leading 0 followed by octal digits)
              i++;
              while (charClasses.octalDigits[source.charCodeAt(i)] === 1) { // Using pre-computed lookup table
                i++;
              }
            } else {
              // Decimal number with leading zero
              i++;
            }
          } else {
            // Decimal number
            while (charClasses.digits[source.charCodeAt(i)] === 1) { // Using pre-computed lookup table
              i++;
            }
          }

          // Handle optional decimal part, exponent, and sign
          if (source[i] === ".") {
            i++;
            while (charClasses.digits[source.charCodeAt(i)] === 1) {
              i++;
            }
          }
          if (source[i] === "e" || source[i] === "E") {
            i++;
            if (source[i] === "+" || source[i] === "-") {
              i++;
            }
            while (charClasses.digits[source.charCodeAt(i)] === 1) {
              i++;
            }
          }

          // Check for bigint
          if (source[i] === "n" || source[i] === "N") {
            i++;
            tokenType = TokenType.BIGINT; 
          }

          // Check for number followed by identifier
          if (charClasses.identifierChars[source.charCodeAt(i)] === 1) {
            onDiagnostic({
              type: DiagnosticType.Error,
              message: "Invalid identifier after number",
              line,
              column: i - start,
            });
            return [];
          }

          result[tokens.length] = { type: tokenType, value: source.substring(start, i), loc, start, end: i };
          tokens.length++;
          start = i;
          tokenType = 0;
          loc = 0;
        } else if (tokenType & TokenType.STRING) {
          // Aggressive string scanning
          i++;
          const quoteChar = source[start];
          while (source[i] !== quoteChar && i < source.length) {
            if (source[i] === "\\") {
              // Check for \n edge case
              if (source[i + 1] === "\n") {
                onDiagnostic({
                  type: DiagnosticType.Error,
                  message: "Invalid escape sequence '\\n' in string",
                  line,
                  column: i - start,
                });
                return [];
              }
              i += 2;
            } else {
              i++;
            }
          }
          result[tokens.length] = { type: TokenType.STRING, value: source.substring(start, i + 1), loc, start, end: i + 1 };
          tokens.length++;
          i++;
          start = i;
          tokenType = 0;
          loc = 0;
        } else if (tokenType & TokenType.TEMPLATE) {
          // ECMAScript-compliant template literal scanning
          i++;
          const backtick = source[start];
          let nestedDepth = 0;
          inTemplate = true;
          templateDepth++;
          while (i < source.length) {
            const charCode = source.charCodeAt(i);
            if (charCode === backtick) {
              if (nestedDepth === 0) {
                result[tokens.length] = { type: TokenType.TEMPLATE, value: source.substring(start, i + 1), loc, start, end: i + 1 };
                tokens.length++;
                i++;
                start = i;
                tokenType = 0;
                inTemplate = false;
                templateDepth--;
                break;
              } else {
                nestedDepth--;
              }
            } else if (charCode === 0x5C) { // Backslash - handle escape sequences
              // Check for \n edge case
              if (source[i + 1] === "\n") {
                onDiagnostic({
                  type: DiagnosticType.Error,
                  message: "Invalid escape sequence '\\n' in template literal",
                  line,
                  column: i - start,
                });
                return [];
              }
              i += 2;
            } else if (charCode === 0x24 && source[i + 1] === 0x7B) { // Dollar sign followed by opening curly brace
              nestedDepth++;
              i += 2; // Skip the opening curly brace
            } else {
              i++;
            }
          }
          // Handle incomplete template literal
          if (i === source.length) {
            if (inTemplate && templateDepth > 0) {
              onDiagnostic({
                type: DiagnosticType.Error,
                message: "Unterminated template literal",
                line,
                column: i - start,
              });
              return [];
            }
            result[tokens.length] = { type: TokenType.TEMPLATE, value: source.substring(start), loc, start, end: i };
            tokens.length++;
          }
          start = i;
          tokenType = 0;
          loc = 0;
        } else if (tokenType & TokenType.IDENTIFIER) {
          // Aggressive identifier scanning using bitmask for keywords
          let isKeyword = false;
          let isEscapedKeyword = false;
          let escapedKeyword: string | null = null;

          // Handle surrogate pairs for identifier characters
          while (i < source.length) { // Using pre-computed lookup table
            const charCode = source.charCodeAt(i);
            if (charCode === 0x5C && !(regexState & RegexState.Escaped)) { // Backslash
              // Check for escaped keyword
              const escapedIdentifier = source.substring(start, i + 2);
              if (escapedKeywords.has(escapedIdentifier)) {
                isEscapedKeyword = true;
                escapedKeyword = escapedIdentifier;
              }
              i += 2; // Skip the escaped character
            } else if (charCode >= 0xD800 && charCode <= 0xDBFF && (regexState & RegexState.Unicode) !== 0) { // High surrogate
              if (i + 1 < source.length && source.charCodeAt(i + 1) >= 0xDC00 && source.charCodeAt(i + 1) <= 0xDFFF) { // Low surrogate
                i++; // Treat the surrogate pair as a single character
              } else {
                onDiagnostic({
                  type: DiagnosticType.Error,
                  message: "Invalid surrogate pair in identifier",
                  line,
                  column: i - start,
                });
                return [];
              }
            } else if (charClasses.identifierChars[charCode] === 1) { 
              i++;
            } else {
              break; // Stop scanning if it's not a valid identifier character
            }
          }

          // If it's a keyword, set the appropriate token type
          if (isKeyword) {
            tokenType = TokenType.KEYWORD;
          } else if (isEscapedKeyword) {
            tokenType = TokenType.ESCAPED_KEYWORD;
            result[tokens.length] = { type: TokenType.IDENTIFIER, value: escapedKeyword, loc, start, end: i };
            tokens.length++;
          } else {
            tokenType = TokenType.IDENTIFIER;
          }
          result[tokens.length] = { type: tokenType, value: source.substring(start, i), loc, start, end: i };
          tokens.length++;
          start = i;
          tokenType = 0;
          loc = 0;
        } else if (tokenType & TokenType.PUNCTUATOR) {
          // Aggressive punctuator scanning (using bitmask)
          if (source[i] === "?" && source[i + 1] === ".") {
            // Handle the optional chaining operator (?.).
            result[tokens.length] = { type: TokenType.PUNCTUATOR, value: source.substring(i, i + 2), loc, start: i, end: i + 2 };
            tokens.length++;
            i += 2;
            start = i;
            tokenType = 0;
            loc = 0;
          } else if ((inRegex || inJSXAttribute || inJSXExpression || inTemplate) && charCode === 0x2F) {
            // Handle '/' as a regular character inside regex, JSX attributes, expressions, or template literals
            result[tokens.length] = { type: TokenType.PUNCTUATOR, value: source[i], loc, start: i, end: i + 1 };
            tokens.length++;
            i++;
            start = i;
            tokenType = 0;
            loc = 0;
          } else {
            // Handle regular punctuators (excluding '/' in the above cases)
            result[tokens.length] = { type: TokenType.PUNCTUATOR, value: source[i], loc, start: i, end: i + 1 };
            tokens.length++;
            i++;
            start = i;
            tokenType = 0;
            loc = 0;
          }
        } else if (tokenType & TokenType.REGEX) {
          const regexToken = scanRegex(source, start, onDiagnostic, line, column);
          if (regexToken) {
            result[tokens.length] = regexToken;
            tokens.length++;
            start = i;
            tokenType = 0;
            loc = 0;
            inRegex = false;
            continue;
          }
        }
      }
    }

    // JSX Tag Handling
    if (scanJsx) {
      if (charCode === 0x3C) { // '<' - potential JSX tag start
        if (source[i + 1] === "/") { // '</' - closing JSX tag
          i += 2;
          jsxTagDepth--;
          jsxElementStack.pop(); // Pop the element name from the stack
          if (jsxTagDepth < 0) {
            onDiagnostic({
              type: DiagnosticType.Error,
              message: "Unmatched closing JSX tag",
              line,
              column: i - start,
            });
            return [];
          }
          result[tokens.length] = { type: TokenType.JSX_TAG_END, value: "</" + source.substring(i - 1, i + 1), loc, start: i - 1, end: i + 1 };
          tokens.length++;
          start = i;
          tokenType = 0;
          loc = 0;
          inJSXAttribute = false;
          currentJSXAttributeName = null;
          inJSXAttributeValue = false;
          attributeValueQuoteChar = null;
          inJSXExpression = false;
          expressionStart = null;
        } else {
          // '<' - opening JSX tag
          i++;
          jsxTagDepth++;
          jsxTagName = "";
          while (i < source.length && isJSXTagNameChar(source.charCodeAt(i))) {
            jsxTagName += source[i];
            i++;
          }
          if (source[i] === "/" && source[i + 1] === ">") { 
            // Self-closing tag
            i += 2; // Skip "/>"
            result[tokens.length] = { type: TokenType.JSX_TAG_START, value: "<" + jsxTagName + "/>", loc, start: i - jsxTagName.length - 2, end: i };
            tokens.length++;
            start = i;
            tokenType = 0;
            loc = 0;
            jsxTagDepth--; // Decrement tag depth for self-closing tag
          } else { 
            // Regular opening tag
            result[tokens.length] = { type: TokenType.JSX_TAG_START, value: "<" + jsxTagName, loc, start: i - jsxTagName.length - 1, end: i };
            tokens.length++;
            start = i;
            tokenType = 0;
            loc = 0;
            jsxElementStack.push(jsxTagName); // Push the element name to the stack
            inJSXAttribute = true;
          }
        }
      } else if (charCode === 0x3E && jsxTagDepth > 0) { // '>' - end of JSX tag
        i++;
        inJSXAttribute = false;
        currentJSXAttributeName = null;
        inJSXAttributeValue = false;
        attributeValueQuoteChar = null;
        inJSXExpression = false;
        expressionStart = null;
        result[tokens.length] = { type: TokenType.JSX_TAG_END, value: ">", loc, start: i - 1, end: i };
        tokens.length++;
        start = i;
        tokenType = 0;
        loc = 0;
      } else if (inJSXAttribute) {
        // Handle JSX attributes
        if (inJSXAttributeValue) {
          // Handle attribute value
          if (source[i] === attributeValueQuoteChar && attributeValueQuoteChar !== null) {
            i++; // Skip the closing quote character
            result[tokens.length] = { type: TokenType.JSX_TEXT, value: source.substring(start, i), loc, start, end: i };
            tokens.length++;
            start = i;
            tokenType = 0;
            loc = 0;
            inJSXAttributeValue = false;
            attributeValueQuoteChar = null;
          } else if (source[i] === "\\" && i + 1 < source.length) { 
            // Handle escaped characters within the attribute value
            result[tokens.length] = { type: TokenType.JSX_TEXT, value: source.substring(i, i + 2), loc, start: i, end: i + 2 };
            tokens.length++;
            i += 2;
            start = i;
            tokenType = 0;
            loc = 0;
          } else {
            // Continue accumulating attribute value
            i++;
          }
        } else if (charCode === 0x22 || charCode === 0x27) { // ' or " - quoted attribute value
          attributeValueQuoteChar = source[i];
          inJSXAttributeValue = true;
          i++; // Skip the quote character
          start = i;
          tokenType = 0;
          loc = 0;
        } else if (charCode === 0x3D && currentJSXAttributeName !== null) { // '=' - attribute assignment
          i++; // Skip the '='
          result[tokens.length] = { type: TokenType.JSX_TEXT, value: "=", loc, start: i - 1, end: i };
          tokens.length++;
          start = i;
          tokenType = 0;
          loc = 0;
          inJSXAttribute = false;
        } else if (charCode === 0x20 || charCode === 0x09 || charCode === 0x0A || charCode === 0x0D) { // Space or newline
          i++; // Skip whitespace
          inJSXAttribute = false;
          currentJSXAttributeName = null;
        } else if (isJSXAttributeNameChar(charCode)) {
          // JSX attribute name
          currentJSXAttributeName = "";
          while (i < source.length && isJSXAttributeNameChar(source.charCodeAt(i))) {
            currentJSXAttributeName += source[i];
            i++;
          }
          result[tokens.length] = { type: TokenType.JSX_TEXT, value: currentJSXAttributeName, loc, start: i - currentJSXAttributeName.length, end: i };
          tokens.length++;
          start = i;
          tokenType = 0;
          loc = 0;
          inJSXAttribute = true;
        } else if (charCode === 0x7B) { // '{' - JSX expression
          inJSXExpression = true;
          expressionStart = i;
          i++; // Skip the opening curly brace
          start = i;
          tokenType = 0;
          loc = 0;
        } else if (inJSXExpression) {
          // Handle JSX Expression
          if (charCode === 0x7D) {
            i++; // Skip the closing curly brace
            const expression = source.substring(expressionStart + 1, i - 1);
            result[tokens.length] = { type: TokenType.JSX_TEXT, value: expression, loc, start: expressionStart, end: i };
            tokens.length++;
            start = i;
            tokenType = 0;
            loc = 0;
            inJSXExpression = false;
            expressionStart = null;
          } else {
            // Continue accumulating expression
            if (charCode === 0x2F) {
              if (inJSXAttributeValue && attributeValueQuoteChar !== null) {
                // If we're inside an attribute value with quotes, treat '/' normally
                result[tokens.length] = { type: TokenType.JSX_TEXT, value: source[i], loc, start: i, end: i + 1 };
                tokens.length++;
                i++; 
              } else if (inJSXExpression) {
                // If we're inside an expression, treat '/' normally
                result[tokens.length] = { type: TokenType.JSX_TEXT, value: source[i], loc, start: i, end: i + 1 };
                tokens.length++;
                i++; 
              } else {
                // Otherwise, treat '/' as a potential closing tag
                if (source[i + 1] === 0x3C) {
                  // Potential self-closing tag (</>)
                  i += 2;
                  result[tokens.length] = { type: TokenType.JSX_TAG_END, value: "</>", loc, start: i - 2, end: i };
                  tokens.length++;
                  start = i;
                  tokenType = 0;
                  loc = 0;
                } else {
                  // Regular text with '/'
                  result[tokens.length] = { type: TokenType.JSX_TEXT, value: source[i], loc, start: i, end: i + 1 };
                  tokens.length++;
                  i++;
                }
              }
            } else {
              // Continue accumulating expression
              i++;
            }
          }
        }
      } else if (jsxTagDepth > 0) {
        // Handle JSX text (including text within elements)
        if (charCode === 0x2F) {
          if (source[i + 1] === 0x3C) {
            // Potential self-closing tag (</>)
            i += 2;
            result[tokens.length] = { type: TokenType.JSX_TAG_END, value: "</>", loc, start: i - 2, end: i };
            tokens.length++;
            start = i;
            tokenType = 0;
            loc = 0;
          } else {
            // Handle regular text (including text with escape sequences)
            while (i < source.length && charCode !== 0x3C) {
              if (source[i] === "\\" && i + 1 < source.length) {
                result[tokens.length] = { type: TokenType.JSX_TEXT, value: source.substring(i, i + 2), loc, start: i, end: i + 2 };
                tokens.length++;
                i += 2;
              } else {
                result[tokens.length] = { type: TokenType.JSX_TEXT, value: source[i], loc, start: i, end: i + 1 };
                tokens.length++;
                i++;
              }
              charCode = source.charCodeAt(i);
            }
            start = i;
            tokenType = 0;
            loc = 0;
          }
        } else {
          // Handle regular text (including text with escape sequences)
          while (i < source.length && charCode !== 0x3C) {
            if (source[i] === "\\" && i + 1 < source.length) {
              result[tokens.length] = { type: TokenType.JSX_TEXT, value: source.substring(i, i + 2), loc, start: i, end: i + 2 };
              tokens.length++;
              i += 2;
            } else {
              result[tokens.length] = { type: TokenType.JSX_TEXT, value: source[i], loc, start: i, end: i + 1 };
              tokens.length++;
              i++;
            }
            charCode = source.charCodeAt(i);
          }
          start = i;
          tokenType = 0;
          loc = 0;
        }
      }
    } else {
      // ... (Previous code for handling other token types)
    }
  }

  // Handle the last token if any
  if (tokenType !== 0) {
    result[tokens.length] = { type: tokenType, value: source.substring(start, i), loc, start, end: i };
    tokens.length++;
  }

  return tokens;
}

 
