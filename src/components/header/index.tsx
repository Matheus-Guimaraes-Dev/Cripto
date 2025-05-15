import style from "./header.module.css"; 
import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";

export function Header() {
  return(
    <header className={style.container}>
      <Link to="/"> <img src={logoImg} alt="Logo Cripto App" /> </Link>
    </header>
  )
}