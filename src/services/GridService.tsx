import { serverURL } from './ServerURL.ts'

class GridService {
	static getGridState(): Promise<{enabled: boolean, color: string, gridSize: number, hex: boolean, hexV: boolean, hexSize: number}> {
		return fetch(serverURL+"/grid")
			.then((response) => response.json())
			.catch(() => {
			  console.error("Failed to load grid state")
			  return {enabled: false, color: "#000000", gridSize: 50, hex: false, hexV: false, hexSize: 50}			  
			})
	}
	
	static updateGridState(data: {enabled?: boolean, color?: string, gridSize?: number, hex?: boolean, hexV?: boolean, hexSize?: number}): Promise<boolean> {
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