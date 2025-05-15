import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./detail.module.css";
import { CoinProps } from "../home"; 

interface ResponseData {
  data: CoinProps
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export function Detail() {

  const { cripto } = useParams();
 
  const [coin, setCoin] = useState<CoinProps>()

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect( () => {

    async function getCoin() {

      try {
        
        const url = `https://rest.coincap.io/v3/assets/${cripto}`;

        const options = {
          headers: { 'Authorization': 'Bearer 3964644ab67a4606ac9aaccfe29dd887fc584515b8a1fa0da60e76f9f033cf9d' }
        }

        const response = await fetch(url, options);
      
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data: DataProps = await response.json();

        if("error" in data) {
          navigate("/");
          return;
        }

        const coinsData = data.data;

        const price = Intl.NumberFormat("en-us", {
          style: "currency",
          currency: "USD",
        })
  
        const priceCompact = Intl.NumberFormat("en-us", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        })

        const resultData = {
          ...coinsData,
          formatedPrice: price.format(Number(coinsData.priceUsd)),
          formatedMarket: priceCompact.format(Number(coinsData.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(coinsData.volumeUsd24Hr)),
        }

        setCoin(resultData)
        setLoading(false);

      } catch(err) {
        console.log(err);
        navigate("/");
      }

    }

    getCoin();

  }, [cripto])

  if(loading) {
    return(
      <div className={style.container}>
        <h4 className={style.center}> Carregando detalhes...</h4>
      </div>
    )
  }

  return(
    <div className={style.container}>
      <h1 className={style.center}> {coin?.name} </h1>
      <h1 className={style.center}> {coin?.symbol} </h1>

      <section className={style.content}>
        <img className={style.logo} src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} alt="Logo da Moeda" />

        <h1 className=""> {coin?.name} | {coin?.symbol} </h1>

        <p> <strong> Preço: </strong> {coin?.formatedPrice} </p>

        <a> <strong> Volume: </strong> {coin?.formatedVolume} </a>

        <a> <strong> Mudança 24h: </strong> <span className={Number(coin?.changePercent24Hr) > 0 ? style.profit : style.loss} > {Number(coin?.changePercent24Hr).toFixed(2)} </span> </a>

      </section>



    </div>
  )
}
