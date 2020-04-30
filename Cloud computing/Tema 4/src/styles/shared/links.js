import styled from 'styled-components'
import { colorWhite, colorWhite60, fontSizeSmall } from '../abstract/variables'

export const LinksWrapper = styled.div`
  display:flex;
  justify-content: space-between;
  margin-top:5%;
`

export const ForgotPass = styled.p`
  color:${colorWhite60};
  font-size: ${fontSizeSmall};
  text-decoration: underline;
`
export const NewPlayer = styled.p`
  color:${colorWhite60};
  font-size: ${fontSizeSmall};
  text-decoration: underline;
  b {
    color:${colorWhite};
  }
`