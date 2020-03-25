import React, { useState, useEffect } from 'react';
import { Layout, Button, Input, Collapse, Col, Row, message, Modal } from 'antd';
import { Slide } from 'react-slideshow-image';
import { Redirect, Link } from 'react-router-dom';
import UserNavHeader from '../../components/UserNavHeader';

import LoggedOut from '../../components/buyerAdDesc/LoggedOut'
import SidebarBuyer from "../../components/buyerAdDesc/SidebarBuyer";

import { connect } from "react-redux";
import { ConsoleSqlOutlined } from '@ant-design/icons';

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
  const [adQuestions, setAdQuestions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const [question, setQuestion] = useState();
  const [questionModalVisible, setQuestionModalVisible] = useState(false)


/* -----------------------------------------------LOAD AD FROM DB------------------------------------------ */

  useEffect(() => {

      const dbFetchPublic = async () => {
        const data = await fetch(`/user/ad/${props.match.params.ad_id}/public`);
        const body = await data.json();

        setAdDetails(body.data);
        setAdPhotos(body.data.photos);
        setAdDocuments(body.data.files);
        setAdQuestions(body.data.questions.filter(question => question.status === 'answered'));

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


  let questions = adQuestions.map((e, i) => {
    return (
      <Panel
        className="faq"
        header={e.question}
        key={i}
      >
        <p>{e.response}</p>
      </Panel>
    );
  });

  const sendQuestion = async() => {

    const key = "updatable"

    message.loading({ content: 'Envoi de la question...', key });

    let dbFetch = await fetch(`/user/ad/${props.match.params.ad_id}/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': props.userToken
        },
        body: JSON.stringify({question:question})
    })

    let response = await dbFetch.json()

    setQuestionModalVisible(false)
    
    if(response.message === "OK") {
        message.success({ content: "Question envoyée !", key, duration: 2 });
        setQuestion('')
    } else {
        message.error(response.details);
    }

  }


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

              {/* QUESTIONS FREQUENTES */}
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
                    
                    {questions}
                    
                  </Collapse>
                </Col>
              </Row>


              <Button type="primary" onClick={ () => setQuestionModalVisible(true)}>Poser une question</Button>

              <Modal
                        className="new-question-modal"
                        title= {<p className="newoffer-modal-title">Ma question</p>}
                        visible={questionModalVisible}
                        centered
                        footer={<Button type="primary" onClick={ () => sendQuestion()}>Envoyer</Button>}
                        destroyOnClose= {true}
                        width= "80%"
                        closable={true}
                        mask={true}
                        maskClosable={true}
                        onCancel={() => setQuestionModalVisible(false)}
                    >
                    <label>
                    <Input className="question-content" onChange={ e => setQuestion(e.target.value)} value={question} placeholder="Pourquoi vos biens sont-ils toujours si beaux ?" />
                    </label>
                    
              </Modal>

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
