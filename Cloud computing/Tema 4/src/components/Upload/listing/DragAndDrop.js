import React, { useContext, useState } from 'react'
import { UploadContext } from '../UploadContext'
import { addFilesToList, handleDragEnter, handleDragLeave, handleDragOver } from '../UploadActions'
import { DropWrapper, UploadText } from '../../Global/Drop/DropWrapper'
import { Item } from './Item'

const DragAndDrop = ({ setSelect, selectedFile, setFile }) => {
	const [isHovered, setHover] = useState(false)
	const uploadContext = useContext(UploadContext)
	const data = uploadContext.state
	const localDragEnter = e => {

		e.preventDefault()
		e.stopPropagation()
		handleDragEnter({ uploadContext, data })
	}
	const localDragLeave = e => {
		setHover(false)
		e.preventDefault()
		e.stopPropagation()
		handleDragLeave({ uploadContext, data })
	}
	const localDragOver = e => {
		setHover(true)

		e.preventDefault()
		e.stopPropagation()
		handleDragOver({ uploadContext, e })
	}
	const localDrop = e => {
		setHover(false)

		e.preventDefault()
		e.stopPropagation()
		let files = [...e.dataTransfer.files]
		files.forEach((file) => {
			if (!file.type.includes('image/')) {
				files = undefined
				alert('Only images allowed')
			}
		})
		const existingFiles = data.fileList.map(f => f.name)
		files = files && files.filter(f => !existingFiles.includes(f.name))
		if (files && files.length > 0) {
			addFilesToList({ uploadContext, files })
			e.dataTransfer.clearData()
		}
	}

	return (
		<div style={{ overflow: 'hidden' }}>
			<DropWrapper isHovered={isHovered}
									 onDrop={localDrop}
									 onDragOver={localDragOver}
									 onDragEnter={localDragEnter}
									 onDragLeave={localDragLeave}
			>
				<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
					<div style={{ display: 'flex', flexWrap: 'wrap', transition: '0.5 all ease', justifyContent: 'center'}}>

						{data.fileList.map((file, index) => {
							return (
								<Item file={file} setSelect={setSelect} selectedFile={selectedFile} index={index} key={index} setFile={setFile}/>
							)
						})}
					</div>
					<UploadText>{isHovered ? 'Let go to upload.' : 'Drop items here!'}</UploadText>
				</div>
			</DropWrapper>
		</div>
	)
}
export default DragAndDrop