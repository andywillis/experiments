// Dependancies
var fs = require( 'fs' )
	,	core = require( 'core' )
	,	color = require( 'colors' )	
	;


;(function main(){
	
	var commonWords = fs.readFileSync( 'words.txt', 'ascii' )
		,	exceptions = ['parrish']
		,	workingData = fs.readFileSync( 'mjb.txt', 'ascii' )
		,	dataArray
		,	chartObject
		;

	core.clear();
	dataArray = processWorkingData( commonWords, workingData );
	chartObject = createChartObject( dataArray );
	createConsoleChart( chartObject );

}());

/**
 * @param {string} workingData The raw data
 * @return {array} dataArray A non-deduped array of words seven letters or over
 * @author Andy Willis
 */

function processWorkingData( commonWords, workingData ) {

	var dataArray
		,	rePunctuation = /[\n\t.,:<>!£$%^&*\(\)\-\=\+\[\];@#\?\|0-9]/g
		,	reCommon = new RegExp( '\\b(?:'+ getCommon( commonWords ) + ')\\b', 'gi' )
		
	return dataArray = workingData
			.toLowerCase()
			.replace( rePunctuation, ' ' )
			.replace( /[\/"']/g, ' ' )
			.replace( /\r/g, ' ' )
			.replace( reCommon, '' )
			.replace( /\b[a-z]{1,6}\b/g, '' )
			.replace( /(?:\s{2,})/g, ' ' )
			.trim()
			.split( ' ' )
			.sort()
			;

};

/**
 * @param {string} commonWords A list of commonwords
 * @return {string} formattedWords The list of commonWords formatted for use
 * @author Andy Willis
 */

function getCommon( commonWords ) {
	
	var numbers
		, formattedWords
		;

	numbers = /[\t0-9 ]*/g;

	return formattedWords = commonWords
		.replace( numbers, '' )
		.split( '\r\n' )
		.sort()
		.join( '|' )
		;

}

/**
 * @param {array} dataArray A non-deduped array of words seven letters or over
 * @return {object} chartObject An object containing word frequency data
 * @author Andy Willis
 */

function createChartObject( dataArray ) {

	var chartObject = {}
		,	index = 0
		,	arrLen = dataArray.length
		;

	for( element in dataArray ) {
		chartObject[ dataArray[ element ] ] = 1
	};

	while( index < arrLen ) {

		if ( dataArray[ index ] === dataArray[ index + 1 ] ) {
			chartObject[ dataArray[ index ] ] ++;
			dataArray.splice( index + 1, 1 );
			arrLen --;
		} else {
			index ++;
		};

	};

	for ( key in chartObject ) {
		if ( chartObject[ key ] === 1 ) {
			delete chartObject[ key ];
		};
	};

	return chartObject;

};

function createConsoleChart( chartObject ) {

	Object.prototype.values = function( object ) {
		var values = [];
		for ( key in object ) {
			values.push( object[ key ] )
		}
		return values
	}

	Object.defineProperty( Object.prototype, 'values', { enumerable: false } )

	var index = 0
		,	labels = Object.keys( chartObject )
		,	values = Object.values( chartObject )
		,	xLen = labels.length
		,	yLen = Math.max.apply( null, values )
		,	labelLengths = labels.map( function( label ) { return label.length; } )
		,	maxLabelSize = Math.max.apply( null, labelLengths )
		,	labelRow = yLen - 1
		, fill = function( str, num ) { var padding = new Array( num ).join( str ); return padding;	}
		;

	for ( label in labels ) {
		var thisLabel = labels[ label ]
			,	thisLabelLen = thisLabel.length
			,	diff = maxLabelSize - thisLabelLen
			, paddingRequired = ( diff === 0 ) ? false : true
			,	outLabels = ''
			,	line = '{outLabels} {data}'
			;

		outLabels = ( paddingRequired ) ? fill( ' ', diff + 1 ) + thisLabel : thisLabel;
		data = fill('O', values[ label ])
		line = line
			.replace( '{outLabels}', outLabels )
			.replace( '{data}', data.green )

		console.log( line );

	}

};