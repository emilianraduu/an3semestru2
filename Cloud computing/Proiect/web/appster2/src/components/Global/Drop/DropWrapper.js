import styled from 'styled-components'
import {
	colorBlack12,
	colorBlack40,
	colorFail,
	colorGreen,
	colorWhite,
	colorWhite02, colorWhite60
} from '../../../styles/abstract/variables'

export const DropWrapper = styled.div`
	flex: 1;
	padding: 2rem;
  text-align: center;
  background: ${colorWhite02};
  border-radius: 0.5rem;
  overflow-y: scroll;
  justify-content: center;
  flex-wrap: wrap;
  height: calc(100vh - 135px);
  ${({ isHovered }) => isHovered && (
	`background: ${colorBlack12};`
)}
`

export const UploadText = styled.p`
	margin: 0;
	padding: 20px;
	font-size: 20px;
	font-color: #000;
	font-weight: 900;
`

export const ImgWrapper = styled.div`
	${({ url }) => url &&
	`background: url('${url}');`
}	
	background-repeat: no-repeat;
	background-size: cover;
	cursor: pointer;
	background-position: center;
	border-radius: 8px;
  box-shadow: 5px 5px 10px ${colorBlack40};
	width: 200px;
	transition: 0.5s all ease;
	height: 200px;
	margin: 10px;
	${({ selected }) => selected && `border: 5px solid ${colorFail};`}
`

export const TextWrapper = styled.div`
	border-radius: 8px;
	background: ${colorWhite02};
  height: calc(100vh - 135px);
  margin-right: 10px;
  flex: 1;
	overflow: scroll;
	padding: 2rem;
	position: relative;
`

export const IconOCR = styled.div`
	height:40px;
	width: 40px;
	border-radius: 50%;
	display: flex;
	justify-content: center;	
	cursor: pointer;
	transition: 0.5s all ease;
	& i {
		font-size: 20px;
	}
	flex-direction: column;
	&:hover {
	
		background-color: ${colorFail};
		& i {
			color: ${colorWhite};
		}
	}
`

export const ItemWrapper = styled.div`
	 flex-wrap: wrap; 
	 justifyContent: center; 
	 padding: 20px; 
	 word-break: break-all; 
	 maxWidth: 260px;
	 transition: 0.5s all ease;
	 &:hover {
	 	transform: scale(1.05);
	 }
 `

export const Cleared = styled.div`
	background-color: ${colorGreen};
	display: flex;
	height: fit-content;
	cursor: pointer;
	margin: 0 5px;
	position: relative;
	&:before {
		display: none;
		position: absolute;
		top: 100%;
		z-index: 15;
		left: 0;
		${({ hover }) => hover  && `content: '${hover}';`}
		height: 50px;
		width: 150px;
		background-color: ${colorWhite};
	}
	&:hover{
		&:before {
			display: block;
		}
	}
	`