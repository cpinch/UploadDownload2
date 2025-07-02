import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import GridConfigurer from './GridConfigurer.tsx'

import GridService from '../../services/GridService.tsx'

describe('Grid Configurer tests', () => {
	it('shows basic elements on render', async () => {	
		const data = {enabled: false}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))
		
		render(<GridConfigurer />)
		
		await screen.findByText("Show Grid?")
		
	    const heading = screen.getByText("Show Grid?")
	    expect(heading).toBeInTheDocument()
		const checkbox = screen.getByRole("checkbox")
		expect(checkbox).toBeInTheDocument()
		expect(checkbox.checked).toBe(false)
		const configureButton = screen.getByText("Configure")
		expect(configureButton).toBeInTheDocument()
	})

    it('calls gridservice get details on render', async () => {
		const data = {enabled: false}
		const spy = jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))	
	
		render(<GridConfigurer />)

		await screen.findByText("Show Grid?")
		
		expect(spy).toHaveBeenCalledTimes(2) // useEffect runs twice	
    })
	
	it('shows grid enabled when grid status is enabled', async () => {
		const data = {enabled: true}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))	
	
		render(<GridConfigurer />)

		await screen.findByText("Show Grid?")
		
		const checkbox = screen.getByRole("checkbox")
		expect(checkbox.checked).toBe(true)
	})

	it('shows configuration window on click', async () => {
		const data = {enabled: false}
		jest.spyOn(GridService, 'getGridState').mockImplementation(() => Promise.resolve(data))	

		render(<GridConfigurer />)

		await screen.findByText("Show Grid?")
		userEvent.click(screen.getByText("Configure"))
		await screen.findByText("Grid Configuration Window")
		
		const gcw = screen.getByText("Grid Configuration Window")
		expect(gcw).toBeInTheDocument()
	})
})

jest.mock('../GridConfigurationWindow/GridConfigurationWindow', () => { return { 'default': () => <p>Grid Configuration Window</p>}})
jest.mock('../../services/ServerURL', () => { serverURL: "" })
