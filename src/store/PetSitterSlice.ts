import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PetSitterList, PetSitterDetail } from '../types/PetSitter';

interface PetSitterState {
  petSitters: PetSitterList[];
}

const initialState: PetSitterState = {
  petSitters: [],
};

export const petSitterSlice = createSlice({
  name: 'petSitter',
  initialState,
  reducers: {
    setPetSitters: (state, action: PayloadAction<PetSitterList[]>) => {
      state.petSitters = action.payload;
    },
    addPetSitter: (state, action: PayloadAction<PetSitterDetail>) => {
      state.petSitters.push(action.payload);
    },
  },
});

export const { setPetSitters, addPetSitter } = petSitterSlice.actions;

export default petSitterSlice.reducer;
