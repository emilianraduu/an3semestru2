import styled from 'styled-components'
import { boxShadow, colorBlack80, fontSizeMedium, fontSizeNormal, radiusX1, spacingO3 } from '../abstract/variables'

export const MobileChartContainer = styled.div`
  display:flex;
  flex-direction:column;
  box-shadow: ${boxShadow};
  border-radius:${radiusX1};
  width:calc(100vw - 32px);
  height: 400px;
  justify-content:center;
  font-size:${fontSizeNormal};
  &:nth-child(n+2){
    margin-top: ${spacingO3};
  }

`

export const WebChartTitle = styled.p`
  margin-top:8%;
  margin-bottom:3%;
  color:${colorBlack80};
  text-align:center;
  font-size: ${fontSizeMedium};
  font-weight:20px;
`
export const WebChartContainer = styled.div`
  display: flex;
  flex-direction:column;
  box-shadow: ${boxShadow};
  border-radius:${radiusX1};
  margin: ${spacingO3};
  height:410px;
  width:350px;
  justify-content:center;
  ${({big})=> big && `width: 500px;`
  
}
`
export const MobileChartTitle = styled.p`
  margin-top:5%;
  margin-bottom:3%;
  color:${colorBlack80};
  text-align:center;
  font-size: ${fontSizeMedium};
  font-weight:20px;
`