import fs from 'node:fs'

/**
 * Builds an increasing sequence of integers as a single space-separated line.
 *
 * Each number is greater than the previous one by a random delta in the range [1..5].
 *
 * @param length - How many integers to generate
 * @returns string
 */
function generateRandomLine( length : number ) : string {
	const correctNumbers = new Array(Math.max(1, length)).fill(0)
	correctNumbers[ 0 ] = 1
	for ( let i = 1 ; i < length ; i++ ) {
		correctNumbers[ i ] = correctNumbers[ i - 1 ] + Math.floor(Math.random() * 5) + 1
	}
	return correctNumbers.join(' ')
}

/**
 * Builds an increasing sequence of integers as a single space-separated line.
 *
 * Each number is greater than the previous one by a random delta in the range [1..3].
 * This is intended to produce a line that satisfies the "safe" criteria enforced by {@link Reader}.
 *
 * @param length - How many integers to generate. Should be >= 1.
 * @returns string
 */
function generateCorrectLine( length : number ) : string {
	const correctNumbers = new Array(Math.max(1, length)).fill(0)
	correctNumbers[ 0 ] = 1
	for ( let i = 1 ; i < length ; i++ ) {
		correctNumbers[ i ] = correctNumbers[ i - 1 ] + Math.floor(Math.random() * 3) + 1
	}
	return correctNumbers.join(' ')
}

/**
 * Generates a text file containing numeric lines in the expected input format.
 *
 * Lines alternate:
 * - even indices: "random" increasing sequence (step 1..5)
 * - odd indices: "correct/safe" increasing sequence (step 1..3)
 *
 * Side effects:
 * - Overwrites the file if it already exists.
 *
 * @param filePath - Output path (absolute or relative)
 * @param linesCount - Number of lines to write
 * @param numsCount - Numbers per line (default: 10)
 * @returns Promise<void>
 */
export async function generateFile( filePath : string, linesCount : number, numsCount : number = 10 ) : Promise<void> {
	const stream = fs.createWriteStream(filePath, { encoding : 'utf8', flags : 'w' })
	for ( let i = 0 ; i < linesCount ; i++ ) {
		const chunk = i % 2 == 0 ? generateRandomLine(numsCount) : generateCorrectLine(numsCount)
		const nl = i < linesCount - 1 ? '\n' : ''
		stream.write(chunk + nl)
	}

	stream.end()
}
