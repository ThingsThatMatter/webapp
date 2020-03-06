import React, {useState, useRef, useEffect} from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import { Layout, Steps, Button, Radio, Menu, Dropdown, Modal, DatePicker, TimePicker, Select, Popconfirm, message, Alert} from 'antd'
import {RightOutlined, LeftOutlined, DownOutlined} from '@ant-design/icons'
import locale from 'antd/es/date-picker/locale/fr_FR'
import moment from 'moment'
import 'moment/locale/fr'

import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import Sidebar from '../../components/Sidebar'

import './Calendar.css'
import 'antd/dist/antd.css'

const { Step } = Steps;
const {Content} = Layout;
const { RangePicker } = TimePicker
const { Option } = Select

const ts = require("time-slots-generator")


var tokenTest = "idMN5ebalGgc336ZVmkMI5n8P2zA8PXn"


function CreateFormFive(props) {

  /* ------------------------------------------CALENDAR---------------------------------------------- */  
  const [myEvents, setMyEvents] = useState([])
  const [newEvents, setNewEvents] = useState([])
  const [title, setTitle] = useState('')
  const [view, setView] = useState('Semaine')
  const [adColor, setAdColor] = useState(['#052040', '#1abc9c', '#2ecc71', '#f1c40f', '#e67e22', '#e74c3c', '#3498db', '#95a5a6', '#9b59b6', '#bdc3c7', '#16a085', '#2980b9', '#7f8c8d', '#c0392b', '#474787'])


  var calendar = useRef(null)

  useEffect( () => {
    const changeTitle = async () => {
      setTitle(calendar.current.calendar.view.title)
    }

    const dbFetch = async () => {
      const ads = await fetch('/pro/ads', {
        method: 'GET',
        headers: {'token': tokenTest}
      })
      const body = await ads.json()
      
      let adsWithTimeslots = body.data.ads.filter( e => e.timeSlots.length > 0) //filter on ads that have timeslots
      let timeslots = adsWithTimeslots.map( e => { //create a table of timeslots with their title and color
        return (e.timeSlots.map( f => {
          return {
          ...f,
          color : e.color,
          title : e.title,
          adId: e._id
          }
        }))
      })
      timeslots = timeslots.flat()

      /* Création de la liste de timeslot */
      const events = timeslots.map( e => {
        let backgroundColor
        let textColor
        let borderColor
        if (e.booked) {
          backgroundColor = e.color
          textColor = "#FFF"
        } else {
          backgroundColor = "#FFF"
          textColor = e.color
          borderColor = e.color
        }
        return {
          title: e.title,
          start: e.start,
          end: e.end,
          backgroundColor,
          textColor,
          borderColor,
          id: e._id,
          editable: false,
          classNames: ["calendar-event-noneditable"],
          extendedProps: {
              private: e.private,
              adId: e.adId,
              isEditable: false
          }
        }
      })
    setMyEvents(events)

    /* Création de la liste des couleurs disponibles */
    const bookedColors = body.data.ads.map(e => e.color)
    const availableColors = adColor.filter(e => bookedColors.indexOf(e) < 0)
    setAdColor(availableColors[Math.floor(Math.random() * availableColors.length)])

    }
  changeTitle()
  dbFetch()
  }, [])


  /* View choice : day, week, month */
  const menu = (
    <Menu>
      <Menu.Item
        key="0"
        onClick={ () => {
          const calendarApi = calendar.current.getApi()
          calendarApi.changeView('timeGridWeek')
          setView('Semaine')
        }}
      >
        Semaine
      </Menu.Item>
      <Menu.Item
        key="1"
        onClick={ () => {
          const calendarApi = calendar.current.getApi()
          calendarApi.changeView('timeGridDay')
          setView('Jour')
        }}
      >
        Jour
      </Menu.Item>
      <Menu.Item
        key="0"
        onClick={ () => {
          const calendarApi = calendar.current.getApi()
          calendarApi.changeView('dayGridMonth')
          setView('Mois')
        }}
      >
        Mois
      </Menu.Item>
    </Menu>
  )

  /*----------------------------------------------- MODAL ---------------------------------------------------*/
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false)
  const [appointmentModalMode, setAppointmentModalMode] = useState(null)

  const [appointmentModalEventDate, setAppointmentModalEventDate] = useState(null)
  const [appointmentModalEventHour1, setAppointmentModalEventHour1] = useState(null)
  const [appointmentModalEventHour2, setAppointmentModalEventHour2] = useState(null)
  const [appointmentModalEventProperty, setAppointmentModalEventProperty] = useState(null)
  const [appointmentModalEventPrivate, setAppointmentModalEventPrivate] = useState(true)
  const [appointmentModalEventId, setAppointmentModalEventId] = useState(0)

  /* TimeSlot: Convert time to hour and minutes */
  function minToHandM(n) {
    var num = n
    var hours = (num / 60)
    var rhours = Math.floor(hours)
    var minutes = (hours - rhours) * 60
    var rminutes = Math.round(minutes)
    return {hour: rhours, minute: rminutes}
    }

  /* HANDLING BUTTONS */
  const handleOk = async () => {
    const year = appointmentModalEventDate.slice(0,4)
    let month = Number(appointmentModalEventDate.slice(5,7))-1
    const day = appointmentModalEventDate.slice(8,10)
    const hour1 = appointmentModalEventHour1.slice(0,2)
    const min1 = appointmentModalEventHour1.slice(3,5)
    const hour2 = appointmentModalEventHour2.slice(0,2)
    const min2 = appointmentModalEventHour2.slice(3,5)

    const date1 = new Date(year, month, day, hour1, min1)
    const date2 = new Date(year, month, day, hour2, min2)

      /* Compare dates because we do not get them ordered */
    let startTime
    let endTime
    if (date1 < date2) {
      startTime = Number(hour1)*60+Number(min1)
      endTime = Number(hour2)*60+Number(min2)
    } else {
      startTime = Number(hour2)*60+Number(min2)
      endTime = Number(hour1)*60+Number(min1)
    }
      /* Warning: timeslots does not include bounds (so first slot is starTime minus the interval) */
    const interval = 30
    const id = Math.floor(Math.random()*1000000000000000) // generate random id to handle edit and delete of slots
    const slots = ts.getTimeSlots([[0, startTime-interval], [endTime, 1450]], false, "half")
    const slotsForCalendar = slots.map( (e,i) => {   //create timeslots for calendar render
      var start = new Date(year, month, day, minToHandM(e).hour, minToHandM(e).minute)
      return {
        title: props.formData.title,
        start: start,
        end: moment(start).add(interval, 'm').toDate(),
        backgroundColor: adColor,
        borderColor: adColor,
        id: id+i,
        extendedProps: {
          private: appointmentModalEventPrivate,
          booked: false,
          isEditable: true
        }
      }
    })

    const slotsForRedux = slots.map ( (e,i) => {
      var start = new Date(year, month, day, minToHandM(e).hour, minToHandM(e).minute)
      return {
        start: start,
        end: moment(start).add(interval, 'm').toDate(),
        priv: appointmentModalEventPrivate,
        id: id+i
      }
    })

    // Handle new timeslots
    let eventsCopy=[...myEvents]
    let newEventsCopy = [...newEvents]
    if (appointmentModalMode === 'edit') {
      eventsCopy = eventsCopy.filter( e => e.id != appointmentModalEventId)
      newEventsCopy = newEventsCopy.filter( e => e.id != appointmentModalEventId)
    }
    eventsCopy = eventsCopy.concat(slotsForCalendar)
    newEventsCopy = newEventsCopy.concat(slotsForRedux)
    setMyEvents(eventsCopy)
    setNewEvents(newEventsCopy)

    // Close Modal
    setAppointmentModalVisible(false)
    setAppointmentModalEventDate(null)
    setAppointmentModalEventHour1(null)
    setAppointmentModalEventHour2(null)
    setAppointmentModalEventProperty(null)
    setAppointmentModalMode(null)
    setAppointmentModalEventPrivate(true)
  }

  const handleCancel = () => {
    setAppointmentModalVisible(false)
    setAppointmentModalEventDate(null)
    setAppointmentModalEventHour1(null)
    setAppointmentModalEventHour2(null)
    setAppointmentModalEventProperty(null)
    setAppointmentModalEventId(null)
    setAppointmentModalMode(null)
    setAppointmentModalEventPrivate(true)
  }

  function confirm(e) {
    setMyEvents(myEvents.filter( e => e.id != appointmentModalEventId))
    setNewEvents(newEvents.filter( e => e.id != appointmentModalEventId))
    message.success('Créneau supprimé');
    setAppointmentModalVisible(false);
    setAppointmentModalEventDate(null);
    setAppointmentModalEventHour1(null);
    setAppointmentModalEventHour2(null);
    setAppointmentModalEventProperty(null);
    setAppointmentModalEventId(null);
    setAppointmentModalMode(null);
  }

  /* MODAL FOOTER */
  const modalFooter =

    <div>

      <div className="modal-footer-buttons">

        {appointmentModalMode === "edit"
          &&
            <Popconfirm
              title="Confirmer la suppression du créneau ?"
              onConfirm={confirm}
              okText="Oui"
              cancelText="Non"
              placement="bottomLeft"
            >
              <Button className="button-delete modal-footer-button-delete">
                Supprimer
              </Button>
            </Popconfirm> 
        }
    
          <Button type="primary" className="button-back modal-footer-button-back" onClick={handleCancel}>
            Annuler
          </Button>
          <Button type= "primary" className="button-validate" onClick={handleOk}>
            Valider
          </Button>
      </div>
    </div>

  /* Column Header translation */
  const daysInFrench = {
    '0' : 'Dim',
    '1' : 'Lun',
    '2' : 'Mar',
    '3' : 'Mer',
    '4' : 'Jeu',
    '5' : 'Ven',
    '6' : 'Sam',
  }
  const daysTranslate = (state) => daysInFrench[state]


  /* ------------------------------------------NAVIGATION---------------------------------------------- */  
  const [currentPage, setCurrentPage] = useState(0)
  const [redir, setRedir] = useState(false)
  const [backRedir, setBackRedir] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
      setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display
    },[]);

  if(redir === true) {
      return <Redirect to="/createform/step6"/> // Triggered by button-add handleClick
  }
  if(backRedir === true) {
      return <Redirect to="/createform/step4"/> // Triggered by button-back handleClick
  }

  const handleClick = () => {
      props.nextStep();
      props.saveFormData(newEvents, adColor)
      setRedir(true)
  }

  const handleSkip = () => {
    setRedir(true)
  }


    return (

      <Layout>

        <Sidebar/>

        <Layout className='main-content'>

          <Content style={{ margin: '24px 16px 0' }}>

            <Steps progressDot current={currentPage}>
              <Step title="Localisation" />
              <Step title="Description" />
              <Step title="Documents" />
              <Step title="Prix/honnoraires" />
              <Step title="Créneaux" />
              <Step title="Récap" />
            </Steps>

            <div>
              <div className="calendar-header">
                <div className="calendar-headerNavLeft">
                  <LeftOutlined
                      className="calendar-headerNavLeft-chevronIcon"
                      onClick={ () => {
                      const calendarApi = calendar.current.getApi()
                      calendarApi.prev()
                      setTitle(calendar.current.calendar.view.title)
                      }}
                  />

                  <div className="calendar-headerNavLeft-dateTitle">
                      {title}
                  </div>

                  <RightOutlined
                      className="calendar-headerNavLeft-chevronIcon"
                      onClick={ () => {
                      const calendarApi = calendar.current.getApi()
                      calendarApi.next()
                      setTitle(calendar.current.calendar.view.title)
                      }}
                  />
                </div>

                <Dropdown className="calendar-headerNavRight" overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        {view} <DownOutlined />
                    </a>
                </Dropdown>
              </div>

              <FullCalendar
                  /* Global Settings */
                  ref={calendar}
                  plugins={[ dayGridPlugin, timeGrid, interaction ]}
                  defaultView="timeGridWeek"
                  locale= 'fr'
                  header={{
                  left: '',
                  center: '',
                  right: ''
                  }}
                  contentHeight= "auto"

                  /* Events */
                  events={myEvents}
                  eventColor={'#052040'}

                  /* Time Settings */
                  firstDay= {1}
                  hiddenDays={[0]}
                  allDaySlot={false}
                  minTime={'08:00'}
                  maxTime={'20:00'}
                  defaultTimedEventDuration={'00:30'}

                  /* Column headers */
                  columnHeaderHtml={ (date) => {
                      if (view==='Semaine') {
                          return (
                          `<div class="calendar-week-column-header" >
                              <div class="calendar-week-column-header-text">${daysTranslate(date.getDay())}</div>
                              <div class="calendar-week-column-header-number">${date.getDate()}</div>
                          </div>`
                          )
                      }
                      else if (view==='Mois') {
                          return (
                              `<div class="calendar-default-column-header">${daysTranslate(date.getDay())}</div>`
                          )
                      }
                      else if (view==='Jour') {
                          return (
                              `<div class="calendar-default-column-header">${daysTranslate(date.getDay())}</div>`
                          )
                      }
                  }}
                  
                  /*Manage clicks on elements*/
                  selectable= {true}
                  navLinks= {true}
                  navLinkDayClick="timeGridDay"
                  select={(info) => {
                    setAppointmentModalEventDate(info.start.toISOString().slice(0,10))
                    setAppointmentModalEventHour1(info.start.toTimeString().slice(0,5))
                    setAppointmentModalEventHour2(info.end.toTimeString().slice(0,5))
                    setAppointmentModalMode("create")
                    setAppointmentModalVisible(true)
                  }}
                  eventClick= { (info) => {
                    if (info.event.extendedProps.isEditable) {
                      setAppointmentModalEventDate(info.event.start.toISOString().slice(0,10))
                      setAppointmentModalEventHour1(info.event.start.toTimeString().slice(0,5))
                      setAppointmentModalEventHour2(info.event.end.toTimeString().slice(0,5))
                      setAppointmentModalEventProperty(info.event.title)
                      setAppointmentModalEventPrivate(info.event.extendedProps.private)
                      setAppointmentModalEventId(info.event.id)
                      setAppointmentModalMode('edit')
                      setAppointmentModalVisible(true)
                    } else {
                      
                    }
                  }}    
              />

              <Modal
                title={appointmentModalMode === "edit" ? `Modifier: ${appointmentModalEventProperty}` : "Nouveau Rendez-Vous"}
                visible={appointmentModalVisible}
                footer= {modalFooter}
                destroyOnClose= {true}
                width= "50%"
                closable={true}
                maskl={true}
                maskClosable={true}
                onCancel={handleCancel}
              >
                <div className='input-modal'>
                    <p className="input-modal-label">Date du RDV</p>
                    <DatePicker
                      locale={locale}
                      defaultValue={moment(appointmentModalEventDate, 'YYYY-MM-DD')}
                      onChange= {(date, dateString) => { setAppointmentModalEventDate(dateString) }}
                    />
                </div>

                <div className='input-modal'>
                    <p className="input-modal-label">Horaires du RDV</p>
                    <RangePicker
                        locale={locale}
                        format= 'HH:mm'
                        minuteStep={30}
                        disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23]}
                        hideDisabledOptions={true}
                        placeholder={["Début", "Fin"]}
                        defaultValue={[moment(appointmentModalEventHour1, 'HH:mm'), moment(appointmentModalEventHour2, 'HH:mm')]}
                        onChange= { (time, timeSring) => {
                          setAppointmentModalEventHour1(timeSring[0])
                          setAppointmentModalEventHour2(timeSring[1])
                        }}
                    />
                </div>

                <div>
                <Radio.Group
                  onChange={e => { setAppointmentModalEventPrivate(e.target.value) }}
                  value={appointmentModalEventPrivate} 
                >
                  <Radio value={true}>Visite individuelle</Radio>
                  <Radio value={false}>Visite en groupe</Radio>
                </Radio.Group>
                </div>
              </Modal>

            </div>
            
            <div className= "new-offer-step5-buttons-block">
              <Button
                type="primary" 
                className="button-back"
                onClick={() => {
                    setBackRedir(true)
                    props.previousStep()
                }}
              >
                Précédent
              </Button>  

              <span
                className = "new-offer-step5-skip"
                onClick= { () => handleSkip()}
              >
                Passer cette étape
              </span>

              <Button
                type="primary"
                className="button-validate"
                onClick={() => handleClick()}
              >
                Suivant
              </Button>
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
      saveFormData : function(timeslots, color) { 
        dispatch( {
            type: 'saveFormData5',
            timeslots : timeslots,
            color: color
        } ) } 
    }
  }
    
  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(CreateFormFive);