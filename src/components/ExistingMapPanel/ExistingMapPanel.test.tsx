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
		await screen.findAllByRole("textbox")

		const zoomedImg = screen.getByRole("img")
		expect(zoomedImg).toBeInTheDocument()
		expect(zoomedImg.src).toBe("http://localhost/url")
		const inputs = screen.getAllByRole("textbox")
		expect(inputs.length).toBe(2)
		expect(inputs[0]).toBeInTheDocument()
		expect(inputs[0].id).toBe("filename-input")
		expect(inputs[1]).toBeInTheDocument()
		expect(inputs[1].id).toBe("tags-input")
		const closeButton = screen.getByText("Close Button")
		expect(closeButton).toBeInTheDocument()
	})

	it('calls update filename when enter is pressed on the filename fied', async () => {
		const spy = jest.spyOn(ImageService, 'updateFilename').mockImplementation((oldFn, newFn) => Promise.resolve(true))		
		render(<ExistingMapPanel url="url" filename="filename.txt" tags="" />)
	
		await screen.findByRole("img")
		await userEvent.click(screen.getByRole("img"))
		await screen.findAllByRole("textbox")
		const fnTextbox = screen.getAllByRole("textbox")[0]
		await userEvent.clear(fnTextbox)
		await userEvent.type(fnTextbox, "new filename")
		await userEvent.type(fnTextbox, '{enter}')

		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith("filename.txt", "new filename.txt")
	})

	it('calls update filtagsename when enter is pressed on the tags fied', async () => {
		const spy = jest.spyOn(ImageService, 'updateTags').mockImplementation((filename, tags) => Promise.resolve(true))		
		render(<ExistingMapPanel url="url" filename="filename" tags="" />)

		await screen.findByRole("img")
		await userEvent.click(screen.getByRole("img"))
		await screen.findAllByRole("textbox")
		const tagsTextbox = screen.getAllByRole("textbox")[1]
		await userEvent.type(tagsTextbox, "tag1, tag2, tag3")
		await userEvent.type(tagsTextbox, '{enter}')

		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith("filename", "tag1, tag2, tag3")
	})
})

jest.mock('../CloseButton/CloseButton', () => { return { 'default': () => <p>Close Button</p>}})
jest.mock('../../hooks/OutsideAlerter.tsx')
jest.mock('../../services/ServerURL', () => { serverURL: "" })