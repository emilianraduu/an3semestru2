import styled from 'styled-components'
import { colorBlack12, colorPrimary, spacingO1, spacingO2, spacingO3, spacingO4 } from '../abstract/variables'

export const FormItem = styled.div`
    display:flex;
    flex-direction:column;
    width:100%;
    ${({ row }) => row && 'flex-direction:row;'}
    ${({ center }) => center && 'justify-content:center;align-items:center;'}
    margin-bottom:${spacingO4};
    position: relative;
    margin-top:${spacingO2};
    ${({ image }) => image &&
  `& input
    {
      display:none;
    }`}
    ${({ gameRules }) => gameRules && `
      padding-bottom:5px;
    `}
    ${({fitContent})=>fitContent &&`width: fit-content;`}
    & .react-html5-camera-photo>img, .react-html5-camera-photo>video {
      width: 250px;
    }
`
export const Form = styled.form`
   
`


export const StaffFormWrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`

export const StaffFormFooter = styled.div`
  border-top: 1px solid ${colorBlack12};
`

export const DualBoxWrapper = styled.div`
  ${({ web }) => web && `display:flex;`}
`

export const FormWithToggle = styled.div`
  display:flex;
  justify-content: space-between;
  padding-bottom:1px;
  & * {
    align-self: center;
  }
`
export const StyledToggle = styled.div`
  span {
    input[type="checkbox"] + label {
      :after {
        background-color : transparent;
        border: 3px solid ${colorBlack12};
        width: 8px;
        height: 8px;
      }
    }
      input[type="checkbox"]:checked + label {
      :after {
        background-color : transparent;
        border: 3px solid ${colorPrimary};
        width: 8px;
        height: 8px;
      }
    }
  }
  
`
export const LoginForm = styled(Form)`
  display: flex;
   flex-flow: column;
   ${({ type }) => type === 'web' && `

    & > * {
      align-self: center;
      width: 400px;
    }
    justify-content: center;
  `}
`

export const DualFormWrapper = styled.div`
  display: flex;
  width: 100%;
  // & > * {
  //   align-self:center;
  // }
  ${({ mobile }) => mobile && `flex-flow:column;`}
  & > *:first-child{
    margin-right: ${spacingO1};
  }
  ${({ space }) => space && `justify-content:space-between;
    padding-top: ${spacingO3};
    padding-bottom: ${spacingO3};
    border-top: 1px solid ${colorBlack12};
    border-bottom: 1px solid ${colorBlack12};
  `}
`
