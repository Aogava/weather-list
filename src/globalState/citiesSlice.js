import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import convertMillisecondsToRelativeDate from "../utils/convertMillisecondsToRelativeDate";
import { changeList } from "./searchSlice";

// Getting temperature
const fetchCityTemperatureList = createAsyncThunk(
  "citiesList/fetchCityTemperatureList",
  async ({ lat, lon }, thunkAPI) => {
    const state = thunkAPI.getState();
    const params = {
      lat,
      lon,
      units: "metric",
      appid: state.config.weatherAPIkey,
    };
    // Getting forecast info
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${new URLSearchParams(
        params
      )}`
    );
    const jsonResult = await result.json();
    // Creating copy of state and searching city on which we are gonna add info
    const finalResult = JSON.parse(JSON.stringify(state.citiesList));
    const necessaryCity = finalResult.find(
      (city) => city.id == jsonResult.city.id
    );
    // Updating current weather values
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${new URLSearchParams(
        params
      )}`
    );

    const currentValues = await response.json();

    necessaryCity.currentTemperature = Math.round(currentValues.main.temp);
    necessaryCity.feelsLikeTemperature = Math.round(
      currentValues.main.feels_like
    );
    necessaryCity.pressure = currentValues.main.pressure;
    necessaryCity.humidity = currentValues.main.humidity;

    // console.log(necessaryCity);
    // Adding info into necessary city
    necessaryCity.weatherList = jsonResult.list.map((weather) => {
      // Converting UNIX seconds to JavaScript milliseconds and to workable date
      const dateObj = convertMillisecondsToRelativeDate(weather.dt * 1000);
      // console.log(dateObj);
      return {
        relativeDate: dateObj.relativeDate,
        time: dateObj.time,
        temperature: Math.round(weather.main.temp),
      };
    });
    // Grouping temperatures to get min/max values from each day
    const ignoreDateList = [];
    necessaryCity.groupedWeatherList = [];

    for (let i = 0; i < necessaryCity.weatherList.length; i++) {
      const weather = necessaryCity.weatherList[i];
      // If that day wasn't processed, then add it to ignore list for next time.
      if (
        ignoreDateList.findIndex(
          (weekName) => weekName == weather.relativeDate
        ) == -1
      ) {
        ignoreDateList.push(weather.relativeDate);
      }
      // If that day was processed, then skip it.
      else {
        continue;
      }
      // Filtering array by date name
      const filteredByRelativeDate = necessaryCity.weatherList.filter(
        (innnerWeather) => innnerWeather.relativeDate == weather.relativeDate
      );
      // Calculating maximum temperature value
      const biggestTemperature = filteredByRelativeDate.reduce(
        (accumulator, currentValue) => {
          // console.log(currentValue.temperature);
          return currentValue.temperature > accumulator
            ? currentValue.temperature
            : accumulator;
        },
        0
      );
      // Calculating minimum temperature value
      const smallestTemperature = filteredByRelativeDate.reduce(
        (accumulator, currentValue) => {
          // console.log(currentValue.temperature);
          return currentValue.temperature < accumulator
            ? currentValue.temperature
            : accumulator;
        },
        500
      );
      // console.log(
      //   filteredByRelativeDate[0].relativeDate +
      //     " " +
      //     smallestTemperature +
      //     " " +
      //     biggestTemperature
      // );
      necessaryCity.groupedWeatherList.push({
        relativeDate: weather.relativeDate,
        temperature: {
          min: smallestTemperature,
          max: biggestTemperature,
        },
      });
    }

    // finalResult.forEach(
    //   (city, index) =>
    //     (city.currentTemperature = Math.round(weatherReports[index].main.temp))
    // );

    return finalResult;
  }
);

const addCityAndGetDetails = createAsyncThunk(
  "citiesList/addCityAndGetDetails",
  async (newCityObj, thunkAPI) => {
    thunkAPI.dispatch(addCity(newCityObj));
    thunkAPI.dispatch(
      fetchCityTemperatureList({ lat: newCityObj.lat, lon: newCityObj.lon })
    );
  }
);

export const citiesSlice = createSlice({
  name: "citiesList",
  initialState: JSON.parse(localStorage.getItem("citiesList")) || [],
  reducers: {
    addCity: (state, action) => {
      if (state.findIndex((city) => city.name == action.payload.name) == -1) {
        // state.push(action.payload);
        return [...state, action.payload];
        // console.log(action.payload);
      }
    },
    removeCity: (state, action) => {
      return state.filter((city) => city.name != action.payload);
    },
    rewriteList: (state, action) => {
      return state.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCityTemperatureList.fulfilled, (state, action) => {
      // console.log(action.payload);
      return action.payload;
    });
  },
});

export const { addCity, removeCity, rewriteList } = citiesSlice.actions;
export { fetchCityTemperatureList, addCityAndGetDetails };
export default citiesSlice.reducer;
