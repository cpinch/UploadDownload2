import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ImageUploader from './ImageUploader.tsx'

import ImageService from '../../services/ImageService.tsx'

let response = { status: 200 }
const file = new File(['foo'], 'foo.txt');

describe('Image Uploader tests', () => {
	beforeEach(() => {
		response = { status: 200 }
	})
	
	it('shows basic elements on render', async () => {	
		render(<ImageUploader folder="/test" />)
		
	    const fileInput = screen.getByRole("input")
	    expect(fileInput).toBeInTheDocument()
	})

    it('calls uploadImage when submitted', async () => {
		const spy = jest.spyOn(ImageService, 'uploadImage').mockImplementation((folder, file) => Promise.resolve(response))
		
		render(<ImageUploader folder="/test" updateCallback={jest.fn()} />)

		await screen.findByRole("input")
		await fireEvent.change(screen.getByRole("input"), { target: { files: { item: () => file, length: 1, 0: file } },}) 
		await screen.findByRole("button")
		await userEvent.click(screen.getByRole("button"))
		
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith("/test", expect.anything())
    })
	
	it('handles uploadImage success response', async () => {
		const spy = jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => Promise.resolve(response))
	
		render(<ImageUploader folder="/test" updateCallback={jest.fn()} />)
	
		await screen.findByRole("input")
		await fireEvent.change(screen.getByRole("input"), { target: { files: { item: () => file, length: 1, 0: file } },}) 
		await screen.findByRole("button")
		await userEvent.click(screen.getByRole("button"))
		await screen.findByText("✅")
	
		expect(screen.getByText("✅")).toBeInTheDocument()
	})

	it('handles uploadImage invalid filetype response', async () => {
		response = { status: 400 }
		const spy = jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => Promise.resolve(response))

		render(<ImageUploader folder="/test" />)

		await screen.findByRole("input")
		await fireEvent.change(screen.getByRole("input"), { target: { files: { item: () => file, length: 1, 0: file } },}) 
		await screen.findByRole("button")
		await userEvent.click(screen.getByRole("button"))
		await screen.findByText("❌ Invalid File Type")

		expect(screen.getByText("❌ Invalid File Type")).toBeInTheDocument()
	})

	it('handles uploadImage generic error response', async () => {
		response = { status: 404 }
		const spy = jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => Promise.resolve(response))

		render(<ImageUploader folder="/test" />)

		await screen.findByRole("input")
		await fireEvent.change(screen.getByRole("input"), { target: { files: { item: () => file, length: 1, 0: file } },}) 
		await screen.findByRole("button")
		await userEvent.click(screen.getByRole("button"))
		await screen.findByText("❌ File upload failed")

		expect(screen.getByText("❌ File upload failed")).toBeInTheDocument()
	})
})

jest.mock('../../services/ServerURL', () => { serverURL: "" })