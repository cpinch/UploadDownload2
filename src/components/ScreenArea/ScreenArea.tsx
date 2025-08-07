import { useState, useEffect } from 'react';
import "./ScreenArea.css"

import ImageUploader from '../ImageUploader/ImageUploader.tsx'
import ImageDisplayer from '../ImageDisplayer/ImageDisplayer.tsx'
import ImageService from '../../services/ImageService.tsx'

function ScreenArea() {
	const [imgs, setImgs] = useState<{url: string, filename: string}[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	
	useEffect(() => {
		loadFiles()
	}, [])

	function loadFiles() {
		setLoading(true)
		ImageService.loadImagesFromFolder("/screen")
			.then((responseJson: {url: string, filename: string}[]) => setImgs(responseJson))
			.then(() => setLoading(false))
	}

	function clearAll() {
		ImageService.clearFolder("/screen")
			.then(() => loadFiles())
	}

	return (
		<div className="screen-area">
			<h2>Screen</h2>
			<ImageUploader folder="/screen" updateCallback={() => loadFiles()} />
			<ImageDisplayer folder="/screen" loading={loading} imgs={imgs} updateCallback={() => loadFiles()} />
			{imgs && imgs.length > 0 && <button onClick={() => clearAll()} className="submit">Clear Screen</button>}
		</div>
	)
}

export default ScreenArea