import cloudBG from "./assets/cloud-bg.png";
import sunCloudIcon from "./assets/sun-cloud-icon.png";
import refreshIcon from "./assets/refresh-icon.svg";

import AddNewCity from "./components/AddNewCity";
import CitiesList from "./components/CitiesList";
import RefreshAllCitiesButton from "./components/RefreshAllCitiesButton";

function App() {
  return (
    <div className="bg-gradient-to-b from-cyan-200 to-cyan-100 w-[100vw] min-h-[100vh] font-main overflow-hidden">
      <div className="relative z-50 max-w-[1920px] min-h-[100vh] mx-auto pb-72">
        <img
          src={cloudBG}
          alt=""
          className="absolute -right-1/4 -translate-y-1/2 top-0 -z-50 w-2/3 min-w-[850px] opacity-40"
        />
        <img
          src={cloudBG}
          alt=""
          className="absolute left-0 -translate-x-1/3 top-0 -z-50 w-3/4 min-w-[750px] opacity-30"
        />
        <img
          src={cloudBG}
          alt=""
          className="absolute left-1/5 top-3/5 -z-50 w-1/3 min-w-[550px] opacity-20 -scale-x-100"
        />

        <header className="px-[5%] grid grid-cols-2 md:grid-cols-3 items-center justify-between">
          <div className="hidden md:block"></div>
          <div className="justify-self-start md:justify-self-center relative">
            <div className="absolute -z-10 top-0 left-1/2 -translate-1/2 rounded-full w-[250%] h-[250%] bg-cyan-400">
              <div className="w-[90%] h-[100%] bg-amber-300 rounded-full mx-auto"></div>
            </div>

            <img src={sunCloudIcon} alt="" className="w-full max-w-22" />
          </div>
          <div className="justify-self-end pt-2 flex flex-col gap-2 items-end text-xs sm:text-lg">
            <AddNewCity />
            <RefreshAllCitiesButton />
          </div>
        </header>

        <section className="px-[5%] mt-10">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Your weather list
          </h1>
          <CitiesList />
        </section>
      </div>
    </div>
  );
}

export default App;
