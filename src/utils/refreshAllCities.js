const refreshAllCities = (list, dispatch, fetchCityTemperatureList) => {
  // console.log(storedInfo);
  if (list.length > 0) {
    list.forEach((city) => {
      dispatch(fetchCityTemperatureList({ lat: city.lat, lon: city.lon }));
    });
  }
};

export default refreshAllCities;
