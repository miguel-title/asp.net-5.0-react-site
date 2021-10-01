import axios from 'src/utils/axios';

export const getUser = async (filter) => {
    const response = await axios.post<{}>('/api/user/users', filter);
    if (response.status === 200) return response.data;
    else return [];
}

export const deleteUser = async (id) => {
    const response = await axios.post<{}>('/api/user/deleteUser', { id: id });
    if (response.status === 200) return response.data;
    else return [];
}

export const saveUser = async (saveUser) => {
    const response = await axios.post<{}>('/api/user/saveUser', saveUser);
    if (response.status === 200) return response.data;
    else return [];
}


export const getProfiles = async () => {
    const response = await axios.get<{}>('/api/user/getProfiles');
    if (response.status === 200) return response.data;
    else return [];
}
