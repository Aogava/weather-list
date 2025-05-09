import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const fetchCitiesOptions = createAsyncThunk(
  "search/fetchCitiesOptions",
  async (cityName, thunkAPI) => {
    if (cityName == "") {
      return [];
    }

    const state = thunkAPI.getState();
    // Getting list of all similar cities for search list
    const params = {
      q: cityName,
      appid: state.config.weatherAPIkey,
    };
    const result = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?${new URLSearchParams(
        params
      )}`
    );
    const jsonResult = await result.json();
    // Setting available info for future save
    const finalResult = jsonResult.map((option) => ({
      id: null,
      cityName: option.name,
      lat: option.lat,
      lon: option.lon,
      country: option.country,
      state: option.state,
      currentTemperature: null,
      feelsLikeTemperature: null,
      pressure: null,
      humidity: null,
    }));
    // Getting current weather for all cities in the search list
    const weatherReports = await Promise.all(
      finalResult.map(async (city) => {
        const params = {
          lat: city.lat,
          lon: city.lon,
          units: "metric",
          appid: state.config.weatherAPIkey,
        };
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?${new URLSearchParams(
            params
          )}`
        );

        return await response.json();
      })
    );
    // Rounding temperature for more convenient future output and saving cities IDs for future use
    finalResult.forEach((city, index) => {
      city.currentTemperature = Math.round(weatherReports[index].main.temp);
      city.feelsLikeTemperature = Math.round(
        weatherReports[index].main.feels_like
      );
      city.pressure = weatherReports[index].main.pressure;
      city.humidity = weatherReports[index].main.humidity;
      city.id = Math.round(weatherReports[index].id);
    });

    return finalResult;
  }
);

export const searchSlice = createSlice({
  name: "search",
  initialState: [],
  reducers: {
    changeList: (state, action) => {
      return action.payload;
    },
    clearList: (state, action) => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCitiesOptions.fulfilled, (state, action) => {
      // console.log(action.payload);
      return action.payload;
    });
  },
});

export const { changeList, clearList } = searchSlice.actions;
export { fetchCitiesOptions };
export default searchSlice.reducer;
