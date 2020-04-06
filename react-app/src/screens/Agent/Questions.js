import React, {useState, useInput, useEffect} from 'react';
import { Layout, Row, Button, Col, Collapse, Modal, Input, Radio } from 'antd';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'

import {useCookies} from 'react-cookie'

import Sidebar from '../../components/Agent/Sidebar'
import {PlusCircleOutlined, CheckCircleOutlined} from '@ant-design/icons'
const { Panel } = Collapse;
const {TextArea} = Input
const { Content } = Layout;


function Questions(props) {

    const [questionsList, setQuestionslist] = useState([])

    const [displayQuestions, setDisplayQuestions] = useState(true)
    const [questionStatus, setQuestionStatus] = useState(null)

    const [declineModalVisible, setDeclineModalVisible] = useState(false)
    const [answerModalVisible, setAnswerModalVisible] = useState(false)

    const [questionModalProperties, setQuestionModalProperties] = useState({_id:'',status:'',question:'',response:''})
    const [adModalProperties, setAdModalProperties] = useState({_id:''})

    const [response, setResponse] = useState();
    const [otherReason, setOtherReason] = useState();

    const [cookies, setCookie] = useCookies(['name']); // initilizing state cookies

    const [reason] = useState({alreadyExists:"J’ai déjà répondu à cette question",answerAd:"L’information demandée est disponible sur l’annonce",dontUnderstand:"Je ne comprends pas la question",badQuestion:"La question comprend des propos injurieux"});
    const [declineReason, setDeclineReason] = useState("");

    /* Token refresh */
    const renewAccessToken = (token) => {
        if (token !== cookies.aT) {
            setCookie('aT', token, {path:'/pro'})
        }
    }
  
    /* Offre Cards */
    useEffect( () => {
        const dbFetch = async () => {
            const ads = await fetch('/pro/ads', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'Authorization': `Bearer ${cookies.aT}`
                }
            })
            const body = await ads.json();
            renewAccessToken(body.data.accessToken) // Renew token if invalid soon

            let adsWithQuestions = body.data.ads.filter( e => e.questions.length > 0);    
            setQuestionslist(adsWithQuestions)

        }   
        dbFetch()
    }, [displayQuestions]);


    let hideModal = () => {
        setDeclineModalVisible(false)
        setAnswerModalVisible(false)
    };

    // Répondre à une question
    const handleAnswerQuestion = async () => {

        const answerQuestion = await fetch(`/pro/ad/${adModalProperties._id}/question/${questionModalProperties._id}/answer`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            },
            body: JSON.stringify({response:response})
        })
        const body = await answerQuestion.json();

        setQuestionModalProperties({_id:'',status:'',question:'',response:'',creationDate:'',user:''})
        setAnswerModalVisible(false)
        setDisplayQuestions(!displayQuestions)
    }

    function handleDeclineSubmit(e) {
        e.preventDefault();
        console.log(declineReason);
    }

    // Supprimer une question
    const handleDeclineQuestion = async () => {
        const declineQuestion = await fetch(`/pro/ad/${adModalProperties._id}/question/${questionModalProperties._id}/decline`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            },
            body: JSON.stringify({declineReason:declineReason})
        })
        const body = await declineQuestion.json();

        setQuestionModalProperties({_id:'',status:'',question:'',response:'',creationDate:'',user:''})
        setDeclineModalVisible(false)
        setDisplayQuestions(!displayQuestions)
    }

    let sortedQuestions = questionsList.map((e,i) => {

        return (
            <Row key={i} id={e._id}>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                  xl={{ span: 24 }}
                >
                  <h4 className='title'>{e.title}</h4>

                  <Collapse
                    style={{ marginBottom: 20 }}
                    bordered={false}
                  >
                  
                    { e.questions.map( (f,i) => {
                        
                    return (
                        <Panel
                            className="faq"
                            key={i}
                            header={
                                <div className="question-element">
                                    <span className={`question-state ${f.status}`}></span>
                                    <p className="question-content">{f.question}</p>
                                    <span className="question-details">{new Date(f.creationDate).toLocaleDateString('fr-FR')}</span>
                                </div>
                            }
                        >
                            
                            <p className="response-text">{f.response}</p>

                            <TextArea className="response-content" style={{ display: (f.status === 'answered' || 'declined' ? 'none' : 'block') }} 
                                value={response}
                                onChange={ e => setResponse(e.target.value)}
                            />

                            <div className="modal-footer-buttons" style={{ display: (f.status === 'answered' || 'declined' ? 'none' : 'flex') }} >
                                
                                <Button 
                                    type="primary" 
                                    className="button-decline" 
                                    onClick={() => {
                                        setQuestionModalProperties(f)
                                        setAdModalProperties(e)
                                        setDeclineModalVisible(true)
                                    }}
                                >
                                Supprimer
                                </Button>
                                <Button 
                                    type="primary" 
                                    className="button-validate" 
                                    onClick={() => {
                                        setQuestionModalProperties(f)
                                        setAdModalProperties(e)
                                        setAnswerModalVisible(true)
                                    }}
                                >
                                Répondre
                                </Button>
                                
                            </div>
                            
                        </Panel>
                    )
                    })
                    }

                </Collapse>

            </Col>
            </Row>
            )
    });

    return (
  
        <Layout>

            <Sidebar/>

            <Layout className='main-content'>
                <Content>
                    <h1 className='pageTitle'>Les messages</h1>

                    {sortedQuestions}
                    
                    <Modal
                        title={questionModalProperties.question}
                        visible={answerModalVisible}
                        footer= {
                            <Button type="primary" className="button-validate" 
                            onClick={ () => handleAnswerQuestion()}
                            >
                            Envoyer
                            </Button>
                        }
                        destroyOnClose= {true}
                        width= "50%"
                        closable={true}
                        mask={true}
                        maskClosable={true}
                        onCancel={hideModal}
                    >
                        <div className="question-modal">
                            <p>{response}</p>
                        </div>
                    </Modal>

                    <Modal
                        title='Raison de la suppression'
                        visible={declineModalVisible}
                        footer= {
                            <Button type="primary" className="button-decline" 
                            onClick={ () => handleDeclineQuestion()}
                            >
                            Supprimer
                            </Button>
                        }
                        destroyOnClose= {true}
                        width= "50%"
                        closable={true}
                        mask={true}
                        maskClosable={true}
                        onCancel={hideModal}
                    >
                        <div className="question-modal">
                            <Radio.Group 
                                onChange={ 
                                    e => setDeclineReason(e.target.value)
                                }
                                value={declineReason}
                            >
                                <Radio style={{display: 'block',height: '30px',lineHeight: '30px'}} value={'J’ai déjà répondu à cette question'}>
                                J’ai déjà répondu à cette question
                                </Radio>
                                <Radio style={{display: 'block',height: '30px',lineHeight: '30px'}} value={'L’information demandée est disponible sur l’annonce'}>
                                L’information demandée est disponible sur l’annonce
                                </Radio>
                                <Radio style={{display: 'block',height: '30px',lineHeight: '30px'}} value={'Je ne comprends pas la question'}>
                                Je ne comprends pas la question
                                </Radio>
                                <Radio style={{display: 'block',height: '30px',lineHeight: '30px'}} value={'La question comprend des propos injurieux'}>
                                La question comprend des propos injurieux
                                </Radio>
                                <Radio style={{display: 'block',height: '30px',lineHeight: '30px'}} value={otherReason}>
                                Autre raison (à préciser)
                                <br/>
                                <Input onChange={ ev => setOtherReason(ev.target.value) } value={otherReason} />
                                </Radio>
                            </Radio.Group>
                        </div>
                    </Modal>

                </Content>         
            </Layout>
  
        </Layout>

    );
  }

  function mapStateToProps(state) {
    return { 
      agentLoginInfo : state.agentLoginInfo
    }
  }

export default connect(
    mapStateToProps,
    null
)(Questions)