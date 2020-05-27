import styled from 'styled-components'
import {
  colorSecondaryGradient,
  colorWhite,
  fontSizeNormal,
  secondaryTypeface,
  spacingX4,
  spacingX3,
  spacingO3,
  spacingX1,
  colorPrimary,
  colorBlack12,
  spacingX2,
  colorBlack60,
  colorBlack80,
  colorBlack90,
  fontSizeSmall,
  colorDigital, colorWhite40, colorBlack40, colorPrimary80, colorPrimary50, colorBlack, colorFail80, colorFail
} from '../abstract/variables'

export const Button = styled.button`
  &:focus {
    outline: none;
  }
  
  &:hover{
    cursor: pointer;
  }
  ${({ dropdown }) => dropdown && 'align-self:flex-start; padding:0; font-size:14px; i {font-size:16px;}'}
`

export const ButtonMain = styled(Button)`
  background: ${colorSecondaryGradient};
  padding: ${spacingX1} ${spacingX3};
  cursor: pointer;
  position: relative;
  display:flex;
  justify-content: center;
  border-radius: 100em;
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeNormal};
  font-weight: bold;
  text-transform: uppercase;
  line-height: 1.3;
  color: ${colorWhite};
  border: 4px solid ${colorWhite};
  &:focus {
     outline: 0;
  }
`

export const SecondaryButtonDiv = styled.div`
 border: 1px solid ${colorPrimary};
  color: ${colorPrimary};
  font-weight: bold;
  background: none;
  word-break: break-all;
  justify-content: center;
  display: flex;
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeSmall};
  text-transform: uppercase;
  padding: ${spacingX1} ${spacingX2};
  border-radius: 100px;
  cursor: pointer;
  ${({ full }) => full && `width:100%; margin-top: ${spacingO3};`}
    ${({remove})=>remove && `width: 100px; background-color: ${colorFail};
        background: none;
        border:none;
    color: ${colorFail};
    &:hover{
      background: ${colorFail80};
      color: white;
    }`}

`

export const SecondaryButton = styled(Button)`
  border: 1px solid ${colorPrimary};
  color: ${colorPrimary};
  font-weight: bold;
  background: none;
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeSmall};
  text-transform: uppercase;
  transition: 0.5s all ease;
  padding: ${spacingX1} ${spacingX2};
  border-radius: 100px;
   &:disabled{
    background: ${colorBlack40};
    border: none;
    cursor: not-allowed;
    &:hover {
      background: ${colorBlack40};
    }
  }
  &:hover {
    ${({ noHover }) => !noHover ? `
      background: ${colorPrimary};
      color: ${colorWhite};
    ` : `
    background-color:rgba(230, 240, 252,1);
    `
    }

  }
  ${({ full }) => full && `width:100%; margin-top: ${spacingO3};`}
  ${({ rightMargin }) => rightMargin && `margin-right: ${spacingX2};`}
  ${({ filled }) => filled && `
    background: ${colorPrimary};
    color: ${colorWhite};
    &:hover{
      background: ${colorPrimary80};
    }
  `}  
  ${({ red }) => red && `
    background: none;
    color: ${colorFail};
    &:hover{
      background: ${colorFail80};
    }
  `}  
  ${({ mobile }) => mobile && 'border: none; padding: 0;'}
  ${({ prizes }) => prizes && `
    border: none; padding: 0; padding-top:3px; padding-bottom:3px;
    &:hover{
      background: none;
      border: none;
      color: ${colorBlack};
    }
  `}
  ${({ tournaments }) => tournaments && `
    width:fit-content; 
    `}
   ${({ spaceBottom }) => spaceBottom && `margin-bottom: ${spacingX2};`}
  ${({ tournament }) => tournament && 'align-self:center;'}
 
`

export const PrimaryButton = styled(Button)`
  background: ${colorSecondaryGradient};
  outline: none;
  border: 4px solid ${colorWhite};
  padding: ${spacingX1} ${spacingX2};
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeNormal};
  font-weight: bold;
  color: ${colorWhite};
  text-transform: uppercase;
  border-radius: 30px;
  max-width: 300px;
  width: 100%;
  align-self: center;
  ${({ top }) => top && `margin-top: ${spacingX4};`}
`

export const ButtonIcon = styled.div`
  font-size: 20px;
  color: ${colorBlack80};
  border: none;
  background-color: transparent;
  &:hover {
    color: ${colorBlack90
}
`

export const ButtonAction = styled(Button)`
  border: 1px solid ${colorBlack12};
  padding: ${spacingX1} ${spacingX2};
  font-size: ${fontSizeNormal}
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 100em;
  background-color: ${colorPrimary};
  color: ${colorWhite};
  margin-bottom: 5px;
  opacity: .9;
  
  &:focus {
    border-color: ${colorPrimary};
  }
  
  &:hover {
    opacity: 1;
  }
  ${({color})=> color && `background-color: ${color};`}
`

export const ButtonLabel = styled(ButtonAction)`
  border: none;
  background-color: transparent;
  text-transform: capitalise;
  font-weight: normal;
  color: ${colorBlack60};
  ${({ lower }) => lower && 'text-transform: initial;'}
  ${({ white }) => white && `color: ${colorWhite}`}
`
