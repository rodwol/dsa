# SparseMatrix Project

## Overview

This project implements a Sparse Matrix in JavaScript, allowing efficient storage and manipulation of large matrices with many zero values. The operations supported by this sparse matrix include addition, subtraction, and multiplication, with a focus on optimizing performance for large datasets. Additionally, the project reads matrix data from a file.

## Prerequisites

- **Node.js:** Ensure you have Node.js installed on your machine.


## Installation

1. Clone this repository:

    \`\`\`
    git clone https://github.com/rodwol/dsa.git
    cd sparse_matrix
    \`\`\`

## Usage

The matrix data should be stored in a text file (e.g., input.txt) with the following format:

\`\`\`
rows=<number_of_rows>
cols=<number_of_cols>
(row, col) -> value
(row, col) -> value
...
\`\`\`

## Running the Project

    \`\`\`
    node main.js
    \`\`\`

## License

This project is open-source and available under the MIT License.

Contributions are welcome! Please open an issue or submit a pull request.
