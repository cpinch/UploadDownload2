import { useState, useEffect, useRef } from 'react'
import "./ExistingMapsWindow.css"

import ImageUploader from '../ImageUploader/ImageUploader.tsx'
import ExistingMapPanel from '../ExistingMapPanel/ExistingMapPanel.tsx'
import Spinner from '../Spinner/Spinner.tsx'
import CloseButton from '../CloseButton/CloseButton.tsx'
import FileFilter from '../FileFilter/FileFilter.tsx'
import ImageService from '../../services/ImageService.tsx'
import { useOutsideAlerter } from '../../hooks/OutsideAlerter.tsx'

function ExistingMapsWindow(props: {closeCallback: () => void, updateCallback: () => void}) {
	const [imgs, setImgs] = useState<{url: string, filename: string, tags: string}[] | null>(null)
	const [displayImgs, setDisplayImgs] = useState<{url: string, filename: string, tags: string}[] | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [tags, setTags] = useState<string[]>([])

	const thisRef = useRef<HTMLDivElement>(null)
	useOutsideAlerter(thisRef, props.closeCallback)
	
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
	
	function filterMaps(filterFn: string, filterTags: string[]): void {
		if (imgs) {
			if (filterTags.length === 1 && filterTags[0] === "none") {
				setDisplayImgs(imgs
					.filter((img) => img.filename.toLowerCase().includes(filterFn.toLowerCase()))
					.filter((img) => img.tags.length === 0))
			} else {
				setDisplayImgs(imgs
					.filter((img) => img.filename.toLowerCase().includes(filterFn.toLowerCase()))
					.filter((img) => filterTags.every((tag) => img.tags.includes(tag))))
			}
		}		
	}
		
	return (
		<div className="map-window" ref={thisRef}>
			<CloseButton closeCallback={props.closeCallback} />
			<div className="window-header">
				<h2 className="window-title">Available Maps</h2>
				<ImageUploader folder="/maps" updateCallback={() => loadMaps()} />
			</div>
			<FileFilter tags={[...tags, "none"]} updateCallback={filterMaps} />
			{loading && <Spinner />}
			{ displayImgs && 
				<div className="panels-area">
					{ displayImgs.map((img) => <ExistingMapPanel 
															key={img.url} 
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