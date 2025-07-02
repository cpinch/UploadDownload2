import { useState, useEffect, useRef } from 'react'
import "./GridConfigurationWindow.css"

import CloseButton from '../CloseButton/CloseButton.tsx'
import GridService from '../../services/GridService.tsx'
import { useOutsideAlerter } from '../../hooks/OutsideAlerter.tsx'

function GridConfigurationWindow(props: { closeCallback: Function }) {
	// Color is managed internally by the colorpicker because we can't use the standard react tools for it
	// See the comment in useEffect for more information on this
	const [hex, setHex] = useState<boolean>(false)
	const [hexV, setHexV] = useState<boolean>(true)

	const thisRef = useRef<HTMLDivElement>(null)
	useOutsideAlerter(thisRef, props.closeCallback)
	
	function setDisplayColor(color: string): void {
		let el = document.getElementById('grid-color')
		if (el) {
			(el as HTMLInputElement).value = color
		}
	}
	
	function setInitialGridState(json: {color: string, hex: boolean, hexV: boolean}): void {
		setHex(json.hex)
		setHexV(json.hexV)
		setDisplayColor(json.color)
	}
	
	let evAdded = false
	
	useEffect(() => {
		GridService.getGridState()
			.then((responseJson) => setInitialGridState(responseJson))
		
		// This is ugly but it's the only way I can find to cleanly and easily get the behavior I want
		// The issue is that the standard react behavior for an html input element is to fire onChange at the same rate
		//   as onInput, ie everytime the user changes the color in the color picker popup
		// I want the "standard" (in most browsers at least) non-react javascript behavior to fire onInput for each change
		//   but only fire onChange when the color picker popup is confirmed and closed
		// Making the colorpicker an unmanaged element and using standard js event listeners and such gets me this behavior
		//   but it is really strange to have in the same area as react managed inputs. But, at the end of the day, it works
		
		// (the alternative would be finding and using a full react colorpicker component with more options, but for a single
		//   minor function like this that feels like massive overkill)
		if (!evAdded) {
			let el = document.getElementById('grid-color')
			if (el) {
				el.addEventListener('change', (e) => setGridColor((e.target as HTMLInputElement).value))
				evAdded = true
			}
		}
	}, [])
	
	function setGridColor(color: string): void {
		GridService.updateGridState({"color": color})
			.then((success) => {
				if (!success) {
					setDisplayColor("#000000")
				}
			})		
	}
			
	function setGridHex(hex: boolean): void {
		GridService.updateGridState({"hex": hex})
			.then((success) => {
				if (success) {
					setHex(hex)
				}
			})
	}
	
	function setGridHexV(hexV: boolean): void {
		GridService.updateGridState({"hexV": hexV})
			.then((success) => {
				if (success) {
					setHexV(hexV)
				}
			})
	}
	
	return (
	    <div className="grid-window" ref={thisRef}>
			<h3>Grid Configuration Options:</h3>
			<CloseButton closeCallback={props.closeCallback} />
			<div className="grid-options">
				<span>
					<label htmlFor="grid-color">Color</label>
					<input type="color" id="grid-color" />
				</span>
				<span>
					<label htmlFor="grid-sqr">Grid</label>
					<input type="radio" id="grid-sqr" name="grid-type" value="" onChange={() => setGridHex(false) } checked={!hex} />
					<label htmlFor="grid-hex">Hex</label>
					<input type="radio" id="grid-hex" name="grid-type" value="" onChange={() => setGridHex(true) } checked={hex} />
				</span>
				{ hex && <span>
					<label htmlFor="hex-cent">Center Hexes</label>
					<input type="radio" id="hex-cent" name="hex-vert" value="" onChange={() => setGridHexV(true) } checked={hexV} />
					<label htmlFor="hex-edge">Left Align Hexes</label>
					<input type="radio" id="hex-edge" name="hex-vert" value="" onChange={() => setGridHexV(false) } checked={!hexV} />
				</span>}
			</div>
		</div>
	);
}

export default GridConfigurationWindow