import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ProjectorArea from './ProjectorArea.tsx'

import ImageService from '../../services/ImageService.tsx'

describe('Projector Area tests', () => {
	it('shows basic elements on render', () => {	
		jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => new Promise(() => []))		
		render(<ProjectorArea />)
	    const heading = screen.getByRole("heading")
	    expect(heading).toBeInTheDocument()
		expect(heading.innerHTML).toEqual("Projector")
		const uploader = screen.getByText("Image Uploader")
		expect(uploader).toBeInTheDocument()
		const displayer = screen.getByText("Image Displayer")
		expect(displayer).toBeInTheDocument()
	})

    it('calls imageservice loadimages on render', () => {
		const spy = jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => new Promise(() => []))
	
		render(<ProjectorArea />)
		
		expect(spy).toHaveBeenCalledWith("/projector")	
    })
	
	it('shows clear projector button when images are present', async () => {
		jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => 
			Promise.resolve([{'url': 'testurl', 'filename': 'img1'}]))
	
		render(<ProjectorArea />)
		
		await screen.findByText("Clear Projector")
		
		const clearButton = screen.getByText("Clear Projector")
		expect(clearButton).toBeInTheDocument()	
	})

	it('hides clear projector button when no images are present', () => {
		jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => new Promise(() => []))

		render(<ProjectorArea />)
		const clearButton = screen.queryByText("Clear Projector")
		expect(clearButton).not.toBeInTheDocument()	
	
	})

	it('calls clear folder service when clear projector button is pressed', async () => {
		jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => 
			Promise.resolve([{'url': 'testurl', 'filename': 'img1'}]))
		const spy = jest.spyOn(ImageService, 'clearFolder').mockImplementation((folder) =>
			Promise.resolve())

		render(<ProjectorArea />)
		
		await screen.findByText("Clear Projector")
		await userEvent.click(screen.getByText("Clear Projector"))
		
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith("/projector")		
	})
})

jest.mock('../ImageUploader/ImageUploader', () => { return { 'default': () => <p>Image Uploader</p>}})
jest.mock('../ImageDisplayer/ImageDisplayer', () => { return { 'default': () => <p>Image Displayer</p>}})
jest.mock('../ExistingMapButton/ExistingMapButton', () => { return { 'default': () => <p>Existing Map Button</p>}})
jest.mock('../GridConfigurer/GridConfigurer', () => { return { 'default': () => <p>Grid Configurer</p>}})
jest.mock('../../services/ServerURL', () => { serverURL: "" })
