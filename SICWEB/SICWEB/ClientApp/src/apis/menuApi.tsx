import axios from 'src/utils/axios';

export const getMenuList = async () => {
    const response = await axios.get<{}>('/api/data/menu', {});
    if (response.status === 200) return response.data;
    else return [];
}


export const deleteMenu = async (id) => {
    const response = await axios.post<{}>('/api/menu/deleteMenu', { id: id });
    if (response.status === 200) return response.data;
    else return [];
}

export const saveMenu = async (saveMenu) => {
    const response = await axios.post<{}>('/api/menu/saveMenu', saveMenu);
    if (response.status === 200) return response.data;
    else return [];
}

export const getParentMenus = async () => {
    const response = await axios.get<{}>('/api/menu/parentMenus', {});
    if (response.status === 200) return response.data;
    else return [];
}

export const getMenu = async (filter) => {
    const response = await axios.post<{}>('/api/menu/menus', filter);
    if (response.status === 200) return response.data;
    else return [];
}