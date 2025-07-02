import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ExistingMapsWindow from './ExistingMapsWindow.tsx'

import ImageService from '../../services/ImageService.tsx'

let filterFn = ""
let filterTags = []

describe('Existing Map Window tests', () => {
	beforeEach(() => {
		filterFn = ""
		filterTags = []
	})
	
	it('shows basic elements on render', async () => {
		const spy = jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => new Promise(() => []))
		const spy2 = jest.spyOn(ImageService, 'loadUniqueMapTags').mockImplementation((folder) => new Promise(() => []))
	
		render(<ExistingMapsWindow />)
		
	    const header = screen.getByRole("heading")
	    expect(header).toBeInTheDocument()
		expect(header.innerHTML).toBe("Available Maps")
		const closeButton = screen.getByText("Close Button")
		expect(closeButton).toBeInTheDocument()
		const uploader = screen.getByText("Image Uploader")
		expect(uploader).toBeInTheDocument()
		const filter = screen.getByText("File Filter")
		expect(filter).toBeInTheDocument()
	})

    it('calls load maps and load tags on render', async () => {
		const spy = jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => new Promise(() => []))
		const spy2 = jest.spyOn(ImageService, 'loadUniqueMapTags').mockImplementation((folder) => new Promise(() => []))

		render(<ExistingMapsWindow />)
		
		expect(spy).toHaveBeenCalledTimes(2) // useEffect twice
		expect(spy).toHaveBeenCalledWith("/maps")	
		expect(spy2).toHaveBeenCalledTimes(2) // useEffect twice
    })
	
	it('filters by name', async () => {
		const spy = jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => Promise.resolve(() => [
			{url: "img1", filename: "filename1", tags: ["tag1", "tag3"]},
			{url: "img2", filename: "filen2", tags: ["tag2"]},
			{url: "img3", filename: "fname3", tags: []},
			{url: "img4", filename: "filename100", tags: ["tag1", "tag2", "tag3"]},
			{url: "img5", filename: "fn5", tags: ["tag3"]},
		]))
		const spy2 = jest.spyOn(ImageService, 'loadUniqueMapTags').mockImplementation((folder) => Promise.resolve(() => ["tag1", "tag2", "tag3"]))
	
		filterFn="file"
		render(<ExistingMapsWindow />)
		
		await screen.findByText("img1")
		
		// All should be visibile initially
		expect(screen.getByText("img1")).toBeInTheDocument()
		expect(screen.getByText("img2")).toBeInTheDocument()
		expect(screen.getByText("img3")).toBeInTheDocument()
		expect(screen.getByText("img4")).toBeInTheDocument()
		expect(screen.getByText("img5")).toBeInTheDocument()
		
		await userEvent.click(screen.getByText("File Filter"))

		expect(screen.getByText("img1")).toBeInTheDocument()
		expect(screen.getByText("img2")).toBeInTheDocument()
		expect(screen.queryByText("img3")).not.toBeInTheDocument()
		expect(screen.getByText("img4")).toBeInTheDocument()
		expect(screen.queryByText("img5")).not.toBeInTheDocument()		
	})

	it('filters by tags', async () => {
		const spy = jest.spyOn(ImageService, 'loadImagesFromFolder').mockImplementation((folder) => Promise.resolve(() => [
			{url: "img1", filename: "filename1", tags: ["tag1", "tag3"]},
			{url: "img2", filename: "filen2", tags: ["tag2"]},
			{url: "img3", filename: "fname3", tags: []},
			{url: "img4", filename: "filename100", tags: ["tag1", "tag2", "tag3"]},
			{url: "img5", filename: "fn5", tags: ["tag3"]},
		]))
		const spy2 = jest.spyOn(ImageService, 'loadUniqueMapTags').mockImplementation((folder) => Promise.resolve(() => ["tag1", "tag2", "tag3"]))

		filterTags = ["tag2", "tag3"]
		render(<ExistingMapsWindow />)
		
		await screen.findByText("img1")
		
		// All should be visibile initially
		expect(screen.getByText("img1")).toBeInTheDocument()
		expect(screen.getByText("img2")).toBeInTheDocument()
		expect(screen.getByText("img3")).toBeInTheDocument()
		expect(screen.getByText("img4")).toBeInTheDocument()
		expect(screen.getByText("img5")).toBeInTheDocument()
		
		await userEvent.click(screen.getByText("File Filter"))

		expect(screen.queryByText("img1")).not.toBeInTheDocument()
		expect(screen.queryByText("img2")).not.toBeInTheDocument()
		expect(screen.queryByText("img3")).not.toBeInTheDocument()
		expect(screen.getByText("img4")).toBeInTheDocument()
		expect(screen.queryByText("img5")).not.toBeInTheDocument()		
	})
})

jest.mock('../ImageUploader/ImageUploader', () => { return { 'default': () => <p>Image Uploader</p>}})
jest.mock('../ExistingMapPanel/ExistingMapPanel', () => { return { 'default': (props) => <p>{props.url}</p>}})
jest.mock('../Spinner/Spinner', () => { return { 'default': () => <p>Spinner</p>}})
jest.mock('../CloseButton/CloseButton', () => { return { 'default': () => <p>Close Button</p>}})
jest.mock('../FileFilter/FileFilter', () => { return { 'default': (props) => <button onClick={() => props.updateCallback(filterFn, filterTags)}>File Filter</button>}})
jest.mock('../../services/ServerURL', () => { serverURL: "" })