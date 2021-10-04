import { profile } from 'console';
import axios from 'src/utils/axios';
import { saveOPC } from './menuApi';

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

export const saveProfile = async(saveProfile) => {
    const response = await axios.post<{}>('/api/user/saveProfile', saveProfile);
    if (response.status === 200) return response.data;
    else return [];
}


export const getProfile = async (id) => {
    const response = await axios.post<{}>('/api/user/getProfile', {id:id});
    if (response.status === 200) return response.data;
    else return [];
}

export const getAccessProfile = async(profileid) => {
    const response = await axios.post<{}>('/api/user/getAccessProfile', profileid);
    if (response.status === 200) return response.data;
    else return [];
}


export const getCheckedValues = async(profileid) => {
    const response = await axios.post<{}>('/api/user/getCheckedValues', {id: profileid});
    if (response.status === 200) return response.data;
    else return [];
}

export const getCheckedcrudValues = async(profileid) => {
    const response = await axios.post<{}>('/api/user/getCheckedcrudValues', {id:profileid});
    console.log(response,"response")
    if (response.status === 200) return response.data;
    else return [];
}