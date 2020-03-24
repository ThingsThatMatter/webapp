import React, {useState, useRef, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import {RightOutlined, LeftOutlined, DownOutlined} from '@ant-design/icons'
import {Layout, Menu, Dropdown, Modal, DatePicker, TimePicker, Select, Button, Popconfirm, message, Radio, Alert} from 'antd'
import locale from 'antd/es/date-picker/locale/fr_FR'
import moment from 'moment'
import 'moment/locale/fr'

import {connect} from 'react-redux'

import UserNavHeader from '../../components/UserNavHeader'

// import './Calendar.css'
import 'antd/dist/antd.css'


const ts = require("time-slots-generator")

const { RangePicker } = TimePicker
const { Option } = Select
const {Content} = Layout


function Visits(props) {
  
  const [myEvents, setMyEvents] = useState([])
  const [properties, setProperties] = useState([])
  const [title, setTitle] = useState('')
  const [view, setView] = useState('Semaine')
  const [displaySlots, setDisplaySlots] = useState(false)

  var calendar = useRef(null)

  useEffect( () => {
    const changeTitle = async () => {
      setTitle(calendar.current.calendar.view.title)
    }

    const dbFetch = async () => {
      const ads = await fetch('/user/ads', {
        method: 'GET',
        headers: {'token': props.buyerLoginInfo.token}
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
          borderColor = e.color
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
          extendedProps: {
              private: e.private,
              adId: e.adId
          }
        }
      })
    setMyEvents(events)
      
    /* Creation of properties list for modal */
    let prop = body.data.ads.map( e => {
      return {
        name: e.title,
        color: e.color,
        adId: e._id
      }
    })
    setProperties(prop)

    }
  changeTitle()
  dbFetch()
  }, [displaySlots])


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
  const [appointmentModalOkLoading, setAppointmentModalOkLoading] =useState(false)

  const [appointmentModalEventDate, setAppointmentModalEventDate] = useState(null)
  const [appointmentModalEventHour1, setAppointmentModalEventHour1] = useState(null)
  const [appointmentModalEventHour2, setAppointmentModalEventHour2] = useState(null)
  const [appointmentModalEventProperty, setAppointmentModalEventProperty] = useState(null)
  const [appointmentModalEventPropertyId, setAppointmentModalEventPropertyId] = useState(0)
  const [appointmentModalEventPrivate, setAppointmentModalEventPrivate] = useState(true)
  const [appointmentModalEventId, setAppointmentModalEventId] = useState(0)

  const [failMsgVisible, setFailMsgVisible] = useState(false)

  const propertiesOptions = properties.map( (e,i) => (
    <Option
      key={i}
      value={e.adId}
    >
      <span className="dot" style={{
        backgroundColor: e.color,
        height: '15px',
        width: '15px',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '1em'
      }}></span>
      {e.name}
    </Option>
  ))


  const handleCancel = () => {
    setAppointmentModalVisible(false)
    setAppointmentModalEventDate(null)
    setAppointmentModalEventHour1(null)
    setAppointmentModalEventHour2(null)
    setAppointmentModalEventProperty(null)
    setAppointmentModalEventPropertyId(null)
    setAppointmentModalEventId(null)
    setAppointmentModalMode(null)
    setAppointmentModalEventPrivate(true)
    setFailMsgVisible(false)
  }

  async function confirm() {

    const deleteTimeslots = await fetch(`/user/ad/${appointmentModalEventPropertyId}/timeslot/${appointmentModalEventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': props.buyerLoginInfo.token
      }
    })
    const body = await deleteTimeslots.json()
    if (body.message === 'OK') {
      message.success('Visite annulée')
      setDisplaySlots(!displaySlots)
      setAppointmentModalVisible(false)
      setAppointmentModalEventDate(null)
      setAppointmentModalEventHour1(null)
      setAppointmentModalEventHour2(null)
      setAppointmentModalEventProperty(null)
      setAppointmentModalEventPropertyId(null)
      setAppointmentModalEventId(null)
      setAppointmentModalMode(null)
      setAppointmentModalEventPrivate(true)
      setFailMsgVisible(false)
    } else {
      setFailMsgVisible(true)
      setAppointmentModalOkLoading(false)
    }
  }

  /* MODAL FOOTER */
  const modalFooter =

    <div>
      <div className="modal-footer-buttons">
            <Popconfirm
              title="Confirmer l'annulation' ?"
              onConfirm={confirm}
              okText="Oui"
              okButtonProps={{type:'primary', className:'pop-confirm-buttons'}}
              cancelText="Non"
              cancelButtonProps={{type:'secondary', className:'pop-confirm-buttons'}}
              placement="bottomLeft"
            >
              <Button type="secondary" className="button-delete modal-footer-button-delete">
                Annuler la visite
              </Button>
            </Popconfirm>
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


  return (
    <Layout className="user-layout">

        <UserNavHeader current="Biens consultés"/>

            <Layout className='user-layout main-content'>

            <Content>
            <h1 className='pageTitle'>Mon calendrier</h1>

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

                /* Time Settings */
                timeZone='UTC'
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
                eventClick= { (info) => {
                  setAppointmentModalEventDate(info.event.start.toISOString().slice(0,10))
                  setAppointmentModalEventHour1(info.event.start.toTimeString().slice(0,5))
                  setAppointmentModalEventHour2(info.event.end.toTimeString().slice(0,5))
                  setAppointmentModalEventProperty(info.event.title)
                  setAppointmentModalEventPropertyId(info.event.extendedProps.adId)
                  setAppointmentModalEventPrivate(info.event.extendedProps.private)
                  setAppointmentModalEventId(info.event.id)
                  setAppointmentModalMode('edit')
                  setAppointmentModalVisible(true)
                }}    
            />

            <Modal
                title={appointmentModalEventProperty}
                visible={appointmentModalVisible}
                footer= {modalFooter}
                destroyOnClose= {true}
                width= "50%"
                closable={true}
                mask={true}
                maskClosable={true}
                onCancel={handleCancel}
            >
                <div className='input-modal'>
                    <p className="input-modal-label">Date de la visite : {appointmentModalEventDate}</p>
                </div>

                <div className='input-modal'>
                    <p className="input-modal-label">Horaires de la visite : de {appointmentModalEventHour1} à {appointmentModalEventHour2}</p>
                </div>

            </Modal>
          </Content>  
        </Layout>
    </Layout>
  )
}

function mapStateToProps(state) {
  return { 
    buyerLoginInfo : state.buyerLoginInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(Visits)