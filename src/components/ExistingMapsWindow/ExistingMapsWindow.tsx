import { useState, useEffect } from 'react'
import "./ExistingMapsWindow.css"

import ImageUploader from '../ImageUploader/ImageUploader.tsx'
import ExistingMapPanel from '../ExistingMapPanel/ExistingMapPanel.tsx'
import Spinner from '../Spinner/Spinner.tsx'
import CloseButton from '../CloseButton/CloseButton.tsx'
import FileFilter from '../FileFilter/FileFilter.tsx'
import ImageService from '../../services/ImageService.tsx'

function ExistingMapsWindow(props: {closeCallback: Function, updateCallback: Function}) {
	const [imgs, setImgs] = useState<{url: string, filename: string, tags: string}[] | null>(null)
	const [displayImgs, setDisplayImgs] = useState<{url: string, filename: string, tags: string}[] | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [tags, setTags] = useState<string[]>([])
	
	useEffect(() => {
		loadMaps()
		loadTags()
	}, [])
	
	function setupImages(imgs: {url: string, filename: string, tags: string}[]): void {
		setImgs(imgs)
		setDisplayImgs(imgs)
	}
	
	function loadMaps(): void {
		setLoading(true)
		ImageService.loadImagesFromFolder("/maps")
			.then((responseJson: {url: string, filename: string, tags: string}[]) => setupImages(responseJson))
			.then(() => setLoading(false))
	}
	
	function loadTags(): void {
		ImageService.loadUniqueMapTags()
			.then((response: string[]) => setTags(response))
	}
	
	function filterMaps(filterFn: String, filterTags: string[]): void {
		if (imgs) {
			setDisplayImgs(imgs
				.filter((img) => img.filename.toLowerCase().includes(filterFn.toLowerCase()))
				.filter((img) => filterTags.every((tag) => img.tags.includes(tag))))
		}		
	}
		
	return (
		<div className="map-window">
			<CloseButton closeCallback={props.closeCallback} />
			<div className="window-header">
				<h2 className="window-title">Available Maps</h2>
				<ImageUploader folder="/maps" updateCallback={() => loadMaps()} />
			</div>
			<FileFilter tags={tags} updateCallback={filterMaps} />
			{loading && <Spinner />}
			{ displayImgs && 
				<div className="panels-area">
					{ displayImgs.map((img, index) => <ExistingMapPanel 
															key={index} 
															url={img.url} 
															filename={img.filename} 
															tags={img.tags} 
															closeCallback={props.closeCallback} 
															updateCallback={props.updateCallback} 
															reloadTagsCallback={loadTags}
														/>) }
				</div>	
			}
		</div>
	)
}

export default ExistingMapsWindow