import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchCityTemperatureList } from "../globalState/citiesSlice";
import refreshAllCities from "../utils/refreshAllCities";
import refreshIcon from "../assets/refresh-icon.svg";

const RefreshAllCitiesButton = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.citiesList);

  useEffect(() => {
    localStorage.setItem("citiesList", JSON.stringify(list));
  }, [list]);

  // console.log(list);
  return (
    <button
      className="flex items-center gap-2 px-2 py-1 border-2 border-cyan-400 rounded-full duration-300 cursor-pointer hover:bg-cyan-300"
      onClick={() => {
        refreshAllCities(list, dispatch, fetchCityTemperatureList);
      }}
    >
      Refresh all cities info
      <img src={refreshIcon} alt="" className="" />
    </button>
  );
};

export default RefreshAllCitiesButton;
