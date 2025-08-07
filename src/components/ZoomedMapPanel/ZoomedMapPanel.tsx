import { useState, useRef } from 'react'
import "./ZoomedMapPanel.css"

import ImageService from '../../services/ImageService.tsx'
import { useOutsideAlerter } from '../../hooks/OutsideAlerter.tsx'
import CloseButton from '../CloseButton/CloseButton.tsx'

function ZoomedMapPanel(props: {url: string, filename: string, tags: string, updateFilenameCallback: (filename: string) => void, 
				updateTagsCallback: (tags: string) => void, zoomOutCallback: () => void}) {
	const [displayFn, setDisplayFn] = useState<string>(props.filename.split('.').slice(0, -1).join('.'))
	const ext = '.' + props.filename.split('.').pop()
	const [displayTags, setDisplayTags] = useState<string>(props.tags)
	
	const thisRef = useRef<HTMLDivElement>(null)
	useOutsideAlerter(thisRef, () => props.zoomOutCallback())
	
	function updateFilename(newFn: string): void {
		const cleanNewFn = newFn.replace(/[^a-zA-Z0-9 ,'-_]/g, "")
		setDisplayFn(cleanNewFn)
	}
	
	function sendFilenameUpdate(event: React.KeyboardEvent<HTMLInputElement>): void {
		if (event.key === 'Enter' && props.filename != displayFn+ext) {
			ImageService.updateFilename(props.filename, displayFn+ext)
				.then((success) => {
					if (success) {
						props.updateFilenameCallback(displayFn+ext)
					} else {
						setDisplayFn(props.filename.split('.').slice(0, -1).join('.'))
					}
				})
		}		
	}

	function updateTags(newTags: string): void {
		const cleanNewTags = newTags.replace(/[^a-zA-Z0-9 ,'-_]/g, "")
		setDisplayTags(cleanNewTags)
	}
	
	function sendTagsUpdate(event: React.KeyboardEvent<HTMLInputElement>): void {
		if (event.key === 'Enter' && props.tags != displayTags) {
			// Removes the reserved tag "none" from the list and changes any sequence of multiple commas 
			//	with nothing but whitespace between them into a single comma
			const cleanTags = displayTags.replace("none", "").replace(/,\s*,/g, ",")
			if (cleanTags === "," || props.tags === cleanTags) {
				setDisplayTags("")
			} else {
				ImageService.updateTags(props.filename, cleanTags)
					.then((success) => {
						if (success) {
							setDisplayTags(cleanTags)
							props.updateTagsCallback(cleanTags)
						} else {
							setDisplayTags(props.tags)
						}
					})
			}
		}		
	}
	
	return (
		<div className="zoomed-map" ref={thisRef}>
			<div className="zoomed-header">
				<input id="filename-input" className="filename" value={displayFn} onChange={(e) => updateFilename(e.target.value)} onKeyDown={(e) => sendFilenameUpdate(e)} />
				<CloseButton closeCallback={props.zoomOutCallback} />
			</div>
			<img src={props.url} />
			<div className="zoomed-footer">
				<label htmlFor="tags-input">Tags: </label>
				<input id="tags-input" className="tags" value={displayTags} onChange={(e) => updateTags(e.target.value)} onKeyDown={(e) => sendTagsUpdate(e)} />
			</div>
		</div>
	)
}

export default ZoomedMapPanel