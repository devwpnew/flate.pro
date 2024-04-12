import { createAxiosPostRequest } from "helpers/modelHelper";

const defaultLimit = 20;

const usersModel = {

    getAdminList: async function(filter, sort, limit = defaultLimit, page, host = '', select) {
        const response = await createAxiosPostRequest('/api/v2/users/getAdminList', {
            filter, sort, limit, page, select
        }, host)

        return response
    }
}

export default usersModel;