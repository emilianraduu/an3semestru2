import styled from 'styled-components'
import {
  colorWhite02,
  colorPrimary,
  colorBlack60,
  secondaryTypeface,
  spacingX2,
  spacingO1, radiusX0,
  colorBlack90,
  colorFail80,
  colorBlack12, spacingX1, spacingO2, colorBlack02, colorFail, colorWhite
} from '../abstract/variables'

export const InputWrapper = styled.div`
  align-self: center;
  width: 100%;
  flex-flow: column;
  display:flex;
  &:nth-child(n+1){
  margin-top: ${spacingX2};
  }
  ${({ filter }) => filter && 'margin-left:50px;'}
  ${({ web }) => web && `
    width:30%;
  `}
  `
export const Input = styled.input`
    border-radius: ${radiusX0};
    appearance: none;
    border: none;
    padding: ${spacingO1} ${spacingO2};
    font-family: ${secondaryTypeface};
    font-size: 16px;
    border: 1px solid ${colorBlack12};
    color: ${colorBlack60};
    outline: none;
    box-sizing:border-box;
    width:100%;
    height:40px;
    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #000000;
      opacity: 0.15; /* Firefox */
    }
    
    ${({ error }) => error && `border-bottom:1px solid ${colorFail80};`}
    ${({ web }) => web && 'height:32px; max-width: 180px;'}
    ${({ login }) => login && 'border:none;'}
    ${({ inactive }) => inactive && `
      background-color:${colorBlack02};
    `}
    &:disabled {
      background: hsl(0,0%,95%);
    }
    ${({ normalizeDisabled }) => normalizeDisabled && `
    &:disabled{ 
      background: ${colorWhite}; 
  
  }`}
  ${({ header }) => header && `
  background: none;
  transition: 0.5s ease;
  border-radius: 20px;
  border-color: white;
  padding: 18px;
  max-width: initial;
  ::-webkit-input-placeholder {
    color: #fff;
    opacity: 1;
  }
  ::placeholder { 
     color: #fff;
     opacity: 1;
  }
  :focus{
    background: #fff;
      ::-webkit-input-placeholder {
        color: ${colorBlack60};
                opacity: 1;
      }
      ::placeholder { 
        color: ${colorBlack60};
        opacity: 1;
      }
  }
  `}
  ${({white})=>white && `background-color: #fff;`}
`

export const Textarea = styled.textarea`
    border-radius: ${radiusX0};
    appearance: none;
    border: none;
    padding: ${spacingO1} ${spacingO2};
    font-family: ${secondaryTypeface};
    font-size: 16px;
    border: 1px solid ${colorBlack12};
    color: ${colorBlack60};
    outline: none;
    box-sizing:border-box;
    width:100%;
    height:40px;
    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #000000;
      opacity: 0.15; /* Firefox */
    }
    
    ${({ error }) => error && `border-bottom:1px solid ${colorFail80};`}
    ${({ web }) => web && 'height:32px; max-width: 180px;'}
    ${({ login }) => login && 'border:none;'}
    ${({ inactive }) => inactive && `
      background-color:${colorBlack02};
    `}
    &:disabled {
      background: hsl(0,0%,95%);
    }
    ${({ normalizeDisabled }) => normalizeDisabled && `
    &:disabled{ 
      background: ${colorWhite}; 
  
  }`}
\`
`
export const InputWithIcon = styled.div`
  display:flex;
  border-radius: ${radiusX0};
  position: relative;
  background: white;
   border: 2px solid ${colorWhite02};
  & *{
    align-self: center;
  }
  justify-content: space-between;
 
  i {
    color:${colorBlack90};
    margin-right: ${spacingX1};
  }
 
 ${({ focus }) => focus && `border: 2px solid ${colorPrimary}; i { color: ${colorPrimary};}`} 
 
 ${({ filter }) => filter && `border: 1px solid ${colorBlack12};`}
 
 ${({ calendar }) => calendar && 'i {display:none;}'}
`

export const FilterInput = styled.div`
  display: flex;
  flex-flow: column;
  position: relative;
  justify-content: space-between;
  padding:  ${spacingX2};
  ${({ web }) => web && 'width:180px; padding: 0; margin: 0; margin-right: 32px;'} 
  & .css-1uccc91-singleValue {
    color: ${colorBlack60};
    overflow: initial;
  }
`

export const LoginError = styled.p`
  padding: 0;
  margin: 0;
  color: ${colorFail};
  position: absolute;
`
