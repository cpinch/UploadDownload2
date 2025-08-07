import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ZoomedMapPanel from './ZoomedMapPanel.tsx'

import ImageService from '../../services/ImageService.tsx'

const fnSpy = jest.spyOn(ImageService, 'updateFilename').mockImplementation((oldFn, newFn) => Promise.resolve(true))	
const tagSpy = jest.spyOn(ImageService, 'updateTags').mockImplementation((oldFn, newFn) => Promise.resolve(true))
const updateSpy = jest.fn()

describe('Zoomed Map Panel tests', () => {
	beforeEach(() => {
		fnSpy.mockClear()
		tagSpy.mockClear()
		updateSpy.mockClear()
	})
	
	it('shows basic elements on render', async () => {	
		render(<ZoomedMapPanel url="url" filename="filename" tags="" />)

		const img = screen.getByRole("img")
		expect(img).toBeInTheDocument()
		expect(img.src).toBe("http://localhost/url")
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
		render(<ZoomedMapPanel url="url" filename="filename.txt" tags="" updateFilenameCallback={updateSpy}/>)
	
		await screen.findAllByRole("textbox")
		const fnTextbox = screen.getAllByRole("textbox")[0]
		await userEvent.clear(fnTextbox)
		await userEvent.type(fnTextbox, "new filename{enter}")

		expect(fnSpy).toHaveBeenCalledTimes(1)
		expect(fnSpy).toHaveBeenCalledWith("filename.txt", "new filename.txt")
		expect(updateSpy).toHaveBeenCalledTimes(1)
		expect(updateSpy).toHaveBeenCalledWith("new filename.txt")
	})

	it('calls update tags and reloads tags when enter is pressed on the tags field with a single tag', async () => {
		render(<ZoomedMapPanel url="url" filename="filename" tags="" updateTagsCallback={updateSpy} />)

		await screen.findAllByRole("textbox")
		const tagsTextbox = screen.getAllByRole("textbox")[1]
		await userEvent.type(tagsTextbox, "tag1{enter}")
		
		expect(tagSpy).toHaveBeenCalledTimes(1)
		expect(tagSpy).toHaveBeenCalledWith("filename", "tag1")
		expect(updateSpy).toHaveBeenCalledTimes(1)
		expect(updateSpy).toHaveBeenCalledWith("tag1")
	})

	it('calls update tags and reloads tags when enter is pressed on the tags field with a list of tags', async () => {
		render(<ZoomedMapPanel url="url" filename="filename" tags="" updateTagsCallback={updateSpy} />)

		await screen.findAllByRole("textbox")
		const tagsTextbox = screen.getAllByRole("textbox")[1]
		await userEvent.type(tagsTextbox, "tag1, tag2, tag3{enter}")

		expect(tagSpy).toHaveBeenCalledTimes(1)
		expect(tagSpy).toHaveBeenCalledWith("filename", "tag1, tag2, tag3")
		expect(updateSpy).toHaveBeenCalledTimes(1)
		expect(updateSpy).toHaveBeenCalledWith("tag1, tag2, tag3")
	})

	it('does not allow the reserved tagname "none" to be used', async () => {
		render(<ZoomedMapPanel url="url" filename="filename" tags="" updateTagsCallback={updateSpy} />)

		await screen.findAllByRole("textbox")
		const tagsTextbox = screen.getAllByRole("textbox")[1]
		await userEvent.type(tagsTextbox, "none{enter}")

		expect(tagSpy).toHaveBeenCalledTimes(0)
		expect(updateSpy).toHaveBeenCalledTimes(0)
		expect(tagsTextbox.value).toBe("")
	})

	it('does not allow the reserved tagname "none" to be used in a list of tags', async () => {
		render(<ZoomedMapPanel url="url" filename="filename" tags="" updateTagsCallback={updateSpy} />)

		await screen.findAllByRole("textbox")
		const tagsTextbox = screen.getAllByRole("textbox")[1]
		await userEvent.type(tagsTextbox, "tag1, none, tag3{enter}")

		expect(tagSpy).toHaveBeenCalledTimes(1)
		expect(tagSpy).toHaveBeenCalledWith("filename", "tag1, tag3")
		expect(updateSpy).toHaveBeenCalledTimes(1)
		expect(updateSpy).toHaveBeenCalledWith("tag1, tag3")
		expect(tagsTextbox.value).toBe("tag1, tag3")
	})

	it('ignores empty tags on their own', async () => {
		render(<ZoomedMapPanel url="url" filename="filename" tags="" updateTagsCallback={updateSpy} />)

		await screen.findAllByRole("textbox")
		const tagsTextbox = screen.getAllByRole("textbox")[1]
		await userEvent.type(tagsTextbox, ",{enter}")

		expect(tagSpy).toHaveBeenCalledTimes(0)
		expect(updateSpy).toHaveBeenCalledTimes(0)
		expect(tagsTextbox.value).toBe("")
	})

	it('ignores empty tags in a list of tags', async () => {
		render(<ZoomedMapPanel url="url" filename="filename" tags="" updateTagsCallback={updateSpy} />)

		await screen.findAllByRole("textbox")
		const tagsTextbox = screen.getAllByRole("textbox")[1]
		await userEvent.type(tagsTextbox, "tag1,, tag3{enter}")

		expect(tagSpy).toHaveBeenCalledTimes(1)
		expect(tagSpy).toHaveBeenCalledWith("filename", "tag1, tag3")
		expect(updateSpy).toHaveBeenCalledTimes(1)
		expect(updateSpy).toHaveBeenCalledWith("tag1, tag3")
		expect(tagsTextbox.value).toBe("tag1, tag3")
	})
})

jest.mock('../CloseButton/CloseButton', () => { return { 'default': () => <p>Close Button</p>}})
jest.mock('../../hooks/OutsideAlerter.tsx')
jest.mock('../../services/ServerURL', () => { serverURL: "" })