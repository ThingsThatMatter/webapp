import React, {useState, useEffect} from 'react'

import { Button, Upload, message } from 'antd'
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons'

import Unauthorized401 from './Unauthorized401'
import StepDots from '../../components/StepDots'

import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

const { Dragger } = Upload

function CreateFormThree(props) {

    const [redirToStep4, setRedirToStep4] = useState(false)
    const [redirToStep2, setRedirToStep2] = useState(false)
    const [redirectTo401, setRedirectTo401] = useState(false)

    const[fileList, setFileList] = useState([])
    const[filesDB, setFilesDB] = useState([])

    const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

    /* Renew Access Token */
    const renewAccessToken = (token) => {
        if (token !== cookies.aT) {
            setCookie('aT', token, {path:'/pro'})
        }
    }

/*----------------------------------------------- PREPARE DATA AND COMPONENT ---------------------------------------------------*/
    useEffect(() => {
        if(props.newAdFormData.files) {
            setFileList(props.newAdFormData.files)
        }

        if(props.adEdit === true) {
            setFileList([])
            setFilesDB(props.newAdFormData.files)
        }
    }, [])

    if (!props.newAdFormData.type) {
        return <Redirect to ='/pro/ad/new/step2' />
    }

    // DOCUMENTS UPLOADED IN TEMP
    const filesUploaded = fileList.map(e => 
        <div key={e.id}>
            {e.name} 
            <DeleteOutlined
                onClick = { () => deleteTempFile(props.newAdFormData.adID, e)}
            />
        </div>
    )

    // DOCUMENTS UPLOADED IN CLOUDINARY
    const filesFromDB = filesDB.map( e => (
        <div key={e.id}>
            {e.name} 
            <DeleteOutlined
                onClick = { () => deleteCloudFile(props.newAdFormData.adID, e)}
            />
        </div>
    ))

/*----------------------------------------------- FILES ACTIONS ---------------------------------------------------*/
   // CHECK FILES FORMAT
    const checkUploadFormat = file => {
       const isJPG = file.type === 'image/jpeg'
       const isJPEG = file.type === 'image/jpeg'
       const isPNG = file.type === 'image/png'
       const isPDF = file.type === 'application/pdf'
       if (!(isJPG || isJPEG || isPNG || isPDF)) {
           message.error('Les images doivent être au format PDF, JPEG ou PNG', 3)
       } 
       return new Promise((resolve, reject) => {
           if (!(isJPG || isJPEG || isPNG || isPDF)) {
               reject(file)
           } else {
               resolve(file)
           }
       })
   }

   // UPLOAD DOCUMENT IN TEMP FOLDER
    const docUpload = info => {
        if (info.file.status === 'done') {
            renewAccessToken(info.file.response.accessToken)
            message.success(`La document suivant a bien été chargé : ${info.file.name}.`, 4)
            setFileList([...fileList, {
                name: info.file.name,
                id: info.file.response.data.file.id,
                extension: info.file.response.data.file.extension
            }])

        } else if (info.file.status === 'error') {
            if (info.file.response.response.message === 'Wrong credentials') {
                setRedirectTo401(true)

            } else {
                message.error(`Echec du chargement du document ${info.file.name}. Veuillez réessayer`, 4)
            }
        }
    }

    // DELETE DOCUMENT SAVED IN TEMP
    const deleteTempFile = async (adId, file) => {
        const deleteFile = await fetch(`/pro/ad/${adId}/file/${file.id}${file.extension}/temp`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${cookies.aT}`
            }
        })

        if (deleteFile.status === 500) {
            message.error(`Echec de la suppression du document ${file.name}. Veuillez réessayer`, 3)

        } else if (deleteFile.status === 200) {
            const body = await deleteFile.json()
            renewAccessToken(body.accessToken)
            message.success('Le document a été supprimé', 3)  
            setFileList(fileList.filter(f => f.id !== file.id ))
        }
    }

    // DELETE DOCUMENT SAVED IN COUDINARY
    const deleteCloudFile = async (adId,file) => {

        const deleteCloudiFile = await fetch(`/pro/ad/${adId}/file/${file.externalId}/cloud`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${cookies.aT}`
            }
        })

        if (deleteCloudiFile.status === 500) {
            message.error(`Echec de la suppression du document ${file.name}. Veuillez réessayer`, 3)
    
        } else if (deleteCloudiFile.status === 404) {
            message.error('Le document que vous souhaitez supprimer n\'existe plus', 3)

        } else if (deleteCloudiFile.status === 200) {
            const body = await deleteCloudiFile.json()
            renewAccessToken(body.accessToken)
            message.success('Le document a été supprimé', 3) 
            setFilesDB(filesDB.filter(f => f.externalId !== file.externalId ))
        }
    }


/*-------------------------------------------------- NAVIGATION ---------------------------------------------------*/
    const goToNextStep = () => {
        props.saveFormData(fileList, filesDB)
        setRedirToStep4(true)    
    }

/*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/
    if(redirToStep4 === true) {
        return <Redirect push to="/pro/ad/new/step4"/> // Triggered by button-validate handleClick
    }
    if(redirToStep2 === true) {
        return <Redirect push to="/pro/ad/new/step2"/> // Triggered by button-back handleClick
    }

    if (redirectTo401) {
        return <Unauthorized401 />
    }
    
    return (

        <div>
            <StepDots
                title = 'Documents'
                totalSteps = {6}
                currentStep = {3}
                filledDotsBackgroundColor = '#355c7d'
                filledDotsBorderColor = 'f8b195'
                emptyBackgroundColor = '#FFF'
                emptyDotsBorderColor = '#355c7d'
            />

            <form>
                <p className='formLabel'>Documents (Optionnel)</p>

                <Dragger
                    name= 'file'
                    accept= ".png,.jpeg,.pdf"
                    multiple= {true}
                    showUploadList= {false}
                    beforeUpload={ file => checkUploadFormat(file)}
                    action= {`/pro/ad/${props.newAdFormData.adID}/file`}
                    method= 'post'
                    headers= {{
                        'Authorization': `Bearer ${cookies.aT}`
                    }}
                    onChange={ info => docUpload(info)}
                    className="short"
                >
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Cliquez ou déposez des images pour les charger (10 max)</p>
                    <p className="ant-upload-hint">
                    Format acceptés : pdf, png et jpeg
                    </p>
                </Dragger>

                {filesUploaded}
                {filesFromDB}
            </form>

            <div className="form-buttons">
                <Button type="primary" className="button-back"
                    onClick={() => {
                        setRedirToStep2(true)
                    }}
                >
                    Précédent
                </Button> 

                <Button type="primary" className="button-validate" onClick={() => goToNextStep()}>Suivant</Button>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        newAdFormData : state.newAdFormData,
        adEdit : state.adEdit
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveFormData : function(fileList, filesDB) { 
            dispatch({
                type: 'agent_newAdSaveFormData3',
                files: fileList,
                filesDB: filesDB 
            }) 
        }
    }
}
    
export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(CreateFormThree)

