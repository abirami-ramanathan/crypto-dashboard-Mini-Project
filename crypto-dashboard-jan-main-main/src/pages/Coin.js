import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Info from "../components/CoinPage/Info/index.js";
import LineChart from "../components/CoinPage/LineChart/index.js";
import SelectDays from "../components/CoinPage/SelectDays/index.js";
import ToggleComponent from "../components/CoinPage/ToggleComponent/index.js";
import Trading from "../components/CoinPage/Trading/index.js";
import Button from "../components/Common/Button/index.js";
import Header from "../components/Common/Header/index.js";
import Loader from "../components/Common/Loader/index.js";
import List from "../components/Dashboard/List/index.js";
import { getCoinData } from "../functions/getCoinData.js";
import { getPrices } from "../functions/getPrices.js";
import { settingChartData } from "../functions/settingChartData.js";
import { settingCoinObject } from "../functions/settingCoinObject.js";

function Coin() {
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{}] });
  const [coin, setCoin] = useState({});
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async () => {
    setLoading(true);
    let coinData = await getCoinData(id, setError);
    console.log("Coin DATA>>>>", coinData);
    settingCoinObject(coinData, setCoin);
    if (coinData) {
      const prices = await getPrices(id, days, priceType, setError);
      if (prices) {
        settingChartData(setChartData, prices);
        setLoading(false);
      }
    }
  };

  const handleDaysChange = async (event) => {
    setLoading(true);
    setDays(event.target.value);
    const prices = await getPrices(id, event.target.value, priceType, setError);
    if (prices) {
      settingChartData(setChartData, prices);
      setLoading(false);
    }
  };

  const handlePriceTypeChange = async (event, newType) => {
    setLoading(true);
    setPriceType(newType);
    const prices = await getPrices(id, days, newType, setError);
    if (prices) {
      settingChartData(setChartData, prices);
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      {loading || !coin?.id ? (
        <Loader />
      ) : (
        <>
          <div className="grey-wrapper">
            <List coin={coin} delay={0.1} />
          </div>
          <div className="grey-wrapper">
            <Trading coin={coin} />
          </div>
          <div className="grey-wrapper">
            <SelectDays days={days} handleDaysChange={handleDaysChange} />
            <ToggleComponent
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            <LineChart chartData={chartData} priceType={priceType} />
          </div>
          <div className="grey-wrapper">
            <Info heading={coin.name} desc={coin.desc} />
          </div>
        </>
      )}
    </div>
  );
}

export default Coin;
