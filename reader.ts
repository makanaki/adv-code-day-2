import fs from 'node:fs'
import * as readline from 'node:readline'

/**
 * Iterates over a string split by single spaces, enforcing a strict format.
 *
 * @param str - Input string to split.
 * @yields Each token between spaces, in order.
 * @throws
 */
function* partsBySingleSpaces( str : string ) : Generator<string, void, void> {
	const trimStr = str.trim()
	if (trimStr.length === 0) return

	let start = 0
	for ( let i = 0 ; i < trimStr.length ; i++ ) {
		if (trimStr[ i ] !== ' ') continue

		yield trimStr.slice(start, i)
		start = i + 1
	}

	yield trimStr.slice(start)
}

export class Reader {
	/**
	 * Determines whether a single line matches the "safe" rules.
	 *
	 * A line is considered safe when:
	 * - it contains only positive integers (no signs, decimals, or other chars)
	 * - values are strictly monotonic (entirely increasing OR entirely decreasing)
	 * - adjacent differences are within [1..3]
	 *
	 * @param str - Raw line from input (without newline).
	 * @returns `true` if safe; otherwise `false`.
	 */
	protected static processString( str : string ) : boolean {
		let prev : number | undefined = undefined
		let dir : number | undefined = undefined

		for ( const part of partsBySingleSpaces(str) ) {

			// test for positive integers
			if (!/^\d+$/.test(part)) {
				throw new Error(`Invalid integer format: ${part}`)
			}
			const curr = Number(part)

			if (prev === undefined) {
				prev = curr
				continue
			}

			const currDir = prev > curr ? 1 : -1
			if (dir === undefined) {
				dir = currDir
			}
			if (currDir !== dir) {
				return false
			}

			const diff = Math.abs(curr - prev)
			if (diff > 3 || diff < 1) {
				return false
			}

			prev = curr
		}

		return true
	}

	/**
	 * Reads a file line-by-line and classifies each line as "Safe" or "Not Safe".
	 *
	 * Output format:
	 * - `"Safe: <line>"`
	 * - `"Not Safe: <line>"`
	 *
	 * @param filePath - Path to the input file to read.
	 * @param debug
	 * @yields boolean indicating if the line is safe
	 * @throws Node.js stream/file errors, and spacing-format errors from {@link processString}.
	 */
	static async* validateLevels( filePath : string, debug : boolean = true ) : AsyncGenerator<boolean, void, void> {
		const stream = fs.createReadStream(filePath)
		const rl = readline.createInterface({
			input :     stream,
			crlfDelay : Infinity,
		})

		try {
			for await ( const line of rl ) {
				const str = line.length > 100 ? line.slice(0, 100) + '...' : line
				try {
					if (debug) {
						console.log(this.processString(line) ? 'Safe: ' : 'Not Safe: ', str)
					}
					yield this.processString(line)
				} catch (e) {
					if (debug) {
						console.warn(`Error processing line: ${(e as Error).message}: ${str}`)
						console.log('Not Safe: ', str)
					}
					yield false
				}
			}
		} finally {
			rl.close()
			stream.destroy()
		}
	}
}
