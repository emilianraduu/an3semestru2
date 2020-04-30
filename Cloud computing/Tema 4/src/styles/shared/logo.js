import styled from 'styled-components'
import { colorWhite, fontSizeBigger, fontSizeMedium, lineHeight, mainTypeface } from '../abstract/variables'
import { H1 } from '../typography/typography'

export const Logo = styled(H1)`
  line-height: initial;
  align-self: center;
  margin: 0;
   font-size: ${fontSizeMedium};
  & > a {
    font-family: ${mainTypeface};
    color: ${colorWhite};
    // line-height: ${lineHeight};
    text-decoration: none;
    align-self: center;
   
    margin: 0;
    
  ${(props) => {
  if (props.mob) return`
    font-size: ${fontSizeMedium};
 `
  if (props.web) return`
    font-size: ${fontSizeBigger};
    justify-content: center;
    display:flex;
 `
  }}
  }
`