import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ImageDisplayer from './ImageDisplayer.tsx'

import ImageService from '../../services/ImageService.tsx'

const img1 = { url: "img1", filename: "img1fn" }
const img2 = { url: "img2", filename: "img2fn" }

describe('Image Displayer tests', () => {
	it('shows basic elements on render', async () => {	
		render(<ImageDisplayer folder="/test" loading={false} imgs={[img1]} />)
		
	    const img = screen.getByRole("img")
	    expect(img).toBeInTheDocument()
		expect(img.src).toBe("http://localhost/img1")
		const deleteButton = screen.getByRole("button")
		expect(deleteButton).toBeInTheDocument()
	})
	
	it('shows multiple images when provided with them', async () => {	
		render(<ImageDisplayer folder="/test" loading={false} imgs={[img1, img2]} />)
	
		const images = screen.getAllByRole("img")
		const deleteButtons = screen.getAllByRole("button")
		expect(images.length).toBe(2)
		expect(deleteButtons.length).toBe(2)
		expect(images[0]).toBeInTheDocument()
		expect(deleteButtons[0]).toBeInTheDocument()
		expect(images[0].src).toBe("http://localhost/img1")
		expect(images[1]).toBeInTheDocument()
		expect(deleteButtons[1]).toBeInTheDocument()
		expect(images[1].src).toBe("http://localhost/img2")
	})

    it('calls deleteImage when delete is pressed', async () => {
		const spy = jest.spyOn(ImageService, 'deleteImage').mockImplementation((folder, file) => Promise.resolve(true))

		render(<ImageDisplayer folder="/test" loading={false} imgs={[img1]} updateCallback={jest.fn()} />)
		
		await screen.findByRole("button")
		await userEvent.click(screen.getByRole("button"))
		
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith("/test", "img1fn")
    })
})

jest.mock('../../services/ServerURL', () => { serverURL: "" })