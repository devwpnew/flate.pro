import React from "react";
import Image from 'next/image'

export default function createReactElementsFromAxios(fields, document_root) {

    let fieldsArray = [],
        sortable = {};

    if (fields.columns) {
        fields.columns.forEach((column) => {
            if (fields.element) {
                let writeValue = null;
                if (!column.isNullable && fields.element[column.column_name]) {
                    writeValue = fields.element[column.column_name]
                }
                if (column.descObj.is_edit_allowed) {
                    let input = false;

                    if (column.descObj.field_type == 'date') {
                        if (writeValue != null) {
                            input = <input type="date" required={column.descObj.is_required} defaultValue={writeValue} name={column.column_name}></input>
                        } else if (column.descObj.default_value) {
                            input = <input type="date" required={column.descObj.is_required} defaultValue={column.descObj.default_value} name={column.column_name}></input>
                        } else {
                            input = <input type="date" required={column.descObj.is_required} name={column.column_name}></input>
                        }
                    } else if (column.descObj.field_type == 'datetime-local') {
                        if (writeValue != null) {
                            if (writeValue.substring(writeValue.length - 1)) {
                                writeValue = new Date(writeValue);
                                writeValue.setHours(writeValue.getHours() + 3);
                                writeValue = writeValue.toISOString();
                                writeValue = writeValue.substring(0, writeValue.length - 1)
                            }
                            input = <input type="datetime-local" required={column.descObj.is_required} defaultValue={writeValue} name={column.column_name}></input>
                        } else if (column.descObj.default_value) {
                            input = <input type="datetime-local" required={column.descObj.is_required} defaultValue={column.descObj.default_value} name={column.column_name}></input>
                        } else {
                            input = <input type="datetime-local" required={column.descObj.is_required} name={column.column_name}></input>
                        }
                    } else if (column.descObj.field_type == 'checkbox') {
                        if (writeValue != null) {
                            input = <input type="checkbox" required={column.descObj.is_required} defaultChecked={writeValue} name={column.column_name}></input>
                        } else if (column.descObj.default_value) {
                            input = <input type="checkbox" required={column.descObj.is_required} name={column.column_name}></input>
                        } else {
                            input = <input type="checkbox" required={column.descObj.is_required} name={column.column_name}></input>
                        }
                    } else if (column.descObj.field_type == 'textarea') {
                        if (writeValue != null) {
                            input = <textarea required={column.descObj.is_required} defaultValue={writeValue} name={column.column_name}></textarea>
                        } else if (column.descObj.default_value) {
                            input = <textarea required={column.descObj.is_required} defaultValue={column.descObj.default_value} name={column.column_name}></textarea>
                        } else {
                            input = <textarea required={column.descObj.is_required} name={column.column_name}></textarea>
                        }
                    } else if (column.descObj.field_type == 'file') {
                        if (writeValue != null) {
                            const src = writeValue;
                            input = <><Image width="200" height="200" src={`https://flate.pro/${src}`} /><input type="file" onClick={(event) => { event.target.value = null }} name={column.column_name}></input></>
                        } else {
                            input = <input type="file" onClick={(event) => { event.target.value = null }} value={undefined} name={column.column_name}></input>
                        }
                    } else if (column.descObj.field_type == 'select' || column.descObj.field_type == 'multiple-select') {

                        let options = [];
                        options.push(<option value="0" key="false">Не выбрано</option>)
                        column.descObj.result_options.forEach(option_value => {
                            options.push(<option value={option_value.id ? option_value.id : option_value} key={option_value.id ? option_value.id : option_value}>{option_value.name ? option_value.name : option_value}</option>)
                        })

                        const isMultipleField = column.descObj.field_type == 'multiple-select'
                        let selectValue;
                        if (isMultipleField) {
                            selectValue = []
                            if(Array.isArray(writeValue)){
                                writeValue.forEach((value) => {
                                    if(typeof value == 'object'){
                                        selectValue.push(value.id)
                                    }else{
                                        selectValue.push(value)
                                    }
                                })
                            }else if(writeValue != undefined && typeof writeValue == 'object'){
                                selectValue.push(writeValue.id)
                            }else{
                                selectValue.push(writeValue)
                            }
                        }else{
                            if(typeof writeValue == 'object' && writeValue){
                                if(writeValue.id){
                                    selectValue = writeValue.id
                                }else{
                                    selectValue = writeValue.name
                                }
                            }else{
                                selectValue = writeValue
                            }
                        }

                        input = <><select multiple={isMultipleField} defaultValue={selectValue} name={column.column_name}>{options}</select></>
                    } else {
                        if (writeValue != null) {
                            input = <input type="text" required={column.descObj.is_required} defaultValue={writeValue} name={column.column_name}></input>
                        } else if (column.descObj.default_value) {
                            input = <input type="text" required={column.descObj.is_required} defaultValue={column.descObj.default_value} name={column.column_name}></input>
                        } else {
                            input = <input type="text" required={column.descObj.is_required} name={column.column_name}></input>
                        }
                    }

                    sortable[column.column_name] = {
                        value: (<label key={column.column_name}>
                            <span>{column.column_name}</span>
                            {input}
                        </label>), sort: column.descObj.sort
                    }
                } else {
                    let showValue = writeValue;
                    if (column.descObj.field_type == 'datetime-local') {
                        const date = new Date(writeValue);
                        showValue = date.toLocaleString('ru');
                    }

                    sortable[column.column_name] = {
                        value: (<div className="label" key={column.column_name}>
                            <span>{column.column_name}</span>
                            <span>
                                {
                                    showValue != undefined && typeof showValue == 'object' ? showValue.id : showValue
                                }
                            </span>
                        </div>), sort: column.descObj.sort
                    }
                }
            } else {
                if (column.descObj.is_edit_allowed) {

                    let input = false;
                    if (column.descObj.field_type == 'date') {
                        input = <input type="date" required={column.descObj.is_required} defaultValue={column.descObj.default_value} name={column.column_name}></input>
                    } else if (column.descObj.field_type == 'datetime-local') {
                        input = <input type="datetime-local" required={column.descObj.is_required} defaultValue={column.descObj.default_value} name={column.column_name}></input>
                    } else if (column.descObj.field_type == 'checkbox') {
                        input = <input type="checkbox" required={column.descObj.is_required} defaultChecked={column.descObj.default_value} name={column.column_name}></input>
                    } else if (column.descObj.field_type == 'textarea') {
                        input = <textarea required={column.descObj.is_required} defaultValue={column.descObj.default_value} name={column.column_name}></textarea>
                    } else if (column.descObj.field_type == 'file') {
                        input = <input type="file" onClick={(event) => { event.target.value = null }} name={column.column_name}></input>
                    } else if (column.descObj.field_type == 'select' || column.descObj.field_type == 'multiple-select') {
                        let options = [];
                        options.push(<option value="0" key="false">Не выбрано</option>)
                        column.descObj.result_options.forEach(option_value => {
                            options.push(<option value={option_value.id ? option_value.id : option_value} key={option_value.id ? option_value.id : option_value}>{option_value.name ? option_value.name : option_value}</option>)
                        })

                        input = <><select multiple={column.descObj.field_type == 'multiple-select'} defaultValue={column.descObj.default_value} name={column.column_name}>{options}</select></>
                    } else {
                        input = <input type="text" required={column.descObj.is_required} defaultValue={column.descObj.default_value} name={column.column_name}></input>
                    }

                    sortable[column.column_name] = {
                        value: (<label key={column.column_name}>
                            <span>{column.column_name}</span>
                            {input}
                        </label>), sort: column.descObj.sort
                    }
                }
            }
        })
        const keysSorted = Object.keys(sortable).sort(function (a, b) { return sortable[a].sort - sortable[b].sort })

        keysSorted.forEach((key) => {
            fieldsArray.push(sortable[key].value)
        })
    }

    if (fields.properties) {
        fieldsArray.push((<div key="prop_title">
            <h2 key="proph2">Properties</h2>
            <div className="text-sm text-white w-full h-full rounded md:text-black font-normal flex">
                <a className="gap-2.5 items-center pt-2.5 pb-2.5 px-5 bg-blue" href="/test_admin/properties/create">add property</a>
            </div>
        </div>))
        let sortableProps = {};
        if (fields.property_values) {

            const propertyValues = fields.property_values;

            fields.properties.forEach((property) => {

                let input = false;
                if (property.field_type == 'date') {
                    input = <input type="date" required={property.is_required} defaultValue={propertyValues[property.slug] ? propertyValues[property.slug] : property.default_value} name={"property_" + property.slug}></input>
                } else if (property.field_type == 'datetime-local') {
                    input = <input type="datetime-local" required={property.is_required} defaultValue={propertyValues[property.slug] ? propertyValues[property.slug] : property.default_value} name={"property_" + property.slug}></input>
                } else if (property.field_type == 'checkbox') {
                    input = <input type="checkbox" required={property.is_required} defaultChecked={propertyValues[property.slug] ? propertyValues[property.slug] : property.default_value} name={"property_" + property.slug}></input>
                } else if (property.field_type == 'textarea') {
                    input = <textarea required={property.is_required} defaultValue={propertyValues[property.slug] ? propertyValues[property.slug] : property.default_value} name={"property_" + property.slug}></textarea>
                } else if (property.field_type == 'file') {
                    if (propertyValues[property.slug]) {
                        if (propertyValues[property.slug].indexOf("," + 1) && typeof propertyValues[property.slug] == 'string') {
                            propertyValues[property.slug] = propertyValues[property.slug].split(',')
                        }
                        if (Array.isArray(propertyValues[property.slug] || typeof propertyValues[property.slug] === 'object')) {
                            input = propertyValues[property.slug].map((value) => {
                                return <Image width="200" height="200" key={`${value}`} src={`https://flate.pro/${value}`} />
                            })
                            input.push(<input key={property.slug} multiple={property.multiple} type="file" onClick={(event) => { event.target.value = null }} name={"property_" + property.slug}></input>)
                        } else {
                            input = <><Image width="200" height="200" src={`/${propertyValues[property.slug]}`} /><input type="file" onClick={(event) => { event.target.value = null }} name={"property_" + property.slug}></input></>
                        }
                    } else {
                        input = <input type="file" multiple={property.multiple} onClick={(event) => { event.target.value = null }} name={"property_" + property.slug}></input>
                    }
                } else {
                    input = <input type="text" required={property.is_required} defaultValue={propertyValues[property.slug] ? propertyValues[property.slug] : property.default_value} name={"property_" + property.slug}></input>
                }
                sortableProps[property.slug] = {
                    value: (<label key={"property_" + property.slug}>
                        <span>{property.name}</span>
                        {input}
                    </label>), sort: property.sort
                }
            })
        } else {
            fields.properties.forEach((property) => {
                let input = false;
                if (property.field_type == 'date') {
                    input = <input type="date" required={property.is_required} defaultValue={property.default_value} name={"property_" + property.slug}></input>
                } else if (property.field_type == 'datetime-local') {
                    input = <input type="datetime-local" required={property.is_required} defaultValue={property.default_value} name={"property_" + property.slug}></input>
                } else if (property.field_type == 'checkbox') {
                    input = <input type="checkbox" required={property.is_required} defaultChecked={property.default_value} name={"property_" + property.slug}></input>
                } else if (property.field_type == 'textarea') {
                    input = <textarea required={property.is_required} defaultValue={property.default_value} name={"property_" + property.slug}></textarea>
                } else if (property.field_type == 'file') {
                    input = <input type="file" multiple={property.multiple} onClick={(event) => { event.target.value = null }} name={"property_" + property.slug}></input>
                } else {
                    input = <input type="text" required={property.is_required} defaultValue={property.default_value} name={"property_" + property.slug}></input>
                }
                sortableProps[property.slug] = {
                    value: (<label key={"property_" + property.slug}>
                        <span>{property.name}</span>
                        {input}
                    </label>), sort: property.sort
                }
            })
        }


        const propKeysSorted = Object.keys(sortableProps).sort(function (a, b) { return sortableProps[a].sort - sortableProps[b].sort })

        propKeysSorted.forEach((key) => {
            fieldsArray.push(sortableProps[key].value)
        })
    }

    return fieldsArray;
}