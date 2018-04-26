import { resources, domain } from '../../const/Settings';
import Utilities from '../components/utils';

const spectrumService = resources.links.spectrumServiceUrl;
const piService = resources.links.piUserProfileApi;
const envType = domain.getEnvType();
let annHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Authorization': localStorage.getItem('secureToken'),
  'X-Caller': resources.links.xCaller[envType].ETEXT2_WEB['ETEXT2_PXE']
};

export const doSaveGroupService = data => fetch(`${spectrumService[envType]}/${data.context}/identities/${data.user}/notesX/tag`, {
  method: 'POST',
  headers: annHeaders,
  body: JSON.stringify(data.payLoad)
});
//ungroup service call
export const doUnGroupService = data => fetch(`${spectrumService[envType]}/${data.context}/identities/${data.user}/notesX/tag/` + data.tagId, {
  method: 'DELETE',
  headers: annHeaders,
  body: JSON.stringify(data.payLoad)
}); 

//rename group service call
export const doRenameGroupService = data => fetch(`${spectrumService[envType]}/${data.context}/identities/${data.user}/notesX/tag/` + data.tagId, {
  method: 'POST',
  headers: annHeaders,
  body: JSON.stringify(data.payLoad)
});