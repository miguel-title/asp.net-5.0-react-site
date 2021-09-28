import axios from 'src/utils/axios';

export const getSegments = async () => {
    const response = await axios.get<{}>('/api/item/segments', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const getProducts = async () => {
    const response = await axios.get<{}>('/api/item/products', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const getFamilies = async () => {
    const response = await axios.get<{}>('/api/item/allfamilies', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const getFamilies1 = async (segment) => {
    const response = await axios.post<{}>('/api/item/families', {id: segment });
    if(response.status === 200) return response.data;
    else return [];
}

export const getSubFamilies = async (family) => {
    const response = await axios.post<{}>('/api/item/subfamilies', {id: family});
    if(response.status === 200) return response.data;
    else return [];
}

export const getFamilyAndSub = async (pid) => {
    const response = await axios.post<{}>('/api/item/familysub', {id: pid});
    if(response.status === 200) return response.data;
    else return [];
}


export const getUnits = async () => {
    const response = await axios.get<{}>('/api/item/units', { });
    if(response.status === 200) return response.data;
    else return [];
}

export const saveFamily = async (family) => {
    const response = await axios.post<{}>('/api/item/saveFamily', family);
    if(response.status === 200) return response.data;
    else return [];
}

export const saveSubFamily = async (subFamily) => {
    const response = await axios.post<{}>('/api/item/SaveSubFamily', subFamily);
    if(response.status === 200) return response.data;
    else return [];
}

export const saveUnit = async (unit) => {
    const response = await axios.post<{}>('/api/item/saveunit', unit);
    if(response.status === 200) return response.data;
    else return [];
}

export const saveItem = async (saveItem) => {
    const response = await axios.post<{}>('/api/item/saveitem', saveItem);
    if(response.status === 200) return response.data;
    else return [];
}

export const deleteItem = async (id) => {
    const response = await axios.post<{}>('/api/item/deleteItem', {id: id});
    if(response.status === 200) return response.data;
    else return [];
}

export const getItem = async (filter) => {
    const response = await axios.post<{}>('/api/item/items', filter);
    if(response.status === 200) return response.data;
    else return [];
}