const fs = require('fs');


class SparseMatrix {
    constructor(rows, cols) {
        this.row = rows;
        this.cols = cols;
        this.elements = {};
        // elements is dictionary to store non-zero elements
    }
    }
    function fromFile(filePath) {
        const data = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    
        if (!data[0].startsWith('rows=') || !data[1].startsWith('cols=')) {
            throw ExceptionError("Input file has wromg format");
        }
    
        // extracting the rows and columns and convert them to integers
        const rows = parseInt(data[0].split('=')[1].trim());
        const cols = parseInt(data[1].split('=')[1].trim());
        const matrix = new Sparse_matrix(rows, cols);
    
        for (let i = 2; i < data.length; i++) {
            const line = data[i].trim();
            if (line) {
                const match = line.match(/\((\d+),\s*(\d+),\s*(-?\d+)\)/);
                if (!match) {
                    throw ExceptionError("Input file has wrong format")
                }
    
                const [_, row, col, value] = match.map(Number);
                matrix.setElement(row, col, value);
            }
        }
    
        return matrix
    }
    // 
    function getElement(rows, col) {
        return this.elements['${row},${col}'] || 0;
    }

    function setElement(rows, col, value) {
        if (value !== 0) {
            this.elements['${row},${col}'] = value;
        } else {
            delete this.elements['${row},${col}'];
            // remove if zero to maintain the sparse matrix
        }
    }

    // Matrix addition
    function add(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error('Matrix dimensions do not match for addition');
        }

        const result = new SparseMatrix(this.rows, this.cols);

        // Copy elements from both matrices
        Object.keys(this.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, this.getElement(row, col) + other.getElement(row, col));
        });

        Object.keys(other.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            if (!result.getElement(row, col)) {
                result.setElement(row, col, other.getElement(row, col));
            }
        });

        return result;
    }

    // Matrix subtraction
    function subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error('Matrix dimensions do not match for subtraction');
        }

        const result = new SparseMatrix(this.rows, this.cols);

        Object.keys(this.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            result.setElement(row, col, this.getElement(row, col) - other.getElement(row, col));
        });

        Object.keys(other.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            if (!result.getElement(row, col)) {
                result.setElement(row, col, -other.getElement(row, col));
            }
        });

        return result;
    }

    // Matrix multiplication
    function multiply(other) {
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

    // To display sparse matrix (non-zero values)
    function print() {
        console.log(`Sparse Matrix (${this.rows} x ${this.cols}):`);
        Object.keys(this.elements).forEach(key => {
            const [row, col] = key.split(',').map(Number);
            console.log(`(${row}, ${col}) -> ${this.elements[key]}`);
        });
    }

module.exports = SparseMatrix;
