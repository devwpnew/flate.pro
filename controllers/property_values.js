import { controllerError } from "helpers/database";
import db from "lib/postgresql/db";

const propertyValuesController = {
    getForItem: async ({table, itemId, code}) => {
        try {
            const getProperties = await db.any(`SELECT prop_code, prop_value FROM property_values WHERE prop_value_element = ${itemId} AND prop_value_table = '${table}'`)
            return getProperties
        } catch (e) {
            return controllerError(e, {table, itemId, code})
        }
    }
}

export default propertyValuesController;