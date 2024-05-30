import React, { useEffect, useState } from "react";
import API from "pages/api/service/api";

export default async function getProductStatus(product) {
    
    const getStatus = async (product) => {
        const options = ['status', 'house_types', 'status_lands', 'commercial_types'];
        
        for (const option of options) {
            const value = product[option];
            if (value !== null && value !== undefined) {
                const printableValue = await API.get.product.fieldPrintableValue(option, value);
                return printableValue.toString(); 
            }
        }
        
        return null;
    }

	return await getStatus(product)
}
