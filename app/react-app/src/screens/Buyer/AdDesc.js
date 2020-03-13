import React, { useState, useEffect } from 'react';
import { Layout, Button, Switch, Collapse, Col, Row } from 'antd';
import { Slide } from 'react-slideshow-image';
import { Redirect, Link } from 'react-router-dom';
import UserNavHeader from '../../components/UserNavHeader';

import LoggedOut from '../../components/buyerAdDesc/LoggedOut'
import SidebarBuyer from "../../components/buyerAdDesc/SidebarBuyer";

import { connect } from "react-redux";

const { Content } = Layout;
const { Panel } = Collapse;

const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true
};

function AdDesc(props) {

  const [adDetails, setAdDetails] = useState({});

  const [adPhotos, setAdPhotos] = useState([]);
  const [adDocuments, setAdDocuments] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false)

/* -----------------------------------------------LOAD AD FROM DB------------------------------------------ */

  useEffect(() => {

      const dbFetchPublic = async () => {
        const data = await fetch(`/user/ad/${props.match.params.ad_id}/public`);
        const body = await data.json();

        setAdDetails(body.data);
        setAdPhotos(body.data.photos);
        setAdDocuments(body.data.files);

      };
      dbFetchPublic();

  }, []);

  useEffect(() => {

    const saveAd = async () => {
      const saveAdUser = await fetch(`/user/ad/${props.match.params.ad_id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.userToken}
      })

      const body = await saveAdUser.json()
      if (body.message === 'OK') {
        setLoggedIn(true)
      } else {
        // Il faudra gérer un message d'erreur
      }
    }
    saveAd()

}, [props.userToken]);

  /* Price formatting */
  const priceFormatter = new Intl.NumberFormat("fr", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    useGrouping: true
  });

  let photos = adPhotos.map((e, i) => {
    return (
      <div key={i} className="each-slide">
        <div style={{ backgroundImage: `url(${e})` }}> </div>
      </div>
    );
  });


  /* -----------------------------------------------HANDLE SIDEBAR------------------------------------------ */
  let sidebar ;
  if (loggedIn === false) {
    sidebar = <LoggedOut adId={props.match.params.ad_id}/>
  } else {
    sidebar = <SidebarBuyer adId={props.match.params.ad_id} userToken={props.userToken}/>
  }

  return (
    <Layout className="user-layout">
      <UserNavHeader current="Biens consultés" />

      <Layout className="user-layout main-content">
        <Content>
          <Link
            className="go-back"
            to={`/`}
            style={{ margin: "0px 0px 2em 0px" }}
          >
            &lt; Retour aux annonces
          </Link>

          <h4>> {adDetails.city}</h4>
          <h1>{adDetails.title}</h1>

          <Row gutter={32} className="section-text">
            <Col
              xs={{ span: 24 }}
              md={{ span: 18 }}
              lg={{ span: 18 }}
              xl={{ span: 18 }}
            >
              <div className="slide-container">
                <Slide {...properties}>{photos}</Slide>
              </div>

              {/* PARTIE DESCRIPTION */}

              <h2 className="pageSubTitle">Descriptif</h2>

              <div className="section ad-main-details">
                <div className="row">
                  <span>
                    <img src="../../../expand.svg" width="20px" />
                    <strong>{adDetails.area}</strong> m<sup>2</sup>
                  </span>
                  <span>
                    <img src="../../../floor-plan.png" width="20px" />
                    <strong>{adDetails.rooms}</strong> pièces
                  </span>
                  <span>
                    <img src="../../../bed.svg" width="20px" />
                    <strong>{adDetails.bedrooms}</strong> chambres
                  </span>
                </div>

                <div className="dark-row">
                  <div className="row">
                    <span>
                      <img src="../../../elevator.png" width="20px" /> Ascenseur
                    </span>
                    <span>
                      <img src="../../../balcony.png" width="20px" /> Balcon
                    </span>
                    <span>
                      <img src="../../../floor.png" width="20px" /> Terrasse
                    </span>
                  </div>
                </div>

                <div className="section-text">
                  <p style={{ textAlign: "justify" }}>
                    {adDetails.description}
                  </p>
                </div>
              </div>

              {/* PARTIE PRIX ET HONNORAIRES */}

              <Row gutter={30}>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 24 }}
                >
                  <h2 className="pageSubTitle">Prix & honoraires</h2>

                  <div className="section">
                    <div className="section-text">
                      <p>
                        <span style={{ fontWeight: 700 }}>
                          {priceFormatter.format(
                            (adDetails.price * adDetails.fees) / 100 +
                              adDetails.price
                          )}{" "}
                        </span>{" "}
                        TTC
                      </p>
                      <p>
                        <span style={{ fontWeight: 700 }}>
                          {priceFormatter.format(adDetails.price)}
                        </span>{" "}
                        hors honoraires
                      </p>
                      <p>
                        <span style={{ fontWeight: 700 }}>
                          {adDetails.fees}
                        </span>
                        % honoraires à la charge de{" "}
                        <span style={{ fontWeight: 700 }}>l'acquéreur</span>
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* PARTIE DIAGNOSTIQUE ELECTRIQUE */}
              <Row>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 24 }}
                >
                  <h2 className="pageSubTitle">Diagnostique électrique</h2>

                  <div className="section">
                    <div className="section-text">
                      <p>
                        <span style={{ fontWeight: 700 }}>{adDetails.dpe}</span>{" "}
                        kWhEP/m² /an
                      </p>
                      <p>
                        <span style={{ fontWeight: 700 }}>{adDetails.ges}</span>{" "}
                        kgeqCO2/m² /an
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* QUESTIONS FREQUENTS */}
              <Row>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 24 }}
                >
                  <h2 className="pageSubTitle">Questions fréquentes</h2>

                  <Collapse
                    style={{ marginBottom: 20 }}
                    bordered={false}
                    defaultActiveKey={["1"]}
                  >
                    <Panel
                      className="faq"
                      header="Qu'est ce qu'un m2 ? "
                      key="1"
                    >
                      <p>
                        Bacon ipsum dolor amet porchetta cupim tenderloin,
                        prosciutto tail bacon ground round picanha swine. Rump
                        ham hock shoulder shank picanha kielbasa. Cupim venison
                        pork chop tongue pig buffalo drumstick chuck pork
                        chislic ribeye. Chislic strip steak hamburger meatloaf,
                        capicola filet mignon kevin cow bresaola salami.
                        Porchetta alcatra biltong frankfurter, leberkas bacon
                        short loin jowl drumstick. Venison pig turkey pancetta
                        tail. Porchetta venison chislic ground round ball tip.
                      </p>
                    </Panel>
                    <Panel
                      className="faq"
                      header="Ceci est une question longue très longue ? "
                      key="2"
                    >
                      <p>
                        Bacon ipsum dolor amet porchetta cupim tenderloin,
                        prosciutto tail bacon ground round picanha swine. Rump
                        ham hock shoulder shank picanha kielbasa. Cupim venison
                        pork chop tongue pig buffalo drumstick chuck pork
                        chislic ribeye. Chislic strip steak hamburger meatloaf,
                        capicola filet mignon kevin cow bresaola salami.
                        Porchetta alcatra biltong frankfurter, leberkas bacon
                        short loin jowl drumstick. Venison pig turkey pancetta
                        tail. Porchetta venison chislic ground round ball tip.
                      </p>
                    </Panel>
                    <Panel
                      className="faq"
                      header="Ceci est une question longue très longue ? "
                      key="3"
                    >
                      <p>
                        Bacon ipsum dolor amet porchetta cupim tenderloin,
                        prosciutto tail bacon ground round picanha swine. Rump
                        ham hock shoulder shank picanha kielbasa. Cupim venison
                        pork chop tongue pig buffalo drumstick chuck pork
                        chislic ribeye. Chislic strip steak hamburger meatloaf,
                        capicola filet mignon kevin cow bresaola salami.
                        Porchetta alcatra biltong frankfurter, leberkas bacon
                        short loin jowl drumstick. Venison pig turkey pancetta
                        tail. Porchetta venison chislic ground round ball tip.
                      </p>
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
            </Col>

            <Col
              xs={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              xl={{ span: 6 }}
            >

                {sidebar}
          
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

function mapStateToProps(state) {
  return { 
      userToken : state.userToken,
      idAd : state.idAd
  }
}

export default connect(
  mapStateToProps,
  null
)(AdDesc)
