const SparseMatrix = require('./SparseMatrix');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to handle user input
function promptUser() {
    rl.question('Enter the path of the first matrix file: ', (matrixFile1) => {
        rl.question('Enter the path of the second matrix file: ', (matrixFile2) => {
            rl.question('Choose operation (add, subtract, multiply): ', (operation) => {
                try {
                    const matrix1 = SparseMatrix.fromFile(matrixFile1);
                    const matrix2 = SparseMatrix.fromFile(matrixFile2);
                    let result;

                    switch (operation) {
                        case 'add':
                            result = matrix1.add(matrix2);
                            break;
                        case 'subtract':
                            result = matrix1.subtract(matrix2);
                            break;
                        case 'multiply':
                            result = matrix1.multiply(matrix2);
                            break;
                        default:
                            throw new Error('Invalid operation');
                    }

                    console.log('Result:');
                    result.print();
                } catch (error) {
                    console.error(error.message);
                } finally {
                    rl.close();
                }
            });
        });
    });
}

promptUser();
