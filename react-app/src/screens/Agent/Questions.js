import React, {useState, useEffect} from 'react';
import { Layout, Row, Button, Col, Collapse, Carousel, Modal, Input } from 'antd';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux'


import Sidebar from '../../components/Sidebar';
import {PlusCircleOutlined, CheckCircleOutlined} from '@ant-design/icons'
const { Panel } = Collapse;

const { Content } = Layout;


function Questions(props) {

    const [questionsList, setQuestionslist] = useState([])

    const [displayQuestions, setDisplayQuestions] = useState(true)
    const [questionStatus, setQuestionStatus] = useState(null)

    const [questionModalVisible, setQuestionModalVisible] = useState(false)

    const [questionModalProperties, setQuestionModalProperties] = useState({_id:'',status:'',question:'',response:''})
    const [adModalProperties, setAdModalProperties] = useState({_id:''})

    const [response, setResponse] = useState();
  
    /* Offre Cards */
    useEffect( () => {
        const dbFetch = async () => {
            const ads = await fetch(`/pro/ads`, {
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.token}
            })
            const body = await ads.json();
          
            let adsWithQuestions = body.data.ads.filter( e => e.questions.length > 0);    
            setQuestionslist(adsWithQuestions)

        }   
        dbFetch()
    }, [displayQuestions]);


    console.log(questionsList)

    let showModal = () => {
        setQuestionModalVisible(true)
    };

    let hideModal = () => {
        setQuestionModalVisible(false)
    };

    // Répondre à une question
    const handleAnswerQuestion = async () => {
        const answerQuestion = await fetch(`/pro/ad/${adModalProperties._id}/question/${questionModalProperties._id}/answer`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.token},
            body: `response=${response}`
        })
        const body = await answerQuestion.json();

        setQuestionModalProperties({_id:'',status:'',question:'',response:'',creationDate:'',user:''})
        setQuestionModalVisible(false)
        setDisplayQuestions(!displayQuestions)
    }

    // Supprimer une question
    const handleDeclineQuestion = async () => {
        const declineQuestion = await fetch(`/pro/ad/${adModalProperties._id}/question/${questionModalProperties._id}/decline`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', token: props.token}
        })
        const body = await declineQuestion.json();

        setQuestionModalProperties({_id:'',status:'',question:'',response:'',creationDate:'',user:''})
        setQuestionModalVisible(false)
        setDisplayQuestions(!displayQuestions)
    }

    let sortedQuestions = questionsList.map((e,i) => {
        return (
            <div key={i} id={e._id} className='question-section'>
                <h4 className='title'>{e.title}</h4>

                    <ul className="questions-list">
                        { e.questions.map( (f,i) => {
                            
                        return (
                            <li key={i} className="question-element">
                                <span className={`question-state ${f.status}`}></span>
                                <div className="question-content">
                                    <p className="question-text">{f.question}</p>
                                    <p className="response-text">{f.response}</p>
                                </div>
                                <span className="question-details">reçue le {new Date(f.creationDate).toLocaleDateString('fr-FR')} 
                                <br/>à {new Date(f.creationDate).toLocaleTimeString('fr-FR')}</span>
                                <Button 
                                    type="primary" 
                                    onClick={() => {
                                        setQuestionModalVisible(true)
                                        setQuestionModalProperties(f)
                                        setAdModalProperties(e)
                                    }}
                                >
                                Voir
                                </Button>
                            </li>
                        )
                        })
                        }
                </ul>
            </div>
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
                        title="Question"
                        visible={questionModalVisible}
                        footer= {
                            <div className="modal-footer-buttons">
                                <Button type="primary" className="button-decline" onClick={ () => handleDeclineQuestion()}>Supprimer</Button>
                                <Button type="primary" className="button-validate" onClick={ () => handleAnswerQuestion()}>Répondre</Button>
                            </div>
                        }
                        destroyOnClose= {true}
                        width= "50%"
                        closable={true}
                        mask={true}
                        maskClosable={true}
                        onCancel={hideModal}
                    >
                        <div className="question-modal">
                            <p>{questionModalProperties.question}</p>
                            <Input className="response-content" onChange={ e => setResponse(e.target.value)} value={response} />
                        </div>
                    </Modal>

                </Content>         
            </Layout>
  
        </Layout>

    );
  }

function mapStateToProps(state) {
    return { 
        token : state.token
    }
}

export default connect(
    mapStateToProps,
    null
)(Questions)