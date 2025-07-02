import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ExistingMapPanel from './ExistingMapPanel.tsx'

import ImageService from '../../services/ImageService.tsx'

describe('Map Panel tests', () => {
	it('shows basic elements on render', async () => {	
		render(<ExistingMapPanel url="url" filename="filename" tags="" />)
		
	    const img = screen.getByRole("img")
	    expect(img).toBeInTheDocument()
		expect(img.src).toBe("http://localhost/url")
		const copyToProjector = screen.getByRole("button")
		expect(copyToProjector).toBeInTheDocument()
		expect(copyToProjector.innerHTML).toBe("Copy to Projector")
	})

	it('calls copy to projector when that button is clicked', async () => {
		const spy = jest.spyOn(ImageService, 'copyToProjector').mockImplementation((filename) => Promise.resolve(true))		
		render(<ExistingMapPanel url="url" filename="filename" tags="" closeCallback={jest.fn()} updateCallback={jest.fn()} />)
		
		await userEvent.click(screen.getByText("Copy to Projector"))
		
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith("filename")
	})
	
	it('zooms in the view when the image is clicked on', async () => {	
		render(<ExistingMapPanel url="url" filename="filename" tags="" />)
		
		await screen.findByRole("img")
		await userEvent.click(screen.getByRole("img"))
		await screen.findByText("Zoomed Map Panel")

		const zoomPanel = screen.getByText("Zoomed Map Panel")
		expect(zoomPanel).toBeInTheDocument()
	})
})

jest.mock('../ZoomedMapPanel/ZoomedMapPanel', () => { return { 'default': () => <p>Zoomed Map Panel</p>}})
jest.mock('../../services/ServerURL', () => { serverURL: "" })