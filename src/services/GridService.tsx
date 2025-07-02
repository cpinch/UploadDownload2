import { serverURL } from './ServerURL.ts'

class GridService {
	static getGridState(): Promise<{enabled: boolean, color: string, hex: boolean, hexV: boolean}> {
		return fetch(serverURL+"/grid")
			.then((response) => response.json())
			.catch(() => {
			  console.error("Failed to load grid state")
			  return {enabled: false, color: "#000000", hex: false, hexV: false}			  
			})
	}
	
	static updateGridState(data: {enabled?: boolean, color?: string, hex?: boolean, hexV?: boolean}): Promise<boolean> {
		return fetch(serverURL+"/grid", {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
			})
			.then((response) => {
				if (response.status === 200) {
					return true
				} else {
					console.error("Failed to update grid state")
					return false
				}
			})
			.catch(() => {
				console.error("Failed to update grid state")
				return false
			})
	}
}

export default GridService