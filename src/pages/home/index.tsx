import style from "./home.module.css";
import { BsSearch } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState, useEffect } from "react";

export interface CoinProps {

  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp {

  data: CoinProps[];

}

export function Home() {
  
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offset, setOffset] = useState(0);

  const navigate = useNavigate();

  useEffect( () => {

    getData();

  }, [offset])

  async function getData(): Promise<void> {
    
    const url = `https://rest.coincap.io/v3/assets?limit=10&offset=${offset}`;

    const options = {
      headers: {
        'Authorization': 'Bearer 3964644ab67a4606ac9aaccfe29dd887fc584515b8a1fa0da60e76f9f033cf9d'
      }
    };

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data: DataProp = await response.json();

      const coinsData: CoinProps[] = data.data;

      const price = Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
      })

      const priceCompact = Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      })

      const formatedResult = coinsData.map( (item) => {
        const formated = {
          ...item, 
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
        }

        return formated;
      })

      // console.log(formatedResult)

      const listCoins = [...coins, ...formatedResult];

      setCoins(listCoins);

    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  }
  

  function handleSubmit(e: FormEvent):void {

    e.preventDefault();

    if(input === "") return;

    navigate(`/detail/${input}`);

  }

  function handleGetMore():void {

    if(offset === 0) {
      setOffset(10);
      return;
    }

    setOffset(offset + 10);

  }

  return(
    <main className={style.container}>
      <form onSubmit={handleSubmit} className={style.form}>

        <input 
          type="text"
          placeholder="Digite o nome da moeda... EX bitcoin"
          value={input}
          onChange={ (e) => setInput(e.target.value)}
        />

        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>

      </form>

      <table>
        <thead>
          <tr>
            <th scope="col"> Moeda </th>
            <th scope="col"> Valor Mercado </th>
            <th scope="col"> Preço </th>
            <th scope="col"> Volume </th>
            <th scope="col"> Mudança 24h </th>
          </tr>
        </thead>

        <tbody id="tbody">
          
          { coins.length > 0 && coins.map( (item) => (
            <tr className={style.tr} key={item.id}>
              <td className={style.tdLabel} data-label="Moeda"> 
                <div className={style.name}>

                  <img className={style.logo} src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} alt="Logo Cripto" />

                  <Link to={`/detail/${item.id}`}>
                    <span> {item.name} </span> | {item.symbol}
                  </Link>
                </div>
              </td>

              <td className={style.tdLabel} data-label="Valor Mercado">
                {item.formatedMarket}
              </td>

              <td className={style.tdLabel} data-label="Preço">
                {item.formatedPrice}
              </td>

              <td className={style.tdLabel} data-label="Volume">
                {item.formatedVolume}
              </td>

              <td className={Number(item.changePercent24Hr) > 0 ? style.tdProfit : style.tdLoss} data-label="Mudança 24h">
                <span> {Number(item.changePercent24Hr).toFixed(2)} </span>
              </td>

          </tr>
          ))}

        </tbody>
      </table>

      <button onClick={handleGetMore} className={style.buttonMore}> Carregar mais </button>

    </main>
  )
}
