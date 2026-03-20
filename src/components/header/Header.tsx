import { Link } from "react-router-dom";

import favorites_icon from "../../assets/favourites-icon.svg";
import comparison_icon from "../../assets/comparison-icon.svg";
import list_icon from "../../assets/list-icon.svg";
import style from "./Header.module.scss";

const Header = () => {
  return (
    <header className={style.header_container}>
      <div className={style.header_user_actions}>
        <Link to="/" className={style.link}>
          <div className={style.user_actions_block}>
            <img src={list_icon} alt="list icon" width={30} height={30} />
            <h1>Список фильмов</h1>
          </div>
        </Link>
        <Link to="/favorite-movies" className={style.link}>
          <div className={style.user_actions_block}>
            <img
              src={favorites_icon}
              alt="favorites films icon"
              width={30}
              height={30}
            />
            <h1>Избранное</h1>
          </div>
        </Link>
        <div className={style.user_actions_block}>
          <img
            src={comparison_icon}
            alt="comparison films icon"
            width={30}
            height={30}
          />
          <h1>Сравнение</h1>
        </div>
        <div />
      </div>
    </header>
  );
};

export default Header;
