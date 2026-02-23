import meow from 'meow'

/**
 * CLI definition
 **/
export const defaultFileName = 'default.txt'
export const defaultGenerateFileName = 'generated.txt'

export const cli = meow(
	`
	Usage
	  $ npm start -- [input]

	Options
	  --generate, -g       generate a new input file
	  --lines, -l          number of lines to generate (default: 10)
	  --numbers, -n        number of numbers per line (default: 10)
	  --assetFileName, -a  name of the file in assets folder (default: generated.txt)
	  --debug, -d          show error stack trace`,
	{
		importMeta : import.meta,
		flags :      {
			generate :      {
				type :      'boolean',
				shortFlag : 'g',
				default :   false,
			},
			lines :         {
				type :      'number',
				shortFlag : 'l',
				default :   10,
			},
			numbers :       {
				type :      'number',
				shortFlag : 'n',
				default :   10,
			},
			assetFileName : {
				type :       'string',
				shortFlag :  'a',
				isMultiple : false,
				default :    defaultFileName,
			},
			debug :         {
				type :      'boolean',
				shortFlag : 'd',
				default :   false,
			},
		},
	},
)
