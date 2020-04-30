import styled from 'styled-components'
import {
  colorBlack,
  spacingX4,
  spacingX2,
  spacingX8,
  colorBlack60,
  colorBlack12, spacingX1, spacingO4
} from '../abstract/variables'

export const WrapperPage = styled.div`
  background: #fafafa;
  display:flex;
  flex-direction: column;
  ${(props) => {
  if (props.black) {
    return `
        background: ${colorBlack};
        height: 100%;
        width: 100%;
        position: fixed;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background:rgba(0,0,0,0.8);
      `
  }
}}
  // background:rgba(0,0,0,0.8);
`
export const WrapperAuth = styled.div`
  align-self:center;
  display:flex;
  justify-content: center;
  flex-flow: column;
  
  padding: ${spacingX4};
  padding-top: 0;
  padding-bottom: 0;
  // align-items: center;
`
export const PageContent = styled.div`
    margin:${spacingX2};
    & form {
      ${({ flex }) => flex && `display:flex;`}
    }
    ${({ type, flex }) => {
  let style = ''
  if (type === 'mobile') style += `
      align-self: center;
      margin: 0;
      margin-top: auto;`
  if (type === 'web') style += `
    margin-left:${spacingX8};
    margin-right:${spacingX8};
    padding-top: 0;
   `
  if (flex) style += `display:flex;`
  return style
}}
}}
  ${({ details }) => details && `margin-left:${spacingX4};`}
  ${({ statistics }) => statistics && `margin-left:${spacingX4}; padding-left:${spacingX2}`}
`

export const WrapperContent = styled.div`
  margin-top: ${spacingX4};
  // margin-left: ${spacingX8};
  margin-right: ${spacingX8};
  ${({ table }) => table && `
    margin-left:0px;
  `}
  
`

export const WrapperFestival = styled.div`
  &:nth-child(n+1){
  margin-top: ${spacingX2}
  }
  `

export const FestivalTours = styled.div`
  margin-top: ${spacingX1};
  ${({ hide }) => hide && `height:0;
  overflow:hidden;`}
`

export const StatisticsWrapper = styled.div`
  
`

export const PageWrapperLeft = styled.div`
  display: flex;
  flex-flow: column;
  width: fit-content;
  position: relative;
  & > * {
    &:first-child{
      margin-top: 0;
    }
  }
  ${({ rightBorder }) => rightBorder && `
    position: relative;
    &:after {
      content: '';
      height: 100%;
      width: 1px;
      background: ${colorBlack12};
      position: absolute;
      right: 0;
    } 
  `}  
  
  ${({ tournamentListing }) => tournamentListing && `
  width:100%;
  `}
  ${({ reports }) => reports && `
    display:flex;
    flex-direction:column;
  `}
`

export const PageWrapperRight = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  & > * {
    & > *{
      &:first-child{
        margin-top: 0;
      }
    }
  }
  ${({ tournamentListing }) => tournamentListing && `
    width: fit-content;
    flex-direction:column;
    position:sticky;
    top: 190px;
  `}
  

  ${({ reports }) => reports && `
    display:flex;
    flex-direction:column;
  `}
  ${({ fit }) => fit && `width: fit-content;
  padding: ${spacingX2};
  `}

  ${({ padding }) => padding && `padding: ${spacingO4};
  padding-top: 0;
  flex-direction:column;`}

  ${({ playerDetails }) => playerDetails && `
    display:flex;
    flex-direction:column;
  `}
`

export const TitleWithMinimize = styled.div`
  display:flex;
  font-weight: bold
  font-size: 14px;
  color: ${colorBlack60};
  & > * {
    align-self: center;
    height: fit-content;
    width:fit-content;
  }
  
  & > p {
    color: ${colorBlack60};
 }
`

export const Icon = styled.div`
  transition: 0.5s all;
  display:flex;
  height: fit-content;
  width:fit-content;
  ${({ rotate }) => rotate && `
  transform: rotate(-180deg);`}
`

export const LoaderWrapper = styled.div`
 z-index: 10000;
 top: 0;
 left: 0;
 background: none;
 position: absolute;
 width: 100%;
 height: 100%;
 display: flex;
 padding: ${spacingO4};
 justify-content: center;
 & img {
  background: none;
 }
 `

