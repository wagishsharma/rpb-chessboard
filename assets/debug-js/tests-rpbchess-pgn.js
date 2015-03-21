/******************************************************************************
 *                                                                            *
 *    This file is part of RPB Chessboard, a WordPress plugin.                *
 *    Copyright (C) 2013-2015  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    This program is free software: you can redistribute it and/or modify    *
 *    it under the terms of the GNU General Public License as published by    *
 *    the Free Software Foundation, either version 3 of the License, or       *
 *    (at your option) any later version.                                     *
 *                                                                            *
 *    This program is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the           *
 *    GNU General Public License for more details.                            *
 *                                                                            *
 *    You should have received a copy of the GNU General Public License       *
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.   *
 *                                                                            *
 ******************************************************************************/


/* jshint unused:false */
/* jshint globalstrict:true */
'use strict';

/* global RPBChess */
/* global dumpPGNItem */
/* global test */
/* global testError */
/* global registerTest */
/* global registerTests */



// -----------------------------------------------------------------------------
// PGN samples
// -----------------------------------------------------------------------------

var pgns = [];

pgns.push({
	label: '1',
	pgn:
		'[White "Player 1"]\n' +
		'[Black "Player 2"]\n' +
		'[Result "*"]\n' +
		'*',
	dump: '\n' +
		'Black = {Player 2}\n' +
		'Result = {*}\n' +
		'White = {Player 1}\n' +
		'{*}\n'
});



// -----------------------------------------------------------------------------
// Parsing
// -----------------------------------------------------------------------------

registerTests('rpbchess.pgn.parse', pgns, function(scenario) {
	test('Parse PGN ' + scenario.label, function() {
		var pgnItem = RPBChess.pgn.parseOne(scenario.pgn);
		return dumpPGNItem(pgnItem);
	}, scenario.dump);
});
