import React from 'react'
import { BrowserView } from 'react-device-detect'
import UploadsListingWeb from './UploadListingWeb'
import { withRouter } from 'react-router-dom'

function UploadListing () {
	return (
		<>
			<BrowserView>
				<UploadsListingWeb/>
			</BrowserView>
		</>
	)
}

export default withRouter(UploadListing)
