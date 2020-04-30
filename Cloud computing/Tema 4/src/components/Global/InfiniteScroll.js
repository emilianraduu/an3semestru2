import React from 'react'
import {LoaderWrapper} from '../../styles/shared/wrapper'
import LoaderImage from '../../assets/loader.svg'

export function Loader() {
    return (
        <LoaderWrapper>
            <img src={LoaderImage}/>
        </LoaderWrapper>
    )
}
