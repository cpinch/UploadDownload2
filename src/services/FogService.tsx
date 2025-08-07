import { serverURL } from './ServerURL.ts'

class FogService {
	static getFogState(): Promise<{enabled: boolean}> {
		return fetch(serverURL+"/fog")
			.then((response) => response.json())
			.catch(() => {
				console.error("Failed to load fog state")
				return {enabled: false}			  
			})
	}
	
	static updateFogState(data: {enabled?: boolean}): Promise<boolean> {
		return fetch(serverURL+"/fog", {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
			})
			.then((response) => {
				if (response.status === 200) {
					return true
				} else {
					console.error("Failed to update fog state")
					return false
				}
			})
			.catch(() => {
				console.error("Failed to update fog state")
				return false
			})
	}
}

export default FogService