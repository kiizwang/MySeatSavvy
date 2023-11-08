import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRestaurants = createAsyncThunk("restaurants/fetchRestaurants", async () => {
  const response = await fetch("/restaurants");
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
});

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: {
    entities: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRestaurants.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = "succeeded";
        // return the restaurant data set
        state.entities = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default restaurantsSlice.reducer;

// Another approach without using "createAsyncThunk"

// import { createSlice } from "@reduxjs/toolkit";

// // Action types
// const FETCH_RESTAURANTS_START = 'restaurants/fetchRestaurantsStart';
// const FETCH_RESTAURANTS_SUCCESS = 'restaurants/fetchRestaurantsSuccess';
// const FETCH_RESTAURANTS_FAILURE = 'restaurants/fetchRestaurantsFailure';

// // Action creators
// export const fetchRestaurantsStart = () => ({ type: FETCH_RESTAURANTS_START });
// export const fetchRestaurantsSuccess = (restaurants) => ({ type: FETCH_RESTAURANTS_SUCCESS, payload: restaurants });
// export const fetchRestaurantsFailure = (error) => ({ type: FETCH_RESTAURANTS_FAILURE, error });

// // Thunk function (not using createAsyncThunk)
// export function fetchRestaurants() {
//   return async (dispatch) => {
//     dispatch(fetchRestaurantsStart());
//     try {
//       const response = await fetch("/restaurants");
//       if (!response.ok) throw new Error("Network response was not ok");
//       const data = await response.json();
//       dispatch(fetchRestaurantsSuccess(data));
//     } catch (error) {
//       dispatch(fetchRestaurantsFailure(error.message));
//     }
//   };
// }

// export const restaurantsSlice = createSlice({
//   name: "restaurants",
//   initialState: {
//     entities: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: {
//     [FETCH_RESTAURANTS_START]: (state, action) => {
//       state.status = 'loading';
//     },
//     [FETCH_RESTAURANTS_SUCCESS]: (state, action) => {
//       state.status = 'succeeded';
//       state.entities = action.payload;
//     },
//     [FETCH_RESTAURANTS_FAILURE]: (state, action) => {
//       state.status = 'failed';
//       state.error = action.error;
//     },
//   },
// });

// export default restaurantsSlice.reducer;
