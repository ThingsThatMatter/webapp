import React from 'react';
import { Col } from 'antd';

function AdCard() {
  return (
    
    <Col xs={{span:24}} md={{span:12}} lg={{span:8}} xl={{span:6}}>
      <div className="annonce-element">
        <img className="annonce-image" src="house.jpeg" />
        <div className="annonce-text">
            <div className="annonce-price-container">
                <span className="annonce-price">500 000 €</span>
                <span className="annonce-state open"></span>
            </div>
            <p className="annonce-address-title">8 rue Constance</p>
            <p className="annonce-address-sub">75018 Paris</p>
        </div>
        <div className="annonce-infos">
            <span className="annonce-area"><img src="expand.svg" width="20px"/> 55 <span>&nbsp;m2</span></span>
            <span className="annonce-room"><img src="floor-plan.png" width="20px"/> 3 <span>&nbsp;pièces</span></span>
            <span className="annonce-bedroom"><img src="bed.svg" width="20px"/> 2 <span>&nbsp;chambres</span></span>
        </div>
      </div>
    </Col>
    

  );
}

export default AdCard;
