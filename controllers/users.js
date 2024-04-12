import { controllerError, filterToString, offsetToString, selectToString, sortToString } from "helpers/database"
import db from "lib/postgresql/db";

const usersController = {
    tableName: 'users',
    defaultLimit: 20,
    selectFields: ['id', 'user_name', 'phone', 'email', 'user_group', 'date_registered', 'date_paid_to', 'paid', 'user_description', 'user_last_name', 'favorites', 'email_confirmed', 'phone_confirmed', 'email_confirmation', 'user_avatar', 'user_agency', 'default_city', 'professional_confirmation', 'sef_code', 'additional_phones', 'product_count', 'last_login_date', 'paid', 'date_paid', 'date_paid_to', 'date_notifications_read', '( SELECT count(*) FROM product WHERE product.user_id = users.id ) as count_product'],

    getAdminList: async ({filter, sort, limit = 1, page, select = usersController.selectFields}) => {

        if(limit && !Number(limit) && limit != "all") {
            throw new Error(`limit должен быть числом`)
        }
        if(page && !Number(page)) {
            throw new Error(`page должен быть числом`)
        }

        const limitVar = limit ? limit : usersController.defaultLimit

        const limitStr = limitVar != 'all' ? `LIMIT ${limitVar}` : ''

        const filterStr = filterToString(filter)

        const offsetStr = offsetToString(page, limitVar) 

        const selectStr = selectToString(select)

        const sortStr = sortToString(sort)

        // const selectioStr = `${usersController.selectFields.join(', ')}`;
        const query = `SELECT ${selectStr} FROM users ${filterStr} ${sortStr} ${limitStr} ${offsetStr}`;

        try {
            const request = await db.any(query)
            if(limitVar == 1){
                return request[0]    
            }
            return request
        } catch (e) {
            return controllerError(e, {function: 'selectionController.get', query})
        }
    }

}

export default usersController;