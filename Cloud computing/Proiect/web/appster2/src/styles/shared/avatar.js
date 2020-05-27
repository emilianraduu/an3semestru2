import styled from 'styled-components'

import {
  boxShadow,
  colorBlack12,
  colorBlack60,
  colorFail,
  colorWhite,
  fontSizeBig,
  spacingX4,
  colorWarn
} from '../abstract/variables'


export const Avatar = styled.div`
  width: 34px;
  height: 34px;
  // cursor: pointer;
  align-self: center;
  border: 0.01px solid black;
  border-radius: 50%;
  vertical-align: center;
  box-shadow: ${boxShadow};
  border: 4px solid ${colorWhite};
  ${({ url }) => url && `background: url('${url}');
  `}
  ${({pointer})=>pointer&&`cursor: pointer;`}
  background-size: cover;
`

export const IDPhoto = styled.div`
  width: 50px;
  height: 50px;
  // cursor: pointer;
  align-self: center;
  border: 0.01px solid black;
  border-radius: 50%;
  vertical-align: center;
  box-shadow: ${boxShadow};
  border: 4px solid ${colorWhite};
  transition: 0.2s ease;
  ${({ url }) => url && `background: url('${url}');
  `}
  ${({pointer})=>pointer&&`cursor: pointer;`}
  background-size: cover;
  &:hover{
    width: 150px;
    height: 150px;
    z-index: 15;
  }
`

export const AvatarBig = styled(Avatar)`
  width:64px;
  height:64px;

  ${({ playerStats }) => playerStats && `
    display:flex;
    background:${colorWarn};
    justify-content: center;
     i {
      font-size: 35px;
      color:white;
      padding:9px;
     }
  `}
  ${({ cashFlow }) => cashFlow && `
    display:flex;
    background:#3db76e;
    justify-content: center;
     i {
      font-size: 35px;
      color:white;
      padding:9px;
     }
  `}
  ${({ left }) => left && `align-self: flex-start;`}
`
export const AvatarSmall = styled(Avatar)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 50%;
  border: 0;
  box-shadow: ${boxShadow};
  position: relative;
  ${({ url }) => url && `background: url('${url}')`}
  &:before {
    content: '';
    display: block;
    height: 26px;
    width: 26px;
    border-radius: 50%;
    border: 1px solid ${colorBlack12};
    position: absolute;
    top: -2px;
    left: -2px;
  }
`
export const AvatarAuth = styled(AvatarSmall)`
  display: flex;
  align-self: center;
  justify-content: center;
  flex-flow: column;
  border: 0;
  width: 80px;
  background: ${colorBlack60};
  height: 80px;
  margin: ${spacingX4} 0;
  & i {
    align-self: center;
    margin: 0;
    color: ${colorWhite};
    font-size: ${fontSizeBig};
  }
   &:before {
    content: '';
    display: block;
    height: 0;
    width: 0;
    border-radius: 50%;
    border: 1px solid ${colorBlack12};
    position: absolute;
    top: -2px;
    left: -2px;
  }
`

