import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout, Steps, Button, Input, Radio, InputNumber, Checkbox, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import {Redirect} from 'react-router-dom';
import {DeleteOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';

const { Step } = Steps;
const {Content} = Layout;
const { TextArea } = Input;
const { Dragger } = Upload;

function CreateFormTwo(props) {

    const [type, setType] = useState("")
    const [area, setArea] = useState(0)
    const [rooms, setRooms] = useState(0)
    const [bedrooms, setBedrooms] = useState(0)
    const [avantages, setAvantages] = useState([])
    const [desc, setDesc] = useState("")
    const [fileList, setFileList] = useState([])
    const [video, setVideo] = useState("")
    const [emission, setEmission] = useState(0)
    const [conso, setConso] = useState(0)

    const [currentPage, setCurrentPage] = useState(0)
    const [redir, setRedir] = useState(false)
    const [backRedir, setBackRedir] = useState(false)
    const [formError, setFormError] = useState("")


    useEffect(() => {
        setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display

        if(props.formData.rooms) {     // Display inputed info if user goes back from next form pages
            setType(props.formData.type)
            setArea(props.formData.area)
            setRooms(props.formData.rooms)
            setBedrooms(props.formData.bedrooms)
            setAvantages(props.formData.advantages)
            setDesc(props.formData.description)
            setFileList(props.formData.photos)
            setVideo(props.formData.video)
            setEmission(props.formData.ges)
            setConso(props.formData.dpe)
        }
      },[]);

    const options = [
        {label : "Ascenseur", value : "ascenseur"},
        {label : "Balcon", value : "balcon"},
        {label : "Terrasse", value : "terrasse"}
    ]

     
    const handleClick = () => {

        if(type !== "" && area !== 0 && rooms !== 0 && desc !== "" && fileList.length > 0  ) {
            props.nextStep();
            props.saveFormData(type, area, rooms, bedrooms, avantages, desc, fileList, video, emission, conso)
            setRedir(true)

        } else {
            setFormError(<p style={{paddingTop : "2%", color: "#E74A34", fontWeight: 700, marginBottom: "-2%"}}>Merci de bien vouloir remplir tous les champs du formulaire !</p>)
        }    
    }

    if(redir === true) {
        return <Redirect to="/pro/createform/step3"/> // Triggered by button-add handleClick
    }
    if(backRedir === true) {
        return <Redirect to="/pro/createform/step1"/> // Triggered by button-back handleClick
    }

  
    console.log(props.formData)
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
                            
                            <p className='formLabel'>Type de bien </p>
                            <label>
                                <Radio.Group 
                                value={type} 
                                onChange={(e) => setType(e.target.value)} 
                                >
                                <Radio 
                                value="appartement" 
                                style={{paddingTop : "1%"}}>
                                Appartement</Radio>
                                <br/>
                                <Radio 
                                value="maison" 
                                style={{paddingTop : "1%"}}>
                                    Maison</Radio>
                                </Radio.Group>
                            </label>

                            <p className='formLabel'>Surface</p>
                            <label >
                                <InputNumber 
                                min={0} 
                                onChange={(e) => setArea(e)} 
                                value={area} 
                                placeholder="75 m2"/>
                            </label>
                            <span style={{marginLeft: "1%", fontWeight: 700}}>m2</span>

                            <p className='formLabel'>Nombre de pièces</p>
                            <label>
                                <InputNumber 
                                min={0} 
                                onChange={(e) => setRooms(e)} 
                                value={rooms} 
                                placeholder="75018"/>
                            </label>
                            
                            <p className='formLabel'>Nombre de chambres</p>
                            <label>
                                <InputNumber
                                min={0} 
                                onChange={(e) => setBedrooms(e)} 
                                value={bedrooms} 
                                placeholder="75018"/>
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
                                />
                            </label>

                            <p className='formLabel'>Photos (10 max)</p>
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

                            <p className='formLabel'>Lien vers vidéo (optionnel)</p>
                            <label >
                                <Input 
                                onChange={(e) => setVideo(e.target.value)} 
                                value={video} 
                                placeholder="http://"/>
                            </label>

                            <p className='formLabel'>Emission de gaz à effet de serre (optionnel)</p>
                            <label >
                                <InputNumber
                                min={0} 
                                onChange={(e) => setEmission(e)} 
                                value={emission} 
                                placeholder="23"/>
                            </label>
                            <span style={{marginLeft: "1%", fontWeight: 700}}>kgeq/m2/an</span>

                            <p className='formLabel'>Consommation énergétique (optionnel)</p>
                            <label >
                                <InputNumber
                                min={0}
                                onChange={(e) => setConso(e)} 
                                value={conso} 
                                placeholder="438"/>
                            </label>
                            <span style={{marginLeft: "1%", fontWeight: 700}}>kWhEP/m2/an</span>
                            
                         
                            
                        </form>
                        {formError}

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
    return { 
        step : state.step,
        formData: state.formData
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      nextStep : function() { 
          dispatch( {type: 'nextStep'} ) 
      },
      previousStep : function() {
          dispatch( {type: 'prevStep'} )
      },
      saveFormData : function(type, area, rooms, bedrooms, avantages, desc, fileList, video, emission, conso) { 
        dispatch( {
            type: 'saveFormData2',
            typeBien: type,
            area: area,
            rooms: rooms,
            bedrooms: bedrooms,
            avantages: avantages,
            description: desc,
            photos: fileList,
            video : video,
            ges: emission,
            dpe : conso
        } ) } 
    }
  }
    
  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(CreateFormTwo);