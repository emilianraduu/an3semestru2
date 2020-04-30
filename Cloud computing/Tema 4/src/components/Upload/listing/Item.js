import React, { useState } from 'react'
import { ImgWrapper, ItemWrapper } from '../../Global/Drop/DropWrapper'

export const Item = ({ file, setSelect, selectedFile,setFile }) => {
	const [src, setSrc] = useState()
	if (file.type && file.type.indexOf('image') === 0) {
		let reader = new FileReader()
		reader.onload = function (e) {
			setSrc(e.target.result)
		}
		reader.readAsDataURL(file)
	}
	if(!src && file && file.buffer){
		setSrc(file.buffer)
	}
	return (
		<ItemWrapper onClick={() => {
			setFile(file)
			setSelect(src)
		}}>
			<ImgWrapper url={src} selected={selectedFile === src}/>
			<p style={{ alignSelf: 'center', textAlign: 'center' }}>
				{file.name}
			</p>
		</ItemWrapper>
	)
}

