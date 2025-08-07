import { serverURL } from './ServerURL.ts'

class ImageService {	
	static loadImagesFromFolder(folder: string): Promise<{url: string, filename: string, tags: string}[]> {
		return fetch(serverURL+"/getImages"+folder)
			.then((response) => response.json())
			.catch(() => {
				console.error("Failed to load images from "+folder);
				return Promise.resolve([])
			})
	}
	
	static uploadImage(folder: string, file: File): Promise<void | Response> {
		const formData = new FormData()
		formData.append('file', file)

		return fetch(serverURL+"/upload"+folder, {method: 'POST', body: formData})
			.catch(() => {
				console.error("Error while uploading file to server");
			})
	}
	
	static copyToProjector(filename: string): Promise<void | Response> {
		return fetch(serverURL+"/copyToProjector/"+filename, {method: 'POST'})
			.catch(() => {
				console.error("Failed to copy image to projector")
				return Promise.resolve()
			})
	}
	
	static deleteImage(folder: string, filename: string): Promise<void | Response> {
		return fetch(serverURL+"/delete"+folder + "/"+filename, {method: 'POST'})
			.catch(() => {
				console.error("Failed to delete image "+filename+" from "+folder)
				return Promise.resolve()
			})
	}
	
	static clearFolder(folder: string): Promise<void | Response> {
		return fetch(serverURL+"/clear"+folder, {method: 'POST'})
			.catch(() => {
				console.error("Failed to clear folder "+folder)
				return Promise.resolve()
			})
	}
	
	static updateFilename(oldFn: string, newFn: string): Promise<boolean> {
		return fetch(serverURL+"/updateFilename/"+oldFn+"/"+newFn, {method: 'POST'})
			.then((response) => {
				if (response.status === 200) {
					return true
				} else {
					console.error("Failed to update map filename from "+oldFn+" to "+newFn)
					return false	
				}
			})
			.catch(() => {
				console.error("Failed to update map filename from "+oldFn+" to "+newFn)
				return Promise.resolve(false)
			})
	}

	static updateTags(filename: string, tags: string): Promise<boolean> {
		return fetch(serverURL+"/updateTags/"+filename, {method: 'POST', body: tags})
			.then((response) => {
				if (response.status === 200) {
					return true
				} else {
					console.error("Failed to update tags for "+filename+" to "+tags)
					return false	
				}
			})
			.catch(() => {
				console.error("Failed to update tags for "+filename+" to "+tags)
				return Promise.resolve(false)
			})
	}
	
	static loadUniqueMapTags(): Promise<string[]> {
		return fetch(serverURL+"/uniqueTags")
			.then((response) => response.json())
			.catch(() => {
				console.error("Failed to load map tags list");
				return Promise.resolve([])
			})
	}
}

export default ImageService