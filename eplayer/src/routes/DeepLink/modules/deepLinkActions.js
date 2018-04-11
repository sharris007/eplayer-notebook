import { resources, domain, typeConstants } from '../../../../const/Settings';

export const doTokenLogin = () => (dispatch) => {
  dispatch( 
          {type: 'DEEPLINK_TOKEN_LOGIN',
          data: {json : "zzzzzzzzzzzzzzzzzzzzzzzzz"} 
        });
}



const etextServiceUrl = resources.links['etextServiceUrl'];
const envType = domain.getEnvType();
export const doTokenLogin1 = (qparams) => (dispatch) => {
	let payLoad = {
		token: qparams.token,
        serviceUrl: qparams.serviceUrl,
        idpName:qparams.idpName,
        platform_id:qparams.platforms_id
	};
	const headers = {'Content-Type': 'application/json'	};    

	fetch(`${etextServiceUrl[envType]}/account/login?withIdpResponse=true`, {
		method: 'POST',
		headers ,
		body: JSON.stringify(payLoad)
	}).then(response => response.json()).then(onLoginSuccess,onLoginError);

	function onLoginSuccess(data) {
		console.log("deepLinktokenLogin Success ", data);
		dispatch(deepLinktokenLogin(data));
	}

	function onLoginError(err) {
		console.log("deepLinktokenLogin Success ", err);
	}
}

export const deepLinktokenLogin = (json) => ({
  type: typeConstants.DEEPLINK_TOKEN_LOGIN,
  data: json
});