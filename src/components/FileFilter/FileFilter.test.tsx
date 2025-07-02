import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import FileFilter from './FileFilter.tsx'

describe('File Filter tests', () => {
	it('shows basic elements on render', async () => {
		render(<FileFilter tags={[]} updateCallback={jest.fn()} />)
		
		await screen.findByLabelText("Filter by Name")
		
	    const nameFilter = screen.getByLabelText("Filter by Name")
	    expect(nameFilter).toBeInTheDocument()
		const tagsFilterLabel = screen.getByText("Filter by Tag(s)")
		expect(tagsFilterLabel).toBeInTheDocument()
	})

    it('shows all passed in tags', async () => {
		const tags = ['tag1', 'tag2', 'tag3']
		render(<FileFilter tags={tags} updateCallback={jest.fn()} />)

		await screen.findByLabelText("Filter by Name")
		
		tags.forEach((tag) => {
			const t = screen.getByText(tag)
			expect(t).toBeInTheDocument()			
		})
    })
	
	it('calls callback with proper text when a filename is typed in', async () => {
		const callbackFn = jest.fn()

		render(<FileFilter tags={[]} updateCallback={callbackFn} />)

		await screen.findByLabelText("Filter by Name")
		await userEvent.type(screen.getByLabelText("Filter by Name"), "test")
		
		expect(callbackFn).toHaveBeenCalledTimes(4) // one for each letter
		expect(callbackFn).toHaveBeenCalledWith("test", [])
	})
	
	// Note - We don't test multiselect behavior because it's an external component, so no callback test there
})

jest.mock('multiselect-react-dropdown', () => { return { 'default': (props) => {
		return (<div>
			{ props.options.map((o) => <p key={o}>{o}</p>)}
		</div>)
	}
}})