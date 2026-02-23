#!/usr/bin/env node
import { Reader } from './reader.js'
import { cli, defaultFileName, defaultGenerateFileName } from './cli.js'
import { generateFile } from './generate.js'
import path from 'node:path'

// console.log(cli)

function printError( message : string ) {
	process.stderr.write(message.endsWith('\n') ? message : message + '\n')
}

const INVALID_FILE_NAME_CHARS = [ '/', '\\', ':', '*', '"', '<', '>', '|' ]

function assertValidFileName( fileName : string ) : string {
	for ( const char of INVALID_FILE_NAME_CHARS ) {
		if (fileName.includes(char)) {
			throw new Error(`File name cannot contain "${char}"`)
		}
	}
	return fileName
}

function assertValidNumber( num : number, max : number = 10000 ) : number {
	const parsed = Number.parseInt(String(num), 10)
	if (!Number.isFinite(parsed) || parsed < 0) {
		throw new Error(`Number must be a non-negative integer`)
	}
	if (parsed > max) {
		throw new Error(`Number must be less than or equal to ${max}`)
	}
	return parsed
}

try {
	if (cli.flags.generate) {
		// forbid overwriting the default file
		const isDefaultAssetFileName = cli.flags.assetFileName === defaultFileName
		const assetFileName = isDefaultAssetFileName ? defaultGenerateFileName : cli.flags.assetFileName
		const filePath = path.join('assets', assertValidFileName(assetFileName))

		await generateFile(
			filePath,
			assertValidNumber(cli.flags.lines, 100000),
			assertValidNumber(cli.flags.numbers, 1000),
		)
		process.stdout.write(`Successfully generated ${cli.flags.lines} lines in ${filePath}\n`)
	} else {
		const filePath = path.join('assets', assertValidFileName(cli.flags.assetFileName))

		let cnt = 0
		let allCnt = 0
		for await ( const res of Reader.validateLevels(filePath, cli.flags.debug) ) {
			cnt += res ? 1 : 0
			allCnt += 1
		}
		process.stdout.write(`In ${filePath}:\n Of ` + allCnt + ' lines, ' + cnt + ' are safe.\n')
	}
} catch (err) {
	const e = err as NodeJS.ErrnoException

	if (e && (e.code === 'ENOENT' || e.code === 'EACCES')) {
		process.exitCode = 2
		printError(`Error: cannot read input file (${e.code}).`)
		if (cli.flags.debug) printError(String(e.stack || e.message || e))
	} else {
		process.exitCode = 1
		printError('Unexpected failure: ' + String(e))
		if (cli.flags.debug) printError(String((e as Error).stack || e))
	}
}
