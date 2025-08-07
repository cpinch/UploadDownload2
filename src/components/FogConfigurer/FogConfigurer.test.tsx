import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import FogConfigurer from './FogConfigurer.tsx'

import FogService from '../../services/FogService.tsx'

describe('Fog Configurer tests', () => {
	it('shows basic elements on render', async () => {	
		const data = {enabled: false}
		jest.spyOn(FogService, 'getFogState').mockImplementation(() => Promise.resolve(data))
		
		render(<FogConfigurer />)
		
		await screen.findByText("Show Fog of War?")
		
	    const heading = screen.getByText("Show Fog of War?")
	    expect(heading).toBeInTheDocument()
		const checkbox = screen.getByRole("checkbox")
		expect(checkbox).toBeInTheDocument()
		expect(checkbox.checked).toBe(false)
		const configureButton = screen.getByText("Configure")
		expect(configureButton).toBeInTheDocument()
	})

    it('calls fogservice get details on render', async () => {
		const data = {enabled: false}
		const spy = jest.spyOn(FogService, 'getFogState').mockImplementation(() => Promise.resolve(data))	
	
		render(<FogConfigurer />)

		await screen.findByText("Show Fog of War?")
		
		expect(spy).toHaveBeenCalledTimes(2) // useEffect runs twice	
    })
	
	it('shows fog enabled when grid status is enabled', async () => {
		const data = {enabled: true}
		jest.spyOn(FogService, 'getFogState').mockImplementation(() => Promise.resolve(data))	
	
		render(<FogConfigurer />)

		await screen.findByText("Show Fog of War?")
		
		const checkbox = screen.getByRole("checkbox")
		expect(checkbox.checked).toBe(true)
	})

	it('shows configuration window on click', async () => {
		const data = {enabled: false}
		jest.spyOn(FogService, 'getFogState').mockImplementation(() => Promise.resolve(data))	

		render(<FogConfigurer />)

		await screen.findByText("Show Fog of War?")
		userEvent.click(screen.getByText("Configure"))
		await screen.findByText("Fog Configuration Window")
		
		const gcw = screen.getByText("Gof Configuration Window")
		expect(gcw).toBeInTheDocument()
	})
})

jest.mock('../FogConfigurationWindow/FogConfigurationWindow', () => { return { 'default': () => <p>Fog Configuration Window</p>}})
jest.mock('../../services/ServerURL', () => { serverURL: "" })
