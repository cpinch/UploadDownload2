import { useState, useRef } from 'react'
import "./ZoomedMapPanel.css"

import ImageService from '../../services/ImageService.tsx'
import { useOutsideAlerter } from '../../hooks/OutsideAlerter.tsx'
import CloseButton from '../CloseButton/CloseButton.tsx'

function ZoomedMapPanel(props: {url: string, filename: string, tags: string, updateFilenameCallback: Function, updateTagsCallback: Function, zoomOutCallback: Function}) {
	const [displayFn, setDisplayFn] = useState<string>(props.filename.split('.').slice(0, -1).join('.'))
	const ext = '.' + props.filename.split('.').pop()
	const [displayTags, setDisplayTags] = useState<string>(props.tags)
	
	const thisRef = useRef<HTMLDivElement>(null)
	useOutsideAlerter(thisRef, () => props.zoomOutCallback(false))
	
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
			ImageService.updateTags(props.filename, displayTags)
				.then((success) => {
					if (success) {
						props.updateTagsCallback(displayTags)
					} else {
						setDisplayTags(props.tags)
					}
				})
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