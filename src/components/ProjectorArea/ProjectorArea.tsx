import { useState, useEffect } from 'react'
import "./ProjectorArea.css"

import ImageUploader from '../ImageUploader/ImageUploader.tsx'
import ImageDisplayer from '../ImageDisplayer/ImageDisplayer.tsx'
import ImageService from '../../services/ImageService.tsx'
import ExistingMapButton from '../ExistingMapButton/ExistingMapButton.tsx'
import GridConfigurer from '../GridConfigurer/GridConfigurer.tsx'

function ProjectorArea() {
	const [imgs, setImgs] = useState<{url: string, filename: string}[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	
	useEffect(() => {
		loadFiles()
	}, [])
	
	function loadFiles() {
		setLoading(true)
		ImageService.loadImagesFromFolder("/projector")
			.then((responseJson: {url: string, filename: string}[]) => setImgs(responseJson))
			.then(() => setLoading(false))
	}
	
	function clearAll() {
		ImageService.clearFolder("/projector")
			.then(() => loadFiles())
	}

	return (
    <div className="projector-area">
		<h2>Projector</h2>
		<GridConfigurer />
		<ImageUploader folder="/projector" updateCallback={() => loadFiles()} />
		<ImageDisplayer folder="/projector" loading={loading} imgs={imgs} updateCallback={() => loadFiles()} />
		<ExistingMapButton updateCallback={() => loadFiles()} />
		{imgs && imgs.length > 0 && <button onClick={() => clearAll()} className="submit">Clear Projector</button>}
	</div>
	);
}

export default ProjectorArea