import { useState } from 'react';
import "./ExistingMapButton.css"

import ExistingMapsWindow from '../ExistingMapsWindow/ExistingMapsWindow.tsx'

function ExistingMapButton(props: {updateCallback: Function}) {
	const [displayed, setDisplayed] = useState<boolean>(false)
	
	return (
		<>
			<button id="map-button" onClick={() => setDisplayed(true)}>Stock Maps</button>
			{ displayed && <ExistingMapsWindow closeCallback={() => setDisplayed(false)} updateCallback={props.updateCallback} /> }
		</>
	);
}

export default ExistingMapButton