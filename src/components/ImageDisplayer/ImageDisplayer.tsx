import "./ImageDisplayer.css"

import Spinner from '../Spinner/Spinner.tsx'
import ImageService from '../../services/ImageService.tsx'

function ImageDisplayer(props: {folder: string, loading: boolean, imgs: {url: string, filename: string}[], updateCallback: Function}) {	
	function deleteImage(filename: string) {
		ImageService.deleteImage(props.folder, filename)
			.then(() => props.updateCallback())
	}
	
	function getImageComponent(img: {url: string, filename: string}, index: number) {
		return (
			<div className="image-panel" key={index}>
				<img className="display-image" src={img.url} />
				<button onClick={() => deleteImage(img.filename)} className="submit">Delete Image</button>
			</div>
		)
	}
	
	return (
	  <>
	    <div className="image-area">
			{props.loading && <Spinner />}
			{!props.loading && props.imgs && props.imgs.length > 0 && props.imgs.map((img, index) => getImageComponent(img, index))}
		</div>
	  </>
	)
}

export default ImageDisplayer