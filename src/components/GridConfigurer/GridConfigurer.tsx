import { useState, useEffect } from 'react'
import "./GridConfigurer.css"

import GridConfigurationWindow from '../GridConfigurationWindow/GridConfigurationWindow.tsx'
import GridService from '../../services/GridService.tsx'

function GridConfigurer() {
	const [enabled, setEnabled] = useState<boolean>(false)
	const [display, setDisplay] = useState<boolean>(false)
	
	function setInitialGridState(json: {enabled: boolean}) {
		setEnabled(json.enabled)
	}
	
	useEffect(() => {
		GridService.getGridState()
			.then((responseJson) => setInitialGridState(responseJson))
	}, [])
		
	function setGridEnabled(enabled: boolean) {
		GridService.updateGridState({"enabled": enabled})
			.then((success) => {
				if (success) {
					setEnabled(enabled)
				}
			})
	}
	
	return (
	    <div className="grid-configurer">Show Grid? 
			<input type="checkbox" id="grid-enabled" value="" onChange={() => setGridEnabled(!enabled)} checked={enabled} />
			<button className="configure-button" onClick={() => setDisplay(true)}>Configure</button>
			{ display && <GridConfigurationWindow closeCallback={() => setDisplay(false)} /> }
		</div>
	);
}

export default GridConfigurer