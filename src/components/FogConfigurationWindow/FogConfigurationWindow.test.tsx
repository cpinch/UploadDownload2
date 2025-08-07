import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import FogConfigurationWindow from './FogConfigurationWindow.tsx'

import FogService from '../../services/FogService.tsx'

describe('Fog Configuration Window tests', () => {
	it('shows basic elements on render', async () => {	
	})
})

jest.mock('../../services/ServerURL', () => { serverURL: "" })
