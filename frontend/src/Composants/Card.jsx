import React from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/css/Card.scss';
import img1 from "../assets/images/image1.png";
import img2 from "../assets/images/image2.png";
import img3 from "../assets/images/image3.png";
import img4 from "../assets/images/image4.png";
import img5 from "../assets/images/image5.png";

const Card = () => {
  const { t } = useTranslation();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      document.querySelectorAll('.slick-active .clash-card img').forEach(img => img.style.display = 'none');
    },
    afterChange: (current) => {
      document.querySelectorAll('.slick-active .clash-card img').forEach(img => img.style.display = 'block');
    }
  };

  return (
    <div className="slide-container">
      <Slider {...settings}>
        {[1, 2, 3, 4, 5].map(step => (
          <div className="wrapper" key={step}>
            <div className="clash-card infraction">
              <div className="clash-card__image clash-card__image--infraction">
                <img src={eval(`img${step}`)} alt={`infraction ${step}`} />
              </div>
              <div className="clash-card__level clash-card__level--infraction">{t(`card.step${step}.title`)}</div>
              <div className="clash-card__unit-name">{t(`card.step${step}.description`)}</div>
              <div className="clash-card__unit-description">
                {t(`card.step${step}.description`)}
              </div>
              <div className="clash-card__unit-stats clash-card__unit-stats--infraction clearfix">
                <div className="one-third">
                  <div className="stat">{t(`card.step${step}.duration`)}</div>
                  <div className="stat-value">Durée</div>
                </div>
                <div className="one-third">
                  <div className="stat">{t(`card.step${step}.difficulty`)}</div>
                  <div className="stat-value">Difficulté</div>
                </div>
                <div className="one-third no-border">
                  <div className="stat">{t(`card.step${step}.cost`)}</div>
                  <div className="stat-value">Coût</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Card;
