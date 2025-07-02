import React, { useState, useRef } from 'react'
import "./ExistingMapPanel.css"

import ImageService from '../../services/ImageService.tsx'
import { useOutsideAlerter } from '../../hooks/OutsideAlerter.tsx'
import CloseButton from '../CloseButton/CloseButton.tsx'

// TODO - might be worth splitting out the zoom view into its own component
function ExistingMapPanel(props: {url: string, filename: string, tags: string, closeCallback: Function, updateCallback: Function}) {
	const [zoomed, setZoomed] = useState<boolean>(false)
	const [filename, setFilename] = useState<string>(props.filename)
	const [displayFn, setDisplayFn] = useState<string>(props.filename.split('.').slice(0, -1).join('.'))
	const ext = '.' + props.filename.split('.').pop()
	const [tags, setTags] = useState<string>(props.tags)
	const [displayTags, setDisplayTags] = useState<string>(props.tags)
	
	const zoomRef = useRef<HTMLDivElement>(null)
	useOutsideAlerter(zoomRef, () => setZoomed(false))
	
	function copyToProjector(filename: string): void {
		ImageService.copyToProjector(filename)
			.then(() => props.updateCallback())
			.then(() => props.closeCallback())
	}
	
	function updateFilename(newFn: string): void {
		const cleanNewFn = newFn.replace(/[^a-zA-Z0-9 ,]/g, "")
		setDisplayFn(cleanNewFn)
	}
	
	function sendFilenameUpdate(event: React.KeyboardEvent<HTMLInputElement>): void {
		if (event.key === 'Enter' && filename != displayFn+ext) {
			ImageService.updateFilename(filename, displayFn+ext)
				.then((success) => {
					if (success) {
						setFilename(displayFn+ext)
					} else {
						setDisplayFn(filename.split('.').slice(0, -1).join('.'))
					}
				})
		}		
	}

	function updateTags(newTags: string): void {
		const cleanNewTags = newTags.replace(/[^a-zA-Z0-9 ,]/g, "")
		setDisplayTags(cleanNewTags)
	}
	
	function sendTagsUpdate(event: React.KeyboardEvent<HTMLInputElement>): void {
		if (event.key === 'Enter' && tags != displayTags) {
			ImageService.updateTags(filename, displayTags)
				.then((success) => {
					if (success) {
						setTags(displayTags)
					} else {
						setDisplayTags(tags)
					}
				})
		}		
	}
	
	function zoomedView() {
		return (
			<div className="zoomed-map" ref={zoomRef}>
				<div className="zoomed-header">
					<input id="filename-input" className="filename" value={displayFn} onChange={(e) => updateFilename(e.target.value)} onKeyDown={(e) => sendFilenameUpdate(e)} />
					<CloseButton closeCallback={() => setZoomed(false)} />
				</div>
				<img src={props.url} />
				<div className="zoomed-footer">
					<label htmlFor="tags-input">Tags: </label>
					<input id="tags-input" className="tags" value={displayTags} onChange={(e) => updateTags(e.target.value)} onKeyDown={(e) => sendTagsUpdate(e)} />
					<button type="submit" onClick={() => copyToProjector(filename)}>Copy to Projector</button>
				</div>
			</div>
		)
	}
	
	return (
		<div className="map-panel">
			{!zoomed && <>
				<img onClick={() => setZoomed(true)} src={props.url} />
				<button type="submit" onClick={() => copyToProjector(filename)}>Copy to Projector</button>
			</>}
			{zoomed && zoomedView()}
		</div>
	);
}

export default ExistingMapPanel