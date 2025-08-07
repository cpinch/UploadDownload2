import { useState, useEffect } from 'react'
import "./FogConfigurer.css"

import FogConfigurationWindow from '../FogConfigurationWindow/FogConfigurationWindow.tsx'
import FogService from '../../services/FogService.tsx'

function FogConfigurer() {
	const [enabled, setEnabled] = useState<boolean>(false)
	const [display, setDisplay] = useState<boolean>(false)
	
	function setInitialFogState(json: {enabled: boolean}) {
		setEnabled(json.enabled)
	}
	
	useEffect(() => {
		FogService.getFogState()
			.then((responseJson) => setInitialFogState(responseJson))
	}, [])
		
	function setFogEnabled(enabled: boolean) {
		FogService.updateFogState({"enabled": enabled})
			.then((success) => {
				if (success) {
					setEnabled(enabled)
				}
			})
	}
	
	return (
		<div className="fog-configurer">Show Fog of War? 
			<input type="checkbox" id="fog-enabled" value="" onChange={() => setFogEnabled(!enabled)} checked={enabled} />
			<button className="configure-button" onClick={() => setDisplay(true)}>Configure</button>
			{ display && <FogConfigurationWindow closeCallback={() => setDisplay(false)} /> }
		</div>
	);
}

export default FogConfigurer