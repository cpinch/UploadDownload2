import { useRef } from 'react'
import "./FogConfigurationWindow.css"

import CloseButton from '../CloseButton/CloseButton.tsx'
//import FogService from '../../services/FogService.tsx'
import { useOutsideAlerter } from '../../hooks/OutsideAlerter.tsx'

function FogConfigurationWindow(props: { closeCallback: () => void }) {
	const thisRef = useRef<HTMLDivElement>(null)
	useOutsideAlerter(thisRef, props.closeCallback)
	
	return (
		<div className="fog-window" ref={thisRef}>
			<h2>Fog of War</h2>
			<CloseButton closeCallback={props.closeCallback} />
		</div>
	)
}

export default FogConfigurationWindow