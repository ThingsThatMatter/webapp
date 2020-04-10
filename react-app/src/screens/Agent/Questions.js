import React, {useState, useEffect} from 'react'
import { Layout, Row, Button, Col, Collapse, Modal, Input, Radio, message } from 'antd'

import {connect} from 'react-redux'

import {useCookies} from 'react-cookie'

import Sidebar from '../../components/Agent/Sidebar'
import Unauthorized401 from './Unauthorized401'
import InternalError500 from './InternalError500'
import GlobalSpin from '../../components/Agent/GlobalSpin'

import {WarningOutlined} from '@ant-design/icons'

const { Panel } = Collapse
const {TextArea} = Input
const { Content } = Layout


function Questions() {

    const [questionsList, setQuestionslist] = useState([])

    const [displayQuestions, setDisplayQuestions] = useState(true)

    const [declineModalVisible, setDeclineModalVisible] = useState(false)
    const [answerModalVisible, setAnswerModalVisible] = useState(false)

    const [questionModalProperties, setQuestionModalProperties] = useState({_id:'',status:'',question:'',response:''})
    const [adModalProperties, setAdModalProperties] = useState({_id:''})

    const [answerQuestionLoading, setAnswserQuestionLoading] = useState(false)
    const [answerQuestionError, setAnswerQuestionError] = useState('')

    const [declineQuestionLoading, setDeclineQuestionLoading] = useState(false)
    const [declineQuestionError, setDeclineQuestionError] = useState('')

    const [response, setResponse] = useState()
    const [otherReason, setOtherReason] = useState()

    const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

    const [declineReason, setDeclineReason] = useState('')

    const [redirectTo401, setRedirectTo401] = useState(false)
    const [internalError, setInternalError] = useState(false)
  
    const [dbLoading, setDbLoading] = useState(true)

    /* Token refresh */
    const renewAccessToken = (token) => {
        if (token !== cookies.aT) {
            setCookie('aT', token, {path:'/pro'})
        }
    }
  
/*----------------------------------------------- PREPARE DATA & COMPONENT ---------------------------------------------------*/

    // LOAD DATA FROM DB
    useEffect( () => {
        const dbFetch = async () => {
            const getAds = await fetch('/pro/ads', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'Authorization': `Bearer ${cookies.aT}`
                }
            })

            if (getAds.status === 500) {
                setInternalError(true)
            
            } else if (getAds.status === 401) {
                setRedirectTo401(true)
          
            } else if (getAds.status === 200) {
                const response = await getAds.json()
                renewAccessToken(response.accessToken) // Renew token if invalid soon
                setQuestionslist(response.data.ads.filter( e => e.questions.length > 0))
                setDbLoading(false)
            }
        }   
        dbFetch()
    }, [displayQuestions])

    // PREPARE COMPONENTS
    let sortedQuestions = questionsList.map((e,i) => 
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
                    { e.questions.map( (f,i) => 
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

                            <TextArea className="response-content" style={{ display: ((f.status === 'answered' || f.status=== 'declined') ? 'none' : 'block') }} 
                                value={response}
                                onChange={ e => setResponse(e.target.value)}
                            />

                            <div className="modal-footer-buttons" style={{ display: ((f.status === 'answered' || f.status=== 'declined') ? 'none' : 'flex') }} >
                                <Button 
                                    type="primary" 
                                    className="button-decline" 
                                    onClick={() => {
                                        setQuestionModalProperties(f)
                                        setAdModalProperties(e)
                                        setDeclineModalVisible(true)
                                    }}
                                >
                                    Décliner
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
                    )}
                </Collapse>
            </Col>
        </Row>    
    )

/*----------------------------------------------- ACTIONS ---------------------------------------------------*/

    let hideModal = () => {
        setDeclineModalVisible(false)
        setAnswerModalVisible(false)
    }

    // Answer a question
    const handleAnswerQuestion = async () => {

        setAnswserQuestionLoading(true)
        const answerQuestion = await fetch(`/pro/ad/${adModalProperties._id}/question/${questionModalProperties._id}/answer`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            },
            body: JSON.stringify({response:response})
        })

        if (answerQuestion.status === 500) {
            setAnswerQuestionError('Votre réponse n\'a pas pu être enregistrée, veuillez réessayer.')
            setAnswserQuestionLoading(false)
        
        } else if (answerQuestion.status === 401) {
            setRedirectTo401(true)
            setAnswserQuestionLoading(false)
            setAnswerQuestionError('')
    
        } else if (answerQuestion.status === 200) {
            const body = await answerQuestion.json()
            renewAccessToken(body.accessToken)
            message.success('Votre réponse a été publiée sur l\'annonce du bien', 3) // add a message with email 
            setQuestionModalProperties({_id:'',status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
            setAnswerModalVisible(false)
            setAnswserQuestionLoading(false)
            setDisplayQuestions(!displayQuestions)
            setAnswerQuestionError('')
        }
    }

    // Delete a question
    const handleDeclineQuestion = async () => {

        setDeclineQuestionLoading(true)
        const declineQuestion = await fetch(`/pro/ad/${adModalProperties._id}/question/${questionModalProperties._id}/decline`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${cookies.aT}`
            },
            body: JSON.stringify({declineReason:declineReason})
        })

        if (declineQuestion.status === 500) {
            setDeclineQuestionError('Cette question n\'a pas pu être supprimée, veuillez réessayer.')
            setDeclineQuestionLoading(false)
        
        } else if (declineQuestion.status === 401) {
            setRedirectTo401(true)
            setDeclineQuestionLoading(false)
            setDeclineQuestionError('')
    
        } else if (declineQuestion.status === 200) {
            const body = await declineQuestion.json()
            renewAccessToken(body.accessToken)
            message.success('La question a été déclinée et n\'apparaîtra pas sur l\'annonce', 3) // add a message with email 
            setQuestionModalProperties({_id:'',status:'',firstname1:'',lastname1:'',firstname2:'',lastname2:'',amount:'',loanAmount:'',contributionAmount:'',monthlyPay:'',notaryName:'',notaryAddress:'',notaryEmail:'',validityPeriod:'',creationDate:'',message:''})
            setDeclineModalVisible(false)
            setDeclineQuestionLoading(false)
            setDisplayQuestions(!displayQuestions)
            setDeclineQuestionError('')
        }
    }


/*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/
    if (redirectTo401) {
        return <Unauthorized401 />
    }
      if (internalError) {
        return <InternalError500 />
    }
    
    if (dbLoading) {
        return <GlobalSpin />
    }

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
                            <div>
                                {answerQuestionError !=='' &&
                                <div style={{marginBottom: '8px', textAlign: 'center', color:'#f67280'}}>
                                    <WarningOutlined style={{marginRight: '2px'}}/>
                                    <span style={{marginLeft: '2px'}}>
                                        {answerQuestionError}
                                    </span>
                                    </div>
                                }

                                <Button
                                    type="primary" loading={answerQuestionLoading} className="button-validate"
                                    style= {{marginRight: '0px', marginLeft: 'auto'}}
                                    onClick={ () => handleAnswerQuestion()}
                                >
                                Publier la réponse
                                </Button>
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
                            <p>{response}</p>
                        </div>
                    </Modal>

                    <Modal
                        title='Raison de la suppression'
                        visible={declineModalVisible}
                        footer= {
                            <div>
                                {declineQuestionError !=='' &&
                                <div style={{marginBottom: '8px', textAlign: 'center', color:'#f67280'}}>
                                    <WarningOutlined style={{marginRight: '2px'}}/>
                                    <span style={{marginLeft: '2px'}}>
                                        {declineQuestionError}
                                    </span>
                                    </div>
                                }

                                <Button type="primary" loading={declineQuestionLoading} className="button-decline"
                                    style= {{marginRight: '0px', marginLeft: 'auto'}}
                                    onClick={ () => handleDeclineQuestion()}
                                >
                                    Décliner la question
                                </Button>
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
                                <Radio style={{display: 'block',height: '30px',lineHeight: '30px'}} value={`Autre: ${otherReason}`}>
                                Autre raison (à préciser)
                                <br/>
                                <Input onChange={ e => setOtherReason(e.target.value) } value={otherReason} />
                                </Radio>
                            </Radio.Group>
                        </div>
                    </Modal>
                </Content>         
            </Layout>
        </Layout>
    )
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