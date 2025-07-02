import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ScreenArea from './ScreenArea.tsx'

import ImageService from '../../services/ImageService.tsx'

describe('Screen Area tests', () => {
	it('shows basic elements on render', () => {	
		jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => new Promise(() => []))		
		render(<ScreenArea />)
	    const heading = screen.getByRole("heading")
	    expect(heading).toBeInTheDocument()
		expect(heading.innerHTML).toEqual("Screen")
		const uploader = screen.getByText("Image Uploader")
		expect(uploader).toBeInTheDocument()
		const displayer = screen.getByText("Image Displayer")
		expect(displayer).toBeInTheDocument()
	})

    it('calls imageservice loadimages on render', () => {
		const spy = jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => new Promise(() => []))
	
		render(<ScreenArea />)
		
		expect(spy).toHaveBeenCalledWith("/screen")	
    })
	
	it('shows clear screen button when images are present', async () => {
		jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => 
			Promise.resolve([{'url': 'testurl', 'filename': 'img1'}]))
	
		render(<ScreenArea />)
		
		await screen.findByText("Clear Screen")
		
		const clearButton = screen.getByText("Clear Screen")
		expect(clearButton).toBeInTheDocument()	
	})

	it('hides clear screen button when no images are present', () => {
		jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => new Promise(() => []))

		render(<ScreenArea />)
		const clearButton = screen.queryByText("Clear Screen")
		expect(clearButton).not.toBeInTheDocument()	
	
	})

	it('calls clear folder service when clear screen button is pressed', async () => {
		jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => 
			Promise.resolve([{'url': 'testurl', 'filename': 'img1'}]))
		const spy = jest.spyOn(ImageService, 'clearFolder').mockImplementation((folder) =>
			Promise.resolve())

		render(<ScreenArea />)
		
		await screen.findByText("Clear Screen")
		await userEvent.click(screen.getByText("Clear Screen"))
		
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith("/screen")		
	})
})

jest.mock('../ImageUploader/ImageUploader', () => { return { 'default': () => <p>Image Uploader</p>}})
jest.mock('../ImageDisplayer/ImageDisplayer', () => { return { 'default': () => <p>Image Displayer</p>}})
jest.mock('../../services/ServerURL', () => { serverURL: "" })
