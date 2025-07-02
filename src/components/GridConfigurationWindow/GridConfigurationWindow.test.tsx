import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import GridConfigurationWindow from './GridConfigurationWindow.tsx'

import GridService from '../../services/GridService.tsx'

describe('Grid Configuration Window tests', () => {
	it('shows basic elements on render', async () => {	
		const data = {color: "#100000", hex: false, hexV: false}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))
		
		render(<GridConfigurationWindow />)
		
		await screen.findByLabelText("Color")
		
	    const heading = screen.getByRole("heading")
	    expect(heading).toBeInTheDocument()
		expect(heading.innerHTML).toEqual("Grid Configuration Options:")
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
	})

    it('calls gridservice get details on render', async () => {
		const data = {color: "#00000", hex: false, hexV: false}
		const spy = jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))	
	
		render(<GridConfigurationWindow />)

		await screen.findByLabelText("Color")
		
		expect(spy).toHaveBeenCalledTimes(2) // useEffect runs twice	
    })
	
	it('shows hex options when hex is selected', async () => {
		const data = {color: "#00000", hex: true, hexV: false}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))	
	
		render(<GridConfigurationWindow />)
		
		await screen.findByLabelText("Center Hexes")

		const cHexV = screen.getByLabelText("Center Hexes")
		expect(cHexV).toBeInTheDocument()
		expect(cHexV.checked).toBe(false)
		const lHexV = screen.getByLabelText("Left Align Hexes")
		expect(lHexV).toBeInTheDocument()
		expect(lHexV.checked).toBe(true)
	})

	it('hides hex options when hex is not selected', async () => {
		const data = {color: "#00000", hex: false, hexV: false}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))	

		render(<GridConfigurationWindow />)

		await screen.findByLabelText("Color")

		const cHexV = screen.queryByLabelText("Center Hexes")
		expect(cHexV).not.toBeInTheDocument()
		const lHexV = screen.queryByLabelText("Left Align Hexes")
		expect(lHexV).not.toBeInTheDocument()
	})

	it('calls gridservice update for any changes', async () => {
		const data = {color: "#00000", hex: false, hexV: false}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))
		const spy = jest.spyOn(GridService, 'updateGridState')
				.mockImplementation(() => Promise.resolve(true))

		render(<GridConfigurationWindow />)
		await screen.findByLabelText("Color")
		
		await fireEvent.change(screen.getByLabelText("Color"), {target: {value: "#987654"}})		
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith({color: '#987654'})
		
		await userEvent.click(screen.getByLabelText("Hex"))
		expect(spy).toHaveBeenCalledTimes(2)
		expect(spy).toHaveBeenCalledWith({hex: true})

		await userEvent.click(screen.getByLabelText("Center Hexes"))
		expect(spy).toHaveBeenCalledTimes(3)
		expect(spy).toHaveBeenCalledWith({hexV: true})
	})
})

jest.mock('../../services/ServerURL', () => { serverURL: "" })
