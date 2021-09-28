import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import axios from 'axios';
import type { Business } from 'src/types/business';

const prefixEndpoint = 'https://localhost:44317/api/v1'

interface BusinessState {
  businesses: Business[];
  response: any;
};

const initialState: BusinessState = {
  businesses: [],
  response: null
};

const slice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    getBusinesses(state: BusinessState, action: PayloadAction<{ businesses: Business[]; }>) {
      const { businesses } = action.payload;

      state.businesses = businesses;
    },
    addBusiness(state: BusinessState, action: PayloadAction<{ data: any; }>) {
      const { data } = action.payload;

      state.response = data;
    },
    updateBusiness(state: BusinessState, action: PayloadAction<{ data: any; }>) {
      const { data } = action.payload;

      state.response = data;
    },
    deleteBusiness(state: BusinessState, action: PayloadAction<{ data: any }>) {
      const { data } = action.payload;

      state.response = data;
    },
  }
});

export const reducer = slice.reducer;

export const getBusinesses = (): AppThunk => async (dispatch) => {
  const response = await axios.get(prefixEndpoint + '/businesses/');

  dispatch(slice.actions.getBusinesses({businesses: response.data}));
};

export const addBusiness = (business: any): AppThunk => async (dispatch) => {
  const response = await axios.post(prefixEndpoint + '/businesses/', business);

  dispatch(slice.actions.addBusiness({data: response.data}));
};

export const updateBusiness = (business: any): AppThunk => async (dispatch) => {
  const response = await axios.put(prefixEndpoint + '/businesses/'+business.businessId, business);

  dispatch(slice.actions.updateBusiness({data: response.data}));
};

export const deleteBusiness = (businessId: number): AppThunk => async (dispatch) => {
  const response = await axios.delete(prefixEndpoint + '/businesses/'+ businessId);

  dispatch(slice.actions.deleteBusiness({ data: response.data }));
};

export default slice;
