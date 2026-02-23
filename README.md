## Red-Nosed Reindeer nuclear fusion/fission plant levels challenge

https://adventofcode.com/2024/day/2

## Features

- **Sequence Classification**: Analyze files containing space-separated numeric sequences and classify each line as "Safe" or "Not Safe".
- **Sequence Generation**: Generate test files with random numeric sequences that alternate between strictly "Safe" patterns and random patterns.
- **Strict Format Enforcement**: Enforces a specific format for numeric sequences (positive integers, monotonic, specific difference ranges).

## Installation

1. Clone the repository.
2. Install dependencies and build the project:
   ```bash
   npm install && npm run build
   ```

## Usage

The CLI operates on files located within the `assets` folder.

### Analyzing a File

To classify the sequences in a file (defaulting to `assets/default.txt`):
```bash
npm start
```

To specify a different file in the `assets` folder (e.g., `assets/test_nums.txt`):
```bash
npm start -- --assetFileName test_nums.txt
```

### Generating a New File

To generate a new file with:
```bash
npm start -- --generate

npm start -- --generate --assetFileName test_data.txt --lines 50 --numbers 10
```

### CLI Options

| Option            | Short | Description                              | Default         | Limits      |
|-------------------|-------|------------------------------------------|-----------------|-------------|
| `--generate`      | `-g`  | Generate a new input file in `assets/`   | `false`         |             |
| `--lines`         | `-l`  | Number of lines to generate              | `10`            | max 100,000 |
| `--numbers`       | `-n`  | Number of integers per line              | `10`            | max 1,000   | 
| `--assetFileName` | `-a`  | Name of the file in the `assets/` folder | `generated.txt` |             |
| `--debug`         | `-d`  | Show errors and processing info          | `false`         |             |

## License

ISC
