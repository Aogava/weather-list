import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  addCity,
  removeCity,
  rewriteList,
  fetchCityTemperatureList,
} from "../globalState/citiesSlice";
import refreshAllCities from "../utils/refreshAllCities";
import deleteIcon from "../assets/delete-icon.svg";
import refreshIcon from "../assets/refresh-icon.svg";

const CitiesList = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.citiesList);

  useEffect(() => {
    refreshAllCities(list, dispatch, fetchCityTemperatureList);
  }, []);

  useEffect(() => {
    localStorage.setItem("citiesList", JSON.stringify(list));
  }, [list]);

  // console.log(list);
  return (
    <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 md:max-w-5/6 xl:max-w-11/12">
      {list.map((city, index) => (
        <div className="relative" style={{ zIndex: 100 - index + 1 }}>
          <button
            className="peer [&.activated]:shadow-2xl py-10 w-full px-5 rounded-xl focus:outline-none border-2 scale-90 [&.activated]:scale-100 border-cyan-400 bg-cyan-50 hover:bg-cyan-200 duration-300 cursor-pointer text-start flex items-center gap-2 justify-between"
            key={city.name}
            onClick={(event) =>
              event.currentTarget.classList.toggle("activated")
            }
          >
            <span className="text-xl">{city.name}</span>
            <div className="flex flex-col items-end gap-1">
              <div className="text-xl">
                <span className="text-base">Current:</span>{" "}
                {city.currentTemperature} C°
              </div>
              <div className="text-xl">
                <span className="text-base">Feels like:</span>{" "}
                {city.feelsLikeTemperature} C°
              </div>
            </div>
          </button>

          <div className="absolute top-1/2 peer-[.activated]:bottom-0 md:peer-[.activated]:top-1/2 right-1/12 md:right-1/2 border-2 border-t-0 md:border-l-0 md:border-t-2 border-cyan-400 peer-[.activated]:shadow-2xl md:peer-[.activated]:right-0 -z-[1] peer-[.activated]:translate-y-full md:peer-[.activated]:-translate-y-1/2 md:peer-[.activated]:translate-x-full duration-500 cursor-default -translate-y-1/2 bg-cyan-50 p-2 flex items-center gap-5 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
            <button
              className="hover:bg-cyan-200 duration-300 cursor-pointer p-2 rounded-full border-2 border-cyan-400"
              onClick={() => dispatch(removeCity(city.name))}
            >
              <img src={deleteIcon} alt="" className="" />
            </button>
            <button
              className="hover:bg-cyan-200 duration-300 cursor-pointer p-2 rounded-full border-2 border-cyan-400"
              onClick={() =>
                dispatch(
                  fetchCityTemperatureList({ lat: city.lat, lon: city.lon })
                )
              }
            >
              <img src={refreshIcon} alt="" className="" />
            </button>
          </div>

          <div
            className={`${
              !city.weatherList ? "hidden" : null
            } absolute left-1/12 bottom-1/2 peer-[.activated]:bottom-0 -z-[2] duration-300 translate-y-full w-10/12 peer-[.activated]:shadow-2xl px-4 peer-[.activated]:pt-12 md:peer-[.activated]:pt-6 peer-[.activated]:pb-4 rounded-b-xl border-2 border-t-0 border-cyan-400 bg-cyan-50 h-0 peer-[.activated]:h-64 max-h-64 overflow-auto`}
          >
            <h4 className="pt-2 font-bold text-xl">Details for today</h4>
            <div className="flex justify-between gap-2">
              <h3 className="text-lg">Humidity</h3>
              <h4 className="text-lg">{city.humidity}%</h4>
            </div>
            <div className="flex justify-between gap-2">
              <h3 className="text-lg">Pressure</h3>
              <h4 className="text-lg">{city.pressure} mb</h4>
            </div>

            <h4 className="mt-2 font-bold text-xl">By hours</h4>
            <div className="grid grid-flow-col justify-items-center gap-5 overflow-auto pb-2">
              {city.weatherList?.slice(0, 9).map((weather) => {
                return (
                  <div className="border-b-2 border-cyan-400 flex flex-col items-center">
                    <span className="text-lg">{weather.temperature} C°</span>
                    <span className="text-xl">{weather.time}</span>
                    <span className="text-sm">{weather.relativeDate}</span>
                  </div>
                );
              })}
            </div>

            <h4 className="mt-2 font-bold text-xl">By day</h4>
            {city.groupedWeatherList?.map((weather) => {
              return (
                <div className="border-b-2 border-cyan-400 text-lg grid grid-cols-[1fr_repeat(4,auto)] gap-1">
                  <span className="">{weather.relativeDate}</span>
                  <span className="">{weather.temperature.min}</span>/
                  <span className="">{weather.temperature.max} C°</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CitiesList;
