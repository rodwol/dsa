const fs = require('fs');

class SparseMatrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.elements = {}; // Dictionary to store non-zero elements
    }

    // Static method to read a sparse matrix from a file
    static fromFile(filePath) {
        const data = fs.readFileSync(filePath, 'utf8').trim().split('\n').map(line => line.trim());
    
        // Manually check if the first line starts with 'rows='
        if (!SparseMatrix.customStartsWith(data[0], 'rows=') || !SparseMatrix.customStartsWith(data[1], 'cols=')) {
            throw new Error("Input file has wrong format");
        }
    
        // Extract rows and cols manually without split and parseInt
        const rows = SparseMatrix.stringToInt(data[0], 'rows=');
        const cols = SparseMatrix.stringToInt(data[1], 'cols=');
    
        // Create a new instance of SparseMatrix with extracted rows and cols
        const matrix = new SparseMatrix(rows, cols);
    
        for (let i = 2; i < data.length; i++) {
            const line = data[i].trim();
            if (line) {
                // Manually match the pattern without using match
                const match = SparseMatrix.customMatch(line);
                if (!match) {
                    throw new Error("Input file has wrong format");
                }
    
                const [row, col, value] = match;
                matrix.setElement(row, col, value);
            }
        }
    
        return matrix;  // Return the new instance of SparseMatrix
    }

    // Custom function to simulate startsWith
    static customStartsWith(str, prefix) {
        for (let i = 0; i < prefix.length; i++) {
            if (str[i] !== prefix[i]) {
                return false;
            }
        }
        return true;
    }
    
    // Custom function to convert "rows=" or "cols=" format into integers
    static stringToInt(str, prefix) {
        let numberStr = '';
        let i = prefix.length;
    
        while (i < str.length && str[i] !== ' ') {
            const code = str.charCodeAt(i);
            if (code >= 48 && code <= 57) {  // ASCII values for '0'-'9'
                numberStr += str[i];
            }
            i++;
        }
    
        let number = 0;
        for (let j = 0; j < numberStr.length; j++) {
            number = number * 10 + (numberStr.charCodeAt(j) - 48);
        }
        return number;
    }
    
    // Custom function to simulate pattern matching
    static customMatch(line) {
        let numbers = [];
        let currentNumber = '';
        let openBracket = false;
    
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '(') {
                openBracket = true;
            } else if (char === ')') {
                if (currentNumber !== '') {
                    numbers.push(SparseMatrix.manualParseInt(currentNumber));  // Manually convert number
                }
                openBracket = false;
            } else if (openBracket && (char >= '0' && char <= '9' || char === '-')) {
                currentNumber += char;
            } else if (char === ',' || char === ' ') {
                if (currentNumber !== '') {
                    numbers.push(SparseMatrix.manualParseInt(currentNumber));  // Manually convert number
                    currentNumber = '';
                }
            }
        }
    
        return numbers.length === 3 ? numbers : null;
    }

    // Manual function to convert a string number to integer
    static manualParseInt(str) {
        let number = 0;
        let isNegative = false;
        let i = 0;

        if (str[0] === '-') {
            isNegative = true;
            i++;
        }

        while (i < str.length) {
            number = number * 10 + (str.charCodeAt(i) - 48);
            i++;
        }

        return isNegative ? -number : number;
    }

    // Get element at (row, col)
    getElement(row, col) {
        return this.elements[`${row},${col}`] || 0;
    }

    // Set element at (row, col)
    setElement(row, col, value) {
        if (value !== 0) {
            this.elements[`${row},${col}`] = value;
        } else {
            delete this.elements[`${row},${col}`]; // Remove if zero to maintain sparsity
        }
    }

    // Matrix addition
    add(other) {
        console.log(`Adding matrices: this (${this.rows}, ${this.cols}) + other (${other.rows}, ${other.cols})`);
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error('Matrix dimensions do not match for addition');
        }

        const result = new SparseMatrix(this.rows, this.cols);

        // Add elements from this matrix
        Object.keys(this.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, this.getElement(row, col) + other.getElement(row, col));
        });

        // Add elements from the other matrix
        Object.keys(other.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            if (!result.getElement(row, col)) {
                result.setElement(row, col, other.getElement(row, col));
            }
        });

        return result;
    }

    // Matrix subtraction
    subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error('Matrix dimensions do not match for subtraction');
        }

        const result = new SparseMatrix(this.rows, this.cols);

        // Subtract elements from this matrix
        Object.keys(this.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, this.getElement(row, col) - other.getElement(row, col));
        });

        // Subtract elements from the other matrix
        Object.keys(other.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            if (!result.getElement(row, col)) {
                result.setElement(row, col, - other.getElement(row, col));
            }
        });

        return result;
    }

    // Matrix multiplication
    multiply(other) {
        if (this.cols !== other.rows) {
            throw new Error('Matrix dimensions do not match for multiplication');
        }

        const result = new SparseMatrix(this.rows, other.cols);

        Object.keys(this.elements).forEach(keyA => {
            const [rowA, colA] = keyA.split(',').map(Number);
            Object.keys(other.elements).forEach(keyB => {
                const [rowB, colB] = keyB.split(',').map(Number);
                if (colA === rowB) {
                    const product = this.getElement(rowA, colA) * other.getElement(rowB, colB);
                    result.setElement(rowA, colB, result.getElement(rowA, colB) + product);
                }
            });
        });

        return result;
    }

    // Print the sparse matrix (non-zero values)
    print() {
        console.log(`Sparse Matrix (${this.rows} x ${this.cols}):`);
        Object.keys(this.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            console.log(`(${row}, ${col}) -> ${this.elements[key]}`);
        });
    }
}

module.exports = SparseMatrix;
