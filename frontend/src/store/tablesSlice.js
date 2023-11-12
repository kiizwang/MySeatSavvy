import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTables = createAsyncThunk("tables/fetchTables", async () => {
  const response = await fetch("/tables");
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
});

export const tablesSlice = createSlice({
  name: "tables",
  initialState: {
    entities: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.status = "succeeded";
        // return the table data set
        state.entities = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default tablesSlice.reducer;
