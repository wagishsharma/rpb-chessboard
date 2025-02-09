/******************************************************************************
 *                                                                            *
 *    This file is part of RPB Chessboard, a WordPress plugin.                *
 *    Copyright (C) 2013-2022  Yoann Le Montagner <yo35 -at- melix.net>       *
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


import './public-path';
import './NavigationFrame.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Chessboard } from 'kokopu-react';


/**
 * DOM node on which the board is rendered.
 */
let boardAnchor = false;


/**
 * Settings to use to build the popup board.
 */
let boardOptions = false;


/**
 * Chessgame instance that is currently displaying something in the popup.
 */
let currentOwner = false;


/**
 * To be used to handle dialog resize.
 */
let resizeInfo = false;


/**
 * Lazy frame builder.
 */
function buildFrame() {
	if (boardAnchor) {
		return;
	}

	// Initialize the default options.
	boardOptions = {
		squareSize: RPBChessboard.defaultSettings.nboSquareSize,
		coordinateVisible: RPBChessboard.defaultSettings.nboCoordinateVisible,
		colorset: RPBChessboard.defaultSettings.nboColorset,
		pieceset: RPBChessboard.defaultSettings.nboPieceset,
		animated: RPBChessboard.defaultSettings.animated,
		moveArrowVisible: RPBChessboard.defaultSettings.moveArrowVisible,
		moveArrowColor: RPBChessboard.defaultSettings.moveArrowColor,
	};

	// Build the dialog skeleton
	let navigationFrame = document.createElement('div');
	navigationFrame.id = 'rpbchessboard-navigationFrame';
	boardAnchor = document.createElement('div');
	navigationFrame.appendChild(boardAnchor);

	// Create the dialog widget.
	let $ = window.jQuery;
	$('body').append(navigationFrame);
	$('#rpbchessboard-navigationFrame').dialog({

		/* Hack to keep the dialog draggable after the page has being scrolled. */
		create     : evt => $(evt.target).parent().css('position', 'fixed'),
		resizeStart: evt => $(evt.target).parent().css('position', 'fixed'),
		resizeStop : evt => $(evt.target).parent().css('position', 'fixed'),
		/* End of hack */

		autoOpen: false,
		dialogClass: 'wp-dialog',
		width: 'auto',
		close: () => {
			if (currentOwner) {
				currentOwner.handleMoveSelected(undefined, 'external');
			}
		},
	});

	// Handle dialog resize.
	$('#rpbchessboard-navigationFrame').on('dialogresize', (evt, ui) => {

		// Save the initial information about the geometry of the board and its container.
		if(!resizeInfo) {
			let boardSize = Chessboard.size(boardOptions.squareSize, boardOptions.coordinateVisible);
			resizeInfo = {
				reservedWidth: ui.originalSize.width - boardSize.width,
				reservedHeight: ui.originalSize.height - boardSize.height,
			};
		}

		// Compute the new square size parameter.
		let availableWidth = ui.size.width - resizeInfo.reservedWidth;
		let availableHeight = ui.size.height - resizeInfo.reservedHeight;
		let squareSize = Chessboard.adaptSquareSize(availableWidth, availableHeight, boardOptions.coordinateVisible);

		// Update the widget.
		boardOptions = { ...boardOptions };
		boardOptions.squareSize = squareSize;
		currentOwner.setState({ popupBoardOptions: boardOptions });
	});

	// Handle the focus.
	function focusOwner() {
		if (currentOwner) {
			currentOwner.focus();
		}
	}
	$('#rpbchessboard-navigationFrame').on('dialogopen', focusOwner);
	$('#rpbchessboard-navigationFrame').on('dialogdragstop', focusOwner);
	$('#rpbchessboard-navigationFrame').on('dialogresizestop', focusOwner);
}


/**
 * Make the popup frame visible (assuming it has been built beforehand).
 */
function openFrame() {
	let $ = window.jQuery;
	let navigationFrame = $('#rpbchessboard-navigationFrame');
	if (!navigationFrame.dialog('isOpen')) {
		navigationFrame.dialog('option', 'position', { my: 'center', at: 'center', of: window });
		navigationFrame.dialog('open');
	}
}


/**
 * Hide the popup frame (if it exists).
 */
function closeFrame() {
	if (!boardAnchor) {
		return;
	}
	let $ = window.jQuery;
	$('#rpbchessboard-navigationFrame').dialog('close');
}


/**
 * Set the popup frame title (if it exists).
 */
function setFrameTitle(text) {
	if (!boardAnchor) {
		return;
	}
	let $ = window.jQuery;
	let titleRoot = $('.ui-dialog-title', $('#rpbchessboard-navigationFrame').closest('.ui-dialog')).get(0);
	ReactDOM.render(<span>{text}</span>, titleRoot);
}


export function showPopupFrame(owner) {
	buildFrame();
	if (currentOwner && currentOwner !== owner) {
		currentOwner.handleMoveSelected(undefined, 'external');
	}
	currentOwner = owner;
	openFrame();
	return {
		anchor: boardAnchor,
		boardOptions: boardOptions,
		setTitle: text => setFrameTitle(text),
	};
}


export function hidePopupFrame(owner) {
	if (currentOwner === owner) {
		currentOwner = false;
		closeFrame();
	}
}
