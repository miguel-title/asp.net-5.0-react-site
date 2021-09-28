import axios from 'src/utils/axios';

export const getMenuList = async () => {
    const response = await axios.get<{}>('/api/data/menu', { });
    if(response.status === 200) return response.data;
    else return [];
}
