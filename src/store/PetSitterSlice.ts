import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PetSitter } from "../types/PetSitterList";

interface PetSitterState {
  petSitters: PetSitter[];
}

const initialState: PetSitterState = {
  petSitters: [],
};

export const petSitterSlice = createSlice({
  name: "petSitter",
  initialState,
  reducers: {
    setPetSitters: (state, action: PayloadAction<PetSitter[]>) => {
      state.petSitters = action.payload;
    },
    addPetSitter: (state, action: PayloadAction<PetSitter>) => {
      state.petSitters.push(action.payload);
    },
  },
});

export const { setPetSitters, addPetSitter } = petSitterSlice.actions;

export default petSitterSlice.reducer;
