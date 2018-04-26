import { typeConstants } from '../../const/Settings';
import { doSaveGroupService, doUnGroupService, doRenameGroupService } from '../api/notebookApi';

//create group
export const saveGroupService = data => dispatch => doSaveGroupService(data)
	.then(response => response.json());
//ungroup
export const unGroupService = data => dispatch => doUnGroupService(data)
	.then(response => response.json());
//rename group	
export const renameGroupService = data => dispatch => doRenameGroupService(data)
	.then(response => response.json());