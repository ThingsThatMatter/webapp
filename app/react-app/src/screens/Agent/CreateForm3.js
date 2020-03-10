import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout, Steps, Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import {Redirect} from 'react-router-dom';
import {DeleteOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';

const { Step } = Steps;
const {Content} = Layout;
const { Dragger } = Upload;

function CreateFormThree(props) {

    const [currentPage, setCurrentPage] = useState(0)
    const [redir, setRedir] = useState(false)
    const [backRedir, setBackRedir] = useState(false)

    const[fileList, setFileList] = useState([])
    const[filesDB, setFilesDB] = useState([])

    useEffect(() => {
        setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display
        if(props.formData.files) {
            setFileList(props.formData.files)
        }

        if(props.edit === true) {
            setFileList([])
            setFilesDB(props.formData.files)
        }
      },[]);

      const filesFromDB = filesDB.map((e, i) => (
        <div key={i}>{e.split('-')[1]} 
            <DeleteOutlined 
            onClick={async () => {
                const request = await fetch(`/pro/image/${e.split('upload/')[1].split('/')[1].split('.')[0]}`, {
                    method: "delete"
                })
                const response = await request.json()
                if(response.result === "ok") {
                    setFilesDB(filesDB.filter((f) =>  f !== e ))
                }
            }}
            />
        </div>)
        )

    const handleClick = () => {
            props.saveFormData(fileList, filesDB)
            props.nextStep()
            setRedir(true)    
    }

    if(redir === true) {
        return <Redirect to="/pro/createform/step4"/> // Triggered by button-validate handleClick
    }
    if(backRedir === true) {
        return <Redirect to="/pro/createform/step2"/> // Triggered by button-back handleClick
    }
    
    console.log(props.step)
    console.log("form 3", props.formData)
    return (

        <Layout>

            <Sidebar/>

            <Layout className='main-content'>

                <Content style={{ margin: '2em 3em' }}>

                    <Steps progressDot current={currentPage}>
                            <Step title="Localisation" />
                            <Step title="Description" />
                            <Step title="Documents" />
                            <Step title="Prix/honoraires" />
                            <Step title="Créneaux" />
                            <Step title="Récap" />
                    </Steps>

                    <div style={{width : "60%", marginLeft: 25, marginTop: "2%"}}>

                        <form>

                        <p className='formLabel'>Documents (Optionnel)</p>
                            <Dragger
                            name= 'file'
                            accept= ".png,.jpeg,.pdf"
                            multiple= {true}
                            showUploadList= {false}
                            action='/pro/upload'
                            method='post'
                            data={{token : props.formData.adID}}
                            onChange={(info) => {
                                const { status } = info.file;
                                if (status === 'done') {
                                message.success(`${info.file.name} file uploaded successfully.`);
                                setFileList([...fileList, info.file.name])
                                } else if (status === 'error') {
                                message.error(`${info.file.name} file upload failed.`);
                            }}}
                            
                            >
                                <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Cliquez ou déposez des images pour les charger (10 max)</p>
                                <p className="ant-upload-hint">
                                Format acceptés : png et jpeg
                                </p>
                            </Dragger>
                            {fileList.map((e, i) => (
                            <div key={i}>{e} 
                                <DeleteOutlined 
                                onClick={async () => {
                                    const request = await fetch(`/pro/upload/${props.formData.adID}-${e}`, {
                                        method: "delete"
                                    })
                                    const response = await request.json()
                                    if(response === "deleted") {
                                        setFileList(fileList.filter((f) =>  f !== e ))
                                    }
                                }}
                                />
                            </div>)
                            )}
                            {filesFromDB}

                          
  
                        </form>

                        <Button type="primary" className="button-back"
                        onClick={() => {
                            setBackRedir(true)
                            props.previousStep()
                        }}
                        >
                        Précédent</Button> 

                        <Button type="primary" className="button-validate" onClick={() => handleClick()}>Suivant</Button>
                    </div>
              
                
                
                   
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  function mapStateToProps(state) {
    return { step : state.step, formData : state.formData, edit : state.edit }
  }

    function mapDispatchToProps(dispatch) {
    return {
        nextStep : function() { 
            dispatch( {type: 'nextStep'} ) 
        },
        previousStep : function() {
            dispatch( {type: 'prevStep'} )
        },
        saveFormData : function(fileList, filesDB) { 
        dispatch( {
            type: 'saveFormData3',
            files: fileList,
            filesDB: filesDB 
        } ) 
    }

    }
    }
    
  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(CreateFormThree);

