import React, {useState, useEffect} from 'react'

import { Button, Input, Radio, InputNumber, Checkbox, Upload, message } from 'antd'
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons'

import StepDots from '../../components/StepDots'

import Unauthorized401 from './Unauthorized401'

import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

const { TextArea } = Input
const { Dragger } = Upload

function CreateFormTwo(props) {

    const [type, setType] = useState('')
    const [area, setArea] = useState(0)
    const [rooms, setRooms] = useState(0)
    const [bedrooms, setBedrooms] = useState(0)
    const [avantages, setAvantages] = useState([])
    const [desc, setDesc] = useState('')
    const [photoList, setPhotoList] = useState([])
    const [video, setVideo] = useState('')
    const [emission, setEmission] = useState(0)
    const [conso, setConso] = useState(0)   
    const [photosDB, setPhotosDB] = useState([])   

    const [redirToStep3, setRedirToStep3] = useState(false)
    const [redirToStep1, setRedirToStep1] = useState(false)
    const [redirectTo401, setRedirectTo401] = useState(false)

    const [formError, setFormError] = useState('')

    const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

    /* Renew Access Token */
    const renewAccessToken = (token) => {
        if (token !== cookies.aT) {
            setCookie('aT', token, {path:'/pro'})
        }
    }

/*----------------------------------------------- PREPARE DATA AND COMPONENT ---------------------------------------------------*/
    useEffect(() => {

        if(props.formData.rooms) {     // Display inputed info if user goes back from next form pages
            setType(props.formData.type)
            setArea(props.formData.area)
            setRooms(props.formData.rooms)
            setBedrooms(props.formData.bedrooms)
            setAvantages(props.formData.advantages)
            setDesc(props.formData.description)
            setPhotoList(props.formData.photos)
            setVideo(props.formData.video)
            setEmission(props.formData.ges)
            setConso(props.formData.dpe)
        }

        if(props.edit === true) {
            setPhotoList([])
            setPhotosDB(props.formData.photos)
        }
    }, [])

    if (!props.formData.street) {
        return <Redirect to ='/pro/ad/new/step1' />
    }

    const options = [
        {label : "Ascenseur", value : "ascenseur"},
        {label : "Balcon", value : "balcon"},
        {label : "Terrasse", value : "terrasse"}
    ]

    // PHOTOS UPLOADED IN TEMP
    const photosUploaded = photoList.map(e => 
        <div key={e.id}>
            {e.name} 
            <DeleteOutlined
                style = {{marginLeft: '4px'}}
                onClick={ () => deleteTempPhoto(props.formData.adID, e)}
            />
        </div>
    )

    // PHOTOS UPLOADED IN CLOUDINARY
    const photosFromDB = photosDB.map(e => 
        <div key={e.externalId}>
            {e.name} 
            <DeleteOutlined 
                onClick={ () => deleteCloudPhoto(props.formData.adID, e)}
            />
        </div>
    )

/*----------------------------------------------- FILES ACTIONS ---------------------------------------------------*/
    // CHECK FILES FORMAT
    const checkUploadFormat = file => {
        const isJPG = file.type === 'image/jpeg'
        const isJPEG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        if (!(isJPG || isJPEG || isPNG)) {
            message.error('Les images doivent être au format JPEG ou PNG', 3)
        } 
        return new Promise((resolve, reject) => {
            if (!(isJPG || isJPEG || isPNG)) {
                reject(file)
            } else {
                resolve(file)
            }
        })
    }

    // UPLOAD PHOTO IN TEMP FOLDER
    const photoUpload = info => {
        if (info.file.status === 'done') {
            renewAccessToken(info.file.response.accessToken)
            message.success(`La photo suivante a bien été chargée : ${info.file.name}.`, 4)
            setPhotoList([...photoList, {
                name: info.file.name,
                id: info.file.response.data.file.id,
                extension: info.file.response.data.file.extension
            }])

        } else if (info.file.status === 'error') {
            if (info.file.response.message === 'Wrong credentials') {
                setRedirectTo401(true)

            } else {
                message.error(`Echec du chargement de la photo ${info.file.name}. Veuillez réessayer`, 4)
            }
        }
    }

    // DELETE PHOTO SAVED IN TEMP
    const deleteTempPhoto = async (adId, photo) => {
        const deletePhoto = await fetch(`/pro/ad/${adId}/file/${photo.id}${photo.extension}/temp`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${cookies.aT}`
            }
        })

        if (deletePhoto.status === 500) {
            message.error(`Echec de la suppression de la photo ${photo.name}. Veuillez réessayer`, 3)

        } else if (deletePhoto.status === 401) {
            setRedirectTo401(true)
    
        } else if (deletePhoto.status === 200) {
            const body = await deletePhoto.json()
            renewAccessToken(body.accessToken)
            message.success('La photo a été supprimée', 3)  
            setPhotoList(photoList.filter(f => f.id !== photo.id ))
        }
    }

    // DELETE PHOTO SAVED IN COUDINARY
    const deleteCloudPhoto = async (adId, photo) => {

        const deleteCloudiPhoto = await fetch(`/pro/ad/${adId}/file/${photo.externalId}/cloud`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${cookies.aT}`
            }
        })

        if (deleteCloudiPhoto.status === 500) {
            message.error(`Echec de la suppression de la photo ${photo.name}. Veuillez réessayer`, 3)

        } else if (deleteCloudiPhoto.status === 401) {
            setRedirectTo401(true)
    
        } else if (deleteCloudiPhoto.status === 404) {
            message.error('La photo que vous souhaitez supprimer n\'existe plus', 3)

        } else if (deleteCloudiPhoto.status === 200) {
            const body = await deleteCloudiPhoto.json()
            renewAccessToken(body.accessToken)
            message.success('La photo a été supprimée', 3) 
            setPhotosDB(photosDB.filter(f => f.externalId !== photo.externalId ))
        }
    }

/*-------------------------------------------------- NAVIGATION ---------------------------------------------------*/

    const goToNextStep = () => {

        if(type !== "" && area !== 0 && rooms !== 0 && desc !== "" && (photoList.length > 0 || photosDB.length > 0) ) {
            props.saveFormData(type, area, rooms, bedrooms, avantages, desc, photoList, video, emission, conso, photosDB)
            setRedirToStep3(true)

        } else {
            setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }    
    }

/*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/
    if(redirToStep3 === true) {
        return <Redirect push to="/pro/ad/new/step3"/> // Triggered by button-add goToNextStep
    }
    if(redirToStep1 === true) {
        return <Redirect push to="/pro/ad/new/step1"/> // Triggered by button-back goToNextStep
    }

    if (redirectTo401) {
        return <Unauthorized401 />
    }

    return (

        <div>
            <StepDots
                title = 'Description'
                totalSteps = {6}
                currentStep = {2}
                filledDotsBackgroundColor = '#355c7d'
                filledDotsBorderColor = 'f8b195'
                emptyBackgroundColor = '#FFF'
                emptyDotsBorderColor = '#355c7d'
            />

            <form>
    
                <p className='formLabel'>Type de bien </p>
                <label>
                    <Radio.Group 
                        value={type} 
                        onChange={(e) => setType(e.target.value)} 
                    >
                        <Radio 
                            value="appartement" 
                            style={{paddingTop : "1%"}}>
                            Appartement
                        </Radio>
                        <br/>
                        <Radio 
                            value="maison" 
                            style={{paddingTop : "1%"}}
                        >
                            Maison
                        </Radio>
                    </Radio.Group>
                </label>

                <p className='formLabel'>Surface</p>
                <label >
                    <InputNumber 
                        min={0} 
                        onChange={(e) => setArea(e)} 
                        value={area} 
                        placeholder="75 m2"
                    />
                </label>
                <span style={{marginLeft: "1%", fontWeight: 700}}>m2</span>

                <p className='formLabel'>Nombre de pièces</p>
                <label>
                    <InputNumber 
                        min={0} 
                        onChange={(e) => setRooms(e)} 
                        value={rooms} 
                        placeholder="75018"
                    />
                </label>
                
                <p className='formLabel'>Nombre de chambres</p>
                <label>
                    <InputNumber
                        min={0} 
                        onChange={(e) => setBedrooms(e)} 
                        value={bedrooms} 
                        placeholder="75018"
                    />
                </label>

                <p className='formLabel'>Avantages</p>
                    <label>
                    <Checkbox.Group 
                        options={options} 
                        onChange={(values) => setAvantages(values)}
                        value={avantages}
                    />
                    </label>

                <p className='formLabel'>Texte de l'annonce</p>
                <label >
                    <TextArea 
                        rows={4}
                        onChange={(e) => setDesc(e.target.value)} 
                        value={desc}
                        placeholder="En plein coeur du 18ème arrondissement de Paris..."
                        className="short"
                    />
                </label>

                <p className='formLabel'>Photos (10 max)</p>
                <Dragger
                    name= 'file'
                    accept= ".png,.jpeg,.pdf"
                    multiple= {true}
                    showUploadList= {false}
                    beforeUpload={ file => checkUploadFormat(file)}
                    action= {`/pro/ad/${props.formData.adID}/file`}
                    method= 'POST'
                    headers= {{
                        'Authorization': `Bearer ${cookies.aT}`
                    }}
                    onChange={ info => photoUpload(info)}
                    className="short"
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Cliquez ou déposez des images pour les charger (10 max)</p>
                    <p className="ant-upload-hint">
                        Format acceptés : png et jpeg
                    </p>
                </Dragger>

                {photosUploaded}
                {photosFromDB}

                <p className='formLabel'>Lien vers vidéo (optionnel)</p>
                <label >
                    <Input 
                        onChange={(e) => setVideo(e.target.value)} 
                        value={video} 
                        placeholder="http://"
                        className="short"
                    />
                </label>

                <p className='formLabel'>Emission de gaz à effet de serre (optionnel)</p>
                <label >
                    <InputNumber
                        min={0} 
                        onChange={(e) => setEmission(e)} 
                        value={emission} 
                        placeholder="23"
                    />
                </label>
                <span style={{marginLeft: "1%", fontWeight: 700}}>kgeq/m2/an</span>

                <p className='formLabel'>Consommation énergétique (optionnel)</p>
                <label >
                    <InputNumber
                        min={0}
                        onChange={(e) => setConso(e)} 
                        value={conso} 
                        placeholder="438"
                    />
                </label>
                <span style={{marginLeft: "1%", fontWeight: 700}}>kWhEP/m2/an</span>     
                
            </form>
            
            {formError}

            <div className="form-buttons">
                <Button type="primary" className="button-back"
                    onClick={() => {
                        setRedirToStep1(true)
                    }}
                >
                    Précédent
                </Button>  

                <Button type="primary" onClick={() => goToNextStep()}>Suivant</Button>
            </div>       
        </div>
    )
}

function mapStateToProps(state) {
    return { 
        formData: state.formData,
        edit: state.edit
    }
}

function mapDispatchToProps(dispatch) {
    return {
      saveFormData : function(type, area, rooms, bedrooms, avantages, desc, photoList, video, emission, conso, photosDB) { 
        dispatch( {
            type: 'agent_newOfferSaveFormData2',
            typeBien: type,
            area: area,
            rooms: rooms,
            bedrooms: bedrooms,
            avantages: avantages,
            description: desc,
            photos: photoList,
            video : video,
            ges: emission,
            dpe : conso,
            photosDB : photosDB
        } ) } 
    }
}
    
export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(CreateFormTwo)