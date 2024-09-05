const fs = require('fs');

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

// Function to parse UnicodeData.txt
function parseUnicodeData(data: string): any {
  const lines = data.split('\n');
  const propertyData = {
    "L": { // Letters
      "Lu": [], // Uppercase Letters
      "Ll": [], // Lowercase Letters
      "Lt": [], // Titlecase Letters
      "Lm": [], // Modifier Letters
      "Lo": [], // Other Letters
    },
    "N": { // Numbers
      "Nd": [], // Decimal Numbers
      "Nl": [], // Letter-like Numbers
      "No": [], // Other Numbers
    },
    "P": { // Punctuation
      "Pc": [], // Connector Punctuation
      "Pd": [], // Dash Punctuation
      "Ps": [], // Open Punctuation
      "Pe": [], // Close Punctuation
      "Pi": [], // Initial Punctuation
      "Pf": [], // Final Punctuation
      "Po": [], // Other Punctuation
    },
    "S": { // Symbols
      "Sm": [], // Math Symbols
      "Sc": [], // Currency Symbols
      "Sk": [], // Modifier Symbols
      "So": [], // Other Symbols
    },
    "Z": { // Separators
      "Zs": [], // Space Separators
      "Zl": [], // Line Separators
      "Zp": [], // Paragraph Separators
    },
    "C": { // Other
      "Cc": [], // Control
      "Cf": [], // Format
      "Cn": [], // Unassigned
      "Co": [], // Private Use
      "Cs": [], // Surrogate
    },
    "M": { // Marks
      "Mn": [], // Nonspacing Mark
      "Mc": [], // Spacing Mark
      "Me": [], // Enclosing Mark
    },
    "G": { // Other
      "Gc": [], // Other
    },
    "T": { // Other
      "Ti": [], // Ideographic
    }
  };

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length >= 5) {
      const charCode = parseInt(parts[0], 16);
      const generalCategory = parts[2];
      const category = generalCategory[0];
      const subcategory = generalCategory.slice(1);
      if (propertyData[category] && propertyData[category][subcategory]) {
        propertyData[category][subcategory].push(charCode);
      }
    }
  }
  return propertyData;
}

// Function to parse PropList.txt (for additional properties)
function parsePropList(data: string): any {
  const lines = data.split('\n');
  const propList = {};

  for (const line of lines) {
    const parts = line.split('#');
    if (parts.length >= 2) {
      const property = parts[0].trim();
      const codePoints = parts[1].split('..').map(range => {
        const values = range.split(' ').map(value => parseInt(value, 16));
        if (values.length === 1) {
          return values[0];
        } else if (values.length === 2) {
          return Array.from({ length: values[1] - values[0] + 1 }, (_, i) => values[0] + i);
        } else {
          throw new Error(`Invalid code point range: ${range}`);
        }
      }).flat();
      propList[property] = codePoints;
    }
  }
  return propList;
}

// Function to merge property data from UnicodeData.txt and PropList.txt
function mergePropertyData(unicodeData: any, propList: any): any {
  const mergedData = { ...unicodeData };
  for (const property in propList) {
    const category = property[0];
    const subcategory = property.slice(1);

    if (mergedData[category] && mergedData[category][subcategory]) {
      mergedData[category][subcategory] = [...mergedData[category][subcategory], ...propList[property]];
    } else {
      mergedData[category] = { [subcategory]: propList[property] };
    }
  }
  return mergedData;
}

// Main function to generate the unicode_properties.js file
async function generateUnicodeProperties() {
  try {
    const unicodeDataFile = 'UnicodeData.txt';
    const propListFile = 'PropList.txt';
    const unicodeData = parseUnicodeData(fs.readFileSync(unicodeDataFile, 'utf-8'));
    const propList = parsePropList(fs.readFileSync(propListFile, 'utf-8'));
    const mergedPropertyData = mergePropertyData(unicodeData, propList);

    // Populate the unicodePropertyData array with bitmasks
    for (const category of Object.keys(unicodePropertyBitmasks)) {
      const subcategories = unicodePropertyBitmasks[category];
      for (const subcategory in subcategories) {
        const bitmask = subcategories[subcategory];
        for (const charCode of mergedPropertyData[category][subcategory]) {
          unicodePropertyData[charCode] |= bitmask;
        }
      }
    }

    const output = `// Unicode property data 
const unicodePropertyData = ${JSON.stringify(unicodePropertyData)};

// ... (Your existing code)
`;
    fs.writeFileSync('unicode_properties.js', output);
    console.log('Generated unicode_properties.js');
  } catch (error) {
    console.error('Error generating unicode_properties.js:', error);
  }
}

// Call the main function to generate the file
generateUnicodeProperties();
