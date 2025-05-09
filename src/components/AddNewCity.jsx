import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import plusIcon from "../assets/plus-icon.svg";
import searchIcon from "../assets/search-icon.svg";

import { fetchCitiesOptions, clearList } from "../globalState/searchSlice";
import { addCityAndGetDetails } from "../globalState/citiesSlice";

const AddNewCity = () => {
  const [inSearch, setInSearch] = useState(false);
  const inputRef = useRef();
  const searchList = useSelector((state) => state.search);
  const dispatch = useDispatch();
  // Focusing on search input when button clicked
  useEffect(() => {
    if (inSearch) {
      inputRef.current.focus();
    }
  }, [inSearch]);

  return (
    <div className="relative">
      {inSearch ? (
        <div
          className={`flex items-center gap-2 pl-4 pr-2 py-1 border-2 border-cyan-400 duration-300 ${
            searchList.length > 0 ? "rounded-t-md" : "rounded-3xl"
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            className="w-full focus:outline-none"
            placeholder="Enter city name..."
            onKeyDown={(event) => {
              if (event.key == "Enter") {
                dispatch(fetchCitiesOptions(inputRef.current.value));
              }
            }}
          />
          <button
            className="border-2 border-cyan-400 rounded-full p-1 hover:bg-cyan-300 duration-300 cursor-pointer"
            onClick={() => {
              dispatch(fetchCitiesOptions(inputRef.current.value));
            }}
          >
            <img src={searchIcon} alt="" className="" />
          </button>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 px-2 py-1 border-2 border-cyan-400 rounded-full duration-300 cursor-pointer hover:bg-cyan-300"
          onClick={() => setInSearch(true)}
        >
          Add new city
          <img src={plusIcon} alt="" className="" />
        </button>
      )}
      {searchList.length > 0 ? (
        <div className="absolute bottom-0 right-0 translate-y-full w-full text-white rounded-b-md overflow-hidden">
          {searchList.map((item) => (
            <button
              className="grid grid-cols-[auto_1fr_auto] items-center justify-items-start gap-2 w-full duration-300 cursor-pointer p-2 bg-cyan-700 hover:bg-cyan-800"
              key={item.cityName}
              onClick={() => {
                inputRef.current.value = "";
                dispatch(clearList());
                setInSearch(false);
                dispatch(
                  addCityAndGetDetails({
                    id: item.id,
                    name: item.cityName,
                    lat: item.lat,
                    lon: item.lon,
                    country: item.country,
                    state: item.state,
                    currentTemperature: item.currentTemperature,
                  })
                );
              }}
            >
              <span className="font-bold text-xl">{item.cityName}</span>
              <span className="text-base">
                {item.state ? item.state : item.country}
              </span>
              <span className="font-bold text-xl">
                {item.currentTemperature} C°
              </span>
            </button>
          ))}{" "}
        </div>
      ) : null}
    </div>
  );
};

export default AddNewCity;
