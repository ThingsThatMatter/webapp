import React, { useState, useEffect } from "react";
import { Layout, Button, Switch, Collapse, Col, Row } from "antd";
import { Slide } from "react-slideshow-image";
import { Redirect, Link } from "react-router-dom";
import UserNavHeader from "../../components/UserNavHeader";

import AdDescSidebarLogout from "../../components/AdDescSidebarLogout";

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
  const [slotsDisplay, setSlotsDisplay] = useState([]);

  const [cookies, setCookie, removeCookie] = useCookies(['name']); // initilizing state cookies


  useEffect(() => {

    if (props.userToken === '') { 

      const dbFetchPublic = async () => {
        const data = await fetch(`/user/ad/${props.match.params.id}/public`);
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
      /// Fin de la condition dbFetchPublic


    } else {


      const dbFetchPrivate = async () => {
        const data = await fetch(`/user/ad/${props.match.params.id}`);
        const body = await data.json();


        console.log('COUCOU LA ROUTE PRIVEE')

        console.log(body)

        setAdDetails(body);
        setAdPhotos(body.photos);
        setAdDocuments(body.files);

      const timeslots = body.timeSlots
      console.log(timeslots)
      const daySlots = []

      for(let i=0 ; i < timeslots.length ; i++) {

        const year = timeslots[i].start.slice(0,4)
        let month = Number(timeslots[i].start.slice(5,7))-1
        const day = timeslots[i].start.slice(8,10)
        const hour1 = timeslots[i].start.slice(11,13)
        const min1 = timeslots[i].start.slice(14,16)
        const hour2 = timeslots[i].end.slice(11,13)
        const min2 = timeslots[i].end.slice(14,16)

        const date = new Date(year, month, day)

        const index = daySlots.findIndex((e) => {
          return e.day.getTime() == date.getTime()
        })
        
        if( timeslots[i].booked === false) {
          if( index !== -1 ) {
            daySlots[index].slots.push({
            start : hour1+min1,
            end : hour2+min2,
            timeslot : timeslots[i]._id
            })
          } else {
            daySlots.push({
              day: date,
              slots : [{
                start : hour1+ min1, 
                end : hour2+min2,
                timeslot : timeslots[i]._id
              }]
            })
          }
        }
      }

      console.log("daySlots", daySlots)

      daySlots.sort((a,b) => {
        return (a.day - b.day)
      })

      const format = (number) => {
        if(number < 10) {
          console.log(number)
          return `0${number}`
        }
      }

      const pickerClick = async (timeslot) => {

        const response = await fetch(`/user/ad/${body._id}/visit`, {
          method : "put",
          headers: {
            'Content-Type': 'application/json',
            token : 'njn2MLOiFPpUhfrAFUh1XeJj5ZBNgFHk' // A METTRE A JOUT AVEC LE TOKEN DU STORE REDUX
          },
          body: JSON.stringify({
            timeslot : timeslot
          })
        })
        let jolieResponse = await response.json()
        console.log("Reponse", jolieResponse)
      }

        const mapSlots = daySlots.map((e, i) => {

          return <Col span={6} key={i}>

            <div className="picker-day">
            {`${format(e.day.getDate())}/${format(e.day.getMonth()+1)}`}
            </div>

              {
                e.slots.map((f, i) => (
                  <div key={i} className="picker-slot" onClick={() => pickerClick(f.timeslot)}>
                    {`${f.start.slice(0,2)}h${f.start.slice(2,4)}`}
                  </div>
                ))
              }
            
            </Col>
          })

        setSlotsDisplay(mapSlots)

        const saveAdUser = await fetch(`/user/ad/${body._id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.userToken}
        })
    
        const ad = await saveAdUser.json()

        console.log(props.userToken)


      };
      dbFetchPrivate();
    } /// Fin de la condition dbFetchPrivate
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
              <div className="timeslot-picker">
                <h4 style={{textAlign : "center"}}>Sélectionnez un créneau de visite</h4>
                  <Row className="slot-row">

                  {props.userToken === '' ?
                    <AdDescSidebarLogout/>
                  :
                    <p>Voici les créneaux</p>
                  }

                    {slotsDisplay}
                  </Row>


              </div>

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
