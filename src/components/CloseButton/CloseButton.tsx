import "./CloseButton.css"

function CloseButton(props: {closeCallback: () => void}) {
	return (
		<button className="close-window-button" type="reset" onClick={() => props.closeCallback()}>❌</button>
	)
}

export default CloseButton