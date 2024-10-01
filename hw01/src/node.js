#!/usr/bin/node
const fs = require('fs');
const path = require('path');

class UniqueInt {
    constructor() {
        // Hardcode the path for testing
        this.redirectory = '/dsa/hw01/sample_inputs';

        // Log the directory name for verification
        console.log('Expected directory:', this.redirectory);

        // Prompt the user for the file path
        process.stdout.write('Please enter the file path: ');
        process.stdin.on('data', (input) => {
            let inputFilePath = input.toString().trim(); // Convert input to string and trim whitespace
            
            // Resolve the input file path to an absolute path
            const absoluteInputPath = path.resolve(inputFilePath);

            // Get the directory name from the resolved path
            const inputDir = path.dirname(absoluteInputPath);

            // Log the actual directory from the input
            console.log('Input directory:', inputDir);

            // Check if the input file is in the required directory
            if (inputDir !== this.redirectory) {
                console.error(`Error: The input file must be located in the directory: ${this.redirectory}`);
                process.stdin.end(); // End input stream
                return;
            }

            this.filePath = absoluteInputPath; // Save the absolute file path
            this.outputPath = path.join('/dsa/hw01/sample_results', path.basename(inputFilePath) + '_results.txt');

            // Read and process the file
            this.processFile(this.filePath, this.outputPath);
        });
    }

    processFile(inputFilePath, outputFilePath) {
        const uniqueIntegers = {};  // Track unique integers using an object

        fs.readFile(inputFilePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                console.error(`Error reading file: ${err.message}`);
                return;
            }

            let currentNum = '';
            let isNegative = false;

            for (let i = 0; i < data.length; i++) {
                const char = data[i];

                // Handle negative numbers
                if (char === '-') {
                    isNegative = true;
                    continue;
                }

                // If we encounter a digit, accumulate it into the current number
                if (char >= '0' && char <= '9') {
                    currentNum += char;
                } else if (char === '\n' || char === ' ' || i === data.length - 1) {
                    // Handle new line, space, or end of file
                    if (currentNum.length > 0) {
                        const num = parseInt(currentNum, 10) * (isNegative ? -1 : 1);

                        // Only store unique integers within the allowed range
                        if (num >= -1023 && num <= 1023) {
                            uniqueIntegers[num] = true;
                        }
                    }

                    // Reset for the next number
                    currentNum = '';
                    isNegative = false;
                }
            }

            // Collect the unique integers and sort them manually
            const sortedUniqueIntegers = this.manualSort(uniqueIntegers);

            // Write the result to the output file
            this.writeToFile(sortedUniqueIntegers, outputFilePath);
        });
    }

    manualSort(uniqueIntegers) {
        // Manually collect and sort integers
        const result = [];
        for (let i = -1023; i <= 1023; i++) {
            if (uniqueIntegers[i]) {
                result.push(i);
            }
        }
        // The integers are iterated in sorted order from -1023 to 1023
        return result;
    }

    writeToFile(sortedUniqueIntegers, outputFilePath) {
        let outputData = '';
        for (const num of sortedUniqueIntegers) {
            outputData += num + '\n';  // Each integer on a new line
        }

        fs.writeFile(outputFilePath, outputData, (err) => {
            if (err) {
                console.error(`Error writing to file: ${err.message}`);
            } else {
                console.log(`Unique integers have been written to: ${outputFilePath}`);
            }
        });
    }
}

// Instantiate the class to prompt for input and process the file
new UniqueInt();

