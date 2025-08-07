import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import GridConfigurationWindow from './GridConfigurationWindow.tsx'

import GridService from '../../services/GridService.tsx'

describe('Grid Configuration Window tests', () => {
	it('shows basic elements on render', async () => {	
		const data = {color: "#100000", gridSize: 60, hex: false, hexV: false, hexSize: 10}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))
		
		render(<GridConfigurationWindow />)
		
		await screen.findByLabelText("Color")
		
	    const heading = screen.getByRole("heading")
	    expect(heading).toBeInTheDocument()
		expect(heading.innerHTML).toEqual("Grid Configuration Options")
		const closeButton = screen.getByRole("button")
		expect(closeButton).toBeInTheDocument()
		const colorPicker = screen.getByLabelText("Color")
		expect(colorPicker).toBeInTheDocument()
		expect(colorPicker.value).toEqual("#100000")
		const gridRadioButton = screen.getByLabelText("Grid")
		expect(gridRadioButton).toBeInTheDocument()
		expect(gridRadioButton.checked).toBe(true)
		const hexRadioButton = screen.getByLabelText("Hex")
		expect(hexRadioButton).toBeInTheDocument()
		expect(hexRadioButton.checked).toBe(false)
		const gridSize = screen.getByLabelText("Grid Size")
		expect(gridSize).toBeInTheDocument()
		expect(gridSize.value).toBe("60") // value is stored in the component as a string
	})

    it('calls gridservice get details on render', async () => {
		const data = {color: "#00000", gridSize: 50, hex: false, hexV: false, hexSize: 50}
		const spy = jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))	
	
		render(<GridConfigurationWindow />)

		await screen.findByLabelText("Color")
		
		expect(spy).toHaveBeenCalledTimes(2) // useEffect runs twice	
    })
	
	it('shows hex options when hex is selected', async () => {
		const data = {color: "#00000", gridSize: 60, hex: true, hexV: false, hexSize: 10}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))	
	
		render(<GridConfigurationWindow />)
		
		await screen.findByLabelText("Center Hexes")

		const cHexV = screen.getByLabelText("Center Hexes")
		expect(cHexV).toBeInTheDocument()
		expect(cHexV.checked).toBe(false)
		const lHexV = screen.getByLabelText("Left Align Hexes")
		expect(lHexV).toBeInTheDocument()
		expect(lHexV.checked).toBe(true)
		const hexSize = screen.getByLabelText("Hex Size")
		expect(hexSize).toBeInTheDocument()
		expect(hexSize.value).toBe("10") // value is stored in the component as a string
	})

	it('hides hex options when hex is not selected', async () => {
		const data = {color: "#00000", gridSize: 50, hex: false, hexV: false, hexSize: 50}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))	

		render(<GridConfigurationWindow />)

		await screen.findByLabelText("Color")

		const cHexV = screen.queryByLabelText("Center Hexes")
		expect(cHexV).not.toBeInTheDocument()
		const lHexV = screen.queryByLabelText("Left Align Hexes")
		expect(lHexV).not.toBeInTheDocument()
		const hexSize = screen.queryByLabelText("Hex Size")
		expect(hexSize).not.toBeInTheDocument()
	})

	it('calls gridservice update for any changes', async () => {
		const data = {color: "#00000", gridSize: 50, hex: false, hexV: false, hexSize: 50}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))
		const spy = jest.spyOn(GridService, 'updateGridState')
				.mockImplementation(() => Promise.resolve(true))

		render(<GridConfigurationWindow />)
		await screen.findByLabelText("Color")
		
		await fireEvent.change(screen.getByLabelText("Color"), {target: {value: "#987654"}})		
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith({color: '#987654'})

		await fireEvent.change(screen.getByLabelText("Grid Size"), {target: {value: "70"}})		
		await userEvent.click(screen.getByLabelText("Grid Size"))	// Trigger the update send
		expect(spy).toHaveBeenCalledTimes(2)
		expect(spy).toHaveBeenCalledWith({gridSize: 70})
		
		await userEvent.click(screen.getByLabelText("Hex"))
		expect(spy).toHaveBeenCalledTimes(3)
		expect(spy).toHaveBeenCalledWith({hex: true})

		await userEvent.click(screen.getByLabelText("Center Hexes"))
		expect(spy).toHaveBeenCalledTimes(4)
		expect(spy).toHaveBeenCalledWith({hexV: true})

		await fireEvent.change(screen.getByLabelText("Hex Size"), {target: {value: "12"}})	
		await userEvent.click(screen.getByLabelText("Hex Size"))	// Trigger the update send	
		expect(spy).toHaveBeenCalledTimes(5)
		expect(spy).toHaveBeenCalledWith({hexSize: 12})
	})
})

jest.mock('../../services/ServerURL', () => { serverURL: "" })
