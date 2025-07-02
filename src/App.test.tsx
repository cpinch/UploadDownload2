import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import App from './App.tsx'

describe('App tests', () => {
    it('renders the header and main areas', () => {
   		render(<App />)
        const heading = screen.getByRole("heading")
        expect(heading).toBeInTheDocument()
		expect(heading.innerHTML).toEqual("GMTools")
		const screenArea = screen.getByText("Screen Area")
		expect(screenArea).toBeInTheDocument()
		const projectorArea = screen.getByText("Projector Area")
		expect(projectorArea).toBeInTheDocument()
    })
})

jest.mock('./components/ScreenArea/ScreenArea', () => { return { 'default': () => <p>Screen Area</p>}})
jest.mock('./components/ProjectorArea/ProjectorArea', () => { return { 'default': () => <p>Projector Area</p>}})
