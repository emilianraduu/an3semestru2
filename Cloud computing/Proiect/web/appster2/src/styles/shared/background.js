import styled from 'styled-components'
export const PageImage = styled.div`
  background-size: cover;
  z-index: -1;
  background-repeat: no-repeat;
  opacity: 0.15;
  position: absolute;
  margin: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  ${({contain}) => contain && 'background-size: contain;' }
`

export const LoginImage = styled.div`
  background-size: contain;
  z-index: -1;
  background-repeat: no-repeat;
  opacity: 0.25;
  position: absolute;
  margin: 0;
  top: 0;
  left: 0;
  right: 0;
  width: 50%;
  height: 50%;
  bottom: 0;
  ${({contain}) => contain && 'background-size: contain;' }
`

export const LoginImageEffect = styled.div`
  width:38%;
  height:13%;
  background: rgba(0,0,0,0.8);
`