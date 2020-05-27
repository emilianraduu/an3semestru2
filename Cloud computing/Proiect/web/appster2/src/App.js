import React from 'react'
import Router from './config/Router'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { UploadContextProvider } from './components/Upload/UploadContext'
import { AuthContextProvider } from './components/Auth/AuthContext'
import { ToastContainer } from 'react-toastify'

function App () {
	return (
		<AuthContextProvider>
			<UploadContextProvider>
					<ToastContainer/>
					<Router/>
			</UploadContextProvider>
		</AuthContextProvider>
	)
}

export default App
