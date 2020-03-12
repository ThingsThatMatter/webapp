import React, { useState, useEffect } from "react";
import { Layout, Button, Switch, Collapse, Col, Row } from "antd";
import { Slide } from "react-slideshow-image";
import { Redirect, Link } from "react-router-dom";
import UserNavHeader from "../../components/UserNavHeader";
import TimeslotPicker from "../../components/Buyer - AdDesc/TimeslotPicker";


import AdDescSidebarLogout from "../../components/AdDescSidebarLogout";
import AdDescSidebarBuyer from "../../components/AdDescSidebarBuyer";


import {useCookies} from 'react-cookie'


import { connect } from "react-redux";
import { getInputClassName } from "antd/lib/input/Input";

const { Content } = Layout;
const { Panel } = Collapse;

const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
  onChange: (oldIndex, newIndex) => {
    //   console.log(`slide transition from ${oldIndex} to ${newIndex}`);
  }
};

function AdDesc(props) {

  const [toggle, setToggle] = useState(true);
  const [adDetails, setAdDetails] = useState({});

  const [adPhotos, setAdPhotos] = useState([]);
  const [adDocuments, setAdDocuments] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['name']); // initilizing state cookies


  useEffect(() => {


      const dbFetchPublic = async () => {
        const data = await fetch(`/user/ad/${props.match.params.ad_id}/public`);
        const body = await data.json();

        console.log('COUCOU LA ROUTE PUBLIQUE')

        setAdDetails(body.data);
        setAdPhotos(body.data.photos);
        setAdDocuments(body.data.files);

        props.setIdAd(body.data._id); 

        console.log(props)
        console.log(body.data)
      };
      dbFetchPublic();

  }, []);

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

  let documents = adDocuments.map((e, i) => {
    return (
      <div key={i}>
        <a href={e} target="_blank">
          {e.split("-")[1]}
        </a>
      </div>
    );
  });  


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

          <h1>{adDetails.title}</h1>

          <Row gutter={16} className="section-text">
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

              {/* PARTIE DOCUMENTS */}
              <Row>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 24 }}
                >
                  <h2 className="pageSubTitle">Documents</h2>

                  <div className="section">
                    <div className="section-text">{documents}</div>
                  </div>
                </Col>
              </Row>
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

              <div className="sidebar-buyer">
              
                {props.userToken === '' ?
                  <AdDescSidebarLogout/>
                :
                <div>
                  <div className="timeslot-picker">
                  <p style={{textAlign : "center", fontWeight: "bold"}}>Sélectionnez un créneau de visite</p>
                    <Row className="slot-row">
                      
                    </Row>
                  </div>

                  <AdDescSidebarBuyer/>

                </div>
                }
                
              </div>
            
            <TimeslotPicker adID={props.match.params.ad_id} token={props.userToken} />

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

function mapDispatchToProps(dispatch){
  return {
    setIdAd: function(id){
      dispatch({type: 'setIdAd', id})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdDesc)
