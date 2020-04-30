import React, { useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { BrowserView, isMobile } from 'react-device-detect'
import { PageContent, WrapperAuth } from '../../styles/shared/wrapper'
import { Logo } from '../../styles/shared/logo'
import { PageTitle } from '../Global/Header/HeaderTopMob'
import { LabelAuth } from '../../styles/typography/typography'
import { AvatarAuth } from '../../styles/shared/avatar'
import { USER_ICON } from '../../styles/abstract/variables'
import { LoginForm } from '../../styles/shared/form'
import { InputWrapper, LoginError } from '../../styles/shared/input'
import { AuthContext } from './AuthContext'
import GoogleLogin from 'react-google-login'
import { googleId } from '../../config/constants'
import { login } from './AuthActions'

function LoginView ({ history }) {
	const authContext = useContext(AuthContext)
	const { errorLogin } = authContext.state
	return (
		<>
			<BrowserView>
				<PageContent type={'web'}>
					<WrapperAuth>
						<Logo web>
							<Link to='./'>{PageTitle}</Link>
						</Logo>
						<LabelAuth center>Login</LabelAuth>
						<AvatarAuth><i className={USER_ICON}/></AvatarAuth>
						<LoginForm type={'web'}>
							<InputWrapper web={!isMobile}>

							</InputWrapper>
							<InputWrapper web={!isMobile}>
								{
									errorLogin && <LoginError>Invalid credentials</LoginError>
								}
								<GoogleLogin
									clientId={googleId}
									buttonText="LOGIN"
									onSuccess={(e) => login({ authContext, email: e.profileObj.email })}
									onFailure={() => login({ authContext })}
									cookiePolicy={'single_host_origin'}
								/>
							</InputWrapper>
						</LoginForm>

					</WrapperAuth>
				</PageContent>
			</BrowserView>
		</>
	)
}

export default withRouter(LoginView)