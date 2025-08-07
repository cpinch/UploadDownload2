import React, { useState, useRef } from 'react';
import "./ImageUploader.css"

import ImageService from '../../services/ImageService.tsx'

function ImageUploader(props: {folder: string, updateCallback: () => void}) {
	const [file, setFile] = useState<File | null>(null)
	const [status, setStatus] = useState<string>('initial')
	const fileInput = useRef<HTMLInputElement>(null)

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			setStatus('initial')
			setFile(e.target.files[0])
		}
	}
	
	function reset() {
		setFile(null)
		if (fileInput && fileInput.current) {
			fileInput.current.value = ""			
		}
	}

	function handleUpload() {
		if (file) {
			setStatus('uploading')
			ImageService.uploadImage(props.folder, file)
				.then((result) => {
					if (result?.status === 200) {
						setStatus('success')
						props.updateCallback()
						reset()		
						setTimeout(() => setStatus('initial'), 2000)
					} else if (result?.status === 400) {
						setStatus('invalid')					
					} else {
						setStatus('fail')
					}
			})
		}
	}
	
	return (
		<>
			<div className="upload-area">
				<input id="file" type="file" role="input" onChange={handleFileChange} accept="image/*" ref={fileInput} />
				{ file && <button onClick={handleUpload} className="submit">Upload</button> }
				<Result status={status} />
			</div>
		</>
	)
}

function Result(props: {status: string}) {
	switch (props.status) {
		case 'success':
			return <div id="result">✅</div>
		case 'fail':
			return <div id="result">❌ File upload failed</div>
		case 'uploading':
			return <div id="result">⏳</div>
		case 'invalid':
			return <div id="result">❌ Invalid File Type</div>
		default:
			return null					
	}
}

export default ImageUploader