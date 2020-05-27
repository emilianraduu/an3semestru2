import styled from 'styled-components'
import {
  colorBlack60,
  colorBlack40, colorWhite,
  mainTypeface,
  secondaryTypeface, fontSizeBigger, fontSizeMedium,
  fontSizeNormal,
  fontSizeSmall,
  fontSizeSmaller,
  fontSizeTiny,
  spacingX2,
  spacingX1,
  fontSizeJumbo,
  fontSizeBig,
  fontSizeMediumBig,
  lineHeight,
  colorPrimary, colorDigital, colorBlack90, colorBlack12, spacingX3, colorFail
} from '../abstract/variables'

export const H1 = styled.h1`
  font-family: ${mainTypeface};
  font-size: ${fontSizeJumbo};
  line-height: ${lineHeight};
  font-weight: bold;
  color: ${colorBlack90};

`

export const H2 = styled.h2`
  font-family: ${mainTypeface};
  font-size: ${fontSizeBigger};
  line-height: ${lineHeight};
  font-weight: bold;
  color: ${colorBlack90};

`

export const H3 = styled.h3`
  font-family: ${mainTypeface};
  font-size: ${fontSizeBig};
  line-height: ${lineHeight};
  font-weight: bold;
  color: ${colorBlack90};

`

export const H4 = styled.h4`
  font-family: ${mainTypeface};
  font-size: ${fontSizeMediumBig};
  line-height: ${lineHeight};
  font-weight: bold;
  color: ${colorBlack90};

`
export const H5 = styled.h5`
  font-family: ${mainTypeface};
  font-size: ${fontSizeMedium};
  line-height: ${lineHeight};
  font-weight: bold;
  color: ${colorBlack90};

`

export const GreyH5 = styled(H5)`
  color: ${colorBlack60};
  cursor: pointer;
  width: fit-content;
`


export const P = styled.p`
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeNormal};
  line-height: ${lineHeight};
  word-break: break-all;
  color: ${colorBlack90};
  ${({ bold }) => bold && 'font-weight: bold'}
`

export const Caption = styled.p`
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeSmall};
  line-height: ${lineHeight};
`

export const Overline = styled.p`
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeSmaller};
  line-height: ${lineHeight};
  ${({ cap }) => cap && 'text-transform: uppercase;'}
  ${({ spaced }) => spaced && `margin-bottom: ${spacingX1}`}
`

export const Nano = styled.p`
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeTiny};
  line-height: ${lineHeight};
`

export const A = styled.a`
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeNormal};
  line-height: ${lineHeight};
  color: ${colorPrimary};
  text-decoration: none;
  
  &:hover {
    color: ${colorDigital};
  }
  
  &:visited: {
    color: ${colorPrimary};
  }
`

export const Label = styled.label`
  font-family: ${secondaryTypeface};
  font-size: ${fontSizeSmaller};
  line-height: ${lineHeight};
  margin-bottom: ${spacingX1};
  ${({ upper }) => upper && `text-transform: uppercase;`}
`

export const PriceWrapper = styled.div``



export const LabelArrow = styled.label`
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
  background: ${colorWhite};
  border-radius: 50%;
  width: 20px;
  height:20px;
  border: 2px solid ${colorPrimary};
  display: flex;
  overflow: hidden;
  justify-content: center;
  & > i {
    align-self: center;
    font-size: 15px;
    font-weight: bold;
    color: ${colorPrimary};
  }
`

export const PasswordChangeWrapper = styled.div`
  max-height: 0px;
  overflow: hidden;
  transition: max-height 0.25s ease-in;
  ${({ expand }) => expand && `max-height: 300px;
    transition: max-height 0.25s ease-in;
`}
`

export const ProfileImage = styled.div`
  width: 100%;
  background: ${colorBlack12};
  height: 220px;
  background-size: contain;
`

export const LabelBox = styled(Label)`
  font-size: ${fontSizeSmall};
  color: ${colorBlack40};
  text-transform: capitalize;
  margin: 0;
`

export const LabelAuth = styled(Label)`
  color: ${colorWhite};
  margin-left: ${spacingX2};
  // text-transform: uppercase;
  margin-bottom: ${spacingX1};
  ${(props) => {
  if (props.center)
    return `align-self: center;
      margin: 0;`
}}
`

export const B = styled.b`
  font-weight: bold;
`

export const Small = styled.small`
  font-size: ${fontSizeSmall};
`

export const SmallP = styled(P)`
   font-size: ${fontSizeSmaller};
   display:flex;
   word-break: keep-all;
   & img {
    border-radius: 100%;
    width: 12px;
    height: 12px;
    align-self: center;
    object-fit: cover;
    margin-right: 5px;
   }
`


export const SmallPLink = styled(SmallP)`
  text-transform: capitalize;
  color: ${colorPrimary}
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  ${({ tournaments }) => tournaments && `
    align-self: flex-end;
    position: absolute;
    bottom:10px;
    right: 20px;
  `}
  ${({marginTop})=> marginTop && `margin-top: ${spacingX2};`}
  ${({color})=> color && `color: ${color};`}
`
export const SmallPBold = styled(SmallP)`
  font-weight: bold;
  ${(props) => {
  if (props.lowercase)
    return `text-transform: lowercase;`
}}
`

export const NormalP = styled(P)`
   font-size: ${fontSizeMedium};
   white-space: nowrap;
   color: #fff;
   ${({pointer})=> pointer && `cursor: pointer;`}
`

export const NormalPBold = styled(NormalP)`
   font-weight: bold;
`

export const BigP = styled(P)`
  font-size: ${fontSizeNormal};
  ${({uppercase}) => uppercase && `text-transform: uppercase;`}
  ${({bold}) => bold && `font-weight:bold;`}
 
`

export const BigPBold = styled(BigP)`
  font-weight: bold;
  ${({blackBoxMobile}) => blackBoxMobile && `
    margin-right:${spacingX1};
  `}
  ${({drop})=>drop && `color: ${colorWhite}; align-self: center;`}
  ${({huge})=>huge&&`font-size: 30px;`}
`

export const BigPGreyBold = styled(BigP)`
  color: ${colorBlack60};
  font-weight: bold;
   ${({ statistics }) => statistics && `font-weight:none; display:flex;`}
   ${({ mobile }) => mobile && `padding-bottom:25px;`}
   ${({white})=>white&&`color: white;`}

`
export const BigPGrey = styled(BigP)`
  color: ${colorBlack60};
`

export const H5Grey = styled(H5)`
  color: ${colorBlack60};
`

export const WhiteLink = styled(H5)`
  position: relative;
  white-space: nowrap;
   
    font-size: ${fontSizeNormal}
    font-weight: initial;
    font-family: ${secondaryTypeface};
    color: ${colorWhite};
    text-decoration: none;
  ${({ active, mobile }) => {
  let style = ''
  if (active) style += `
    &:after
    {
      position: absolute;
      content: '';
      width: 100%;
      height: 3px;
      background: ${colorWhite};
      left: 0;
      bottom: -${spacingX1};
    }
      font-weight: bold;
  `
  if (mobile)
    style += `margin-right: ${spacingX3};
    &:last-child{
      padding-right: ${spacingX3};
    }`
  return style
}
}
`
export const WhitePLink = styled(P)`
  color:${colorWhite};
  font-size: ${fontSizeSmaller};
  font-family: ${secondaryTypeface};
  text-decoration: underline;
  cursor:pointer;
  
`
export const BlackLink = styled(H5)`
  position: relative;
  text-transform: uppercase;
  
  & a {
    font-size: ${fontSizeNormal}
    font-weight: initial;
    font-family: ${secondaryTypeface};
    color: ${colorBlack90};
    text-decoration: none;
    
  }
  ${(props) => {
  if (props.active) return `
    &:after
    {
      position: absolute;
      content: '';
      width: 100%;
      height: 1px;
      background: ${colorBlack90};
      left: 0;
      bottom: -${spacingX1};
      
    }
    & a {
      font-weight: bold;
      cursor: default;
    }
  `
}}
`
