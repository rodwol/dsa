const SparseMatrix = require('./SparseMatrix.js'); // Ensure correct path
console.log(SparseMatrix);  // added this to check the SparseMatrix
const readline = require('readline');


// Function to handle user input for matrix operations
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the path of the first matrix file: ', (firstMatrixPath) => {
    rl.question('Enter the path of the second matrix file: ', (secondMatrixPath) => {
        rl.question('Choose operation (add, subtract, multiply): ', (operation) => {
            try {
                // Load matrices from files using the static fromFile method
                const matrix1 = SparseMatrix.fromFile(firstMatrixPath);
                const matrix2 = SparseMatrix.fromFile(secondMatrixPath);
                let result;

                // Perform the operation chosen by the user
                if (operation === 'add') {
                    result = matrix1.add(matrix2);
                } else if (operation === 'subtract') {
                    result = matrix1.subtract(matrix2);
                } else if (operation === 'multiply') {
                    result = matrix1.multiply(matrix2);
                } else {
                    throw new Error('Invalid operation');
                }

                // Print the result matrix
                result.print();
            } catch (error) {
                console.error('Error:', error.message);
            } finally {
                rl.close();  // Close the readline interface
            }
        });
    });
});
