import { createSlice } from "@reduxjs/toolkit";

export const configSlice = createSlice({
  name: "config",
  initialState: { weatherAPIkey: "ca9a63eb0fbdbc7a635cf92777b2549f" },
  reducers: {},
});

export default configSlice.reducer;
