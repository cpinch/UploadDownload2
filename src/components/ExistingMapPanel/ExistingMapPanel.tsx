import { useState } from 'react'
import "./ExistingMapPanel.css"

import ImageService from '../../services/ImageService.tsx'
import ZoomedMapPanel from '../ZoomedMapPanel/ZoomedMapPanel.tsx'

function ExistingMapPanel(props: {url: string, filename: string, tags: string, closeCallback: Function, updateCallback: Function, reloadTagsCallback: Function}) {
	const [zoomed, setZoomed] = useState<boolean>(false)
	const [filename, setFilename] = useState<string>(props.filename)
	const [tags, setTags] = useState<string>(props.tags)
	
	
	function copyToProjector(filename: string): void {
		ImageService.copyToProjector(filename)
			.then(() => props.updateCallback())
			.then(() => props.closeCallback())
	}
		
	return (
		<div className="map-panel">
			<img onClick={() => setZoomed(true)} src={props.url} />
			<button type="submit" onClick={() => copyToProjector(filename)}>Copy to Projector</button>
			{ zoomed && <ZoomedMapPanel 
							url={props.url} 
							filename={filename} 
							tags={tags} 
							updateFilenameCallback={(filename: string) => setFilename(filename)}
							updateTagsCallback={(tags: string) => {setTags(tags); props.reloadTagsCallback()}}
							zoomOutCallback={() => setZoomed(false)}
						/>
			}
		</div>
	);
}

export default ExistingMapPanel