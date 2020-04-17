import React, {useState, useRef, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'

import {RightOutlined, LeftOutlined, DownOutlined} from '@ant-design/icons'
import {Menu, Dropdown, Modal, Button, Popconfirm, message, Spin} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

import 'moment/locale/fr'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import APIFetch from '../../components/Buyer/APIFetch'
import Unauthorized401 from './Unauthorized401'

import 'antd/dist/antd.css'


const logo = <LoadingOutlined style={{ fontSize: 22, color: "#355c7d", marginLeft: '4px', marginTop: '4px' }} spin/>

function Visits() {

  const [dataLoaded, setDataLoaded] = useState(false)

  const [adsListFromDb, setAdsListFromDb] = useState()
  
  const [myEvents, setMyEvents] = useState([])
  const [title, setTitle] = useState('')
  const [view, setView] = useState('Semaine')

  const [redirectTo401, setRedirectTo401] = useState(false)

  const [cookies, setCookie] = useCookies(['name']) // initializing state cookies

  const calendar = useRef(null)

  message.config({
    top: 80
  })

  /* Renew Access Token */
  const renewAccessToken = (token) => {
    if (token !== cookies.uT) {
        setCookie('uT', token, {path:'/'})
    }
  }

  
  /* -----------------------------------------------LOAD VISITS FROM DB------------------------------------------ */

  useEffect( () => {
    
    if(adsListFromDb) {
      
      let adsWithTimeslots = adsListFromDb.filter( e => e.timeSlots.length > 0) //filter on ads that have timeslots
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
    setTitle(calendar.current.calendar.view.title)
    }
  
  }, [dataLoaded])

  /* -----------------------------------------------CALENDAR SET_UP------------------------------------------ */

  /* View choice : day, week, month */
  const menu = (
    <Menu>
      <Menu.Item
        key="0"
        onClick={ () => {
          const calendarApi = calendar.current.getApi()
          calendarApi.changeView('timeGridWeek')
          setView('Semaine')
          setTitle(calendar.current.calendar.view.title)
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
          setTitle(calendar.current.calendar.view.title)
        }}
      >
        Jour
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={ () => {
          const calendarApi = calendar.current.getApi()
          calendarApi.changeView('dayGridMonth')
          setView('Mois')
          setTitle(calendar.current.calendar.view.title)
        }}
      >
        Mois
      </Menu.Item>
    </Menu>
  )

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
  

  /*----------------------------------------------- MODAL ---------------------------------------------------*/
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false)

  const [appointmentModalEventDate, setAppointmentModalEventDate] = useState(null)
  const [appointmentModalEventHour1, setAppointmentModalEventHour1] = useState(null)
  const [appointmentModalEventHour2, setAppointmentModalEventHour2] = useState(null)
  const [appointmentModalEventProperty, setAppointmentModalEventProperty] = useState(null)
  const [appointmentModalEventPropertyId, setAppointmentModalEventPropertyId] = useState(0)
  const [appointmentModalEventId, setAppointmentModalEventId] = useState(0)

  const [cancelVisitErrorMsg, setCancelVisitErrorMsg] = useState()
  const [cancelVisitLoad, setCancelVisitLoad] = useState(false)

  /* CLOSE OF MODAL */
  const handleCancel = () => {
    setAppointmentModalVisible(false)
    setAppointmentModalEventDate(null)
    setAppointmentModalEventHour1(null)
    setAppointmentModalEventHour2(null)
    setAppointmentModalEventProperty(null)
    setAppointmentModalEventPropertyId(null)
    setAppointmentModalEventId(null)
  }

  /* CANCEL VISIT */
  async function confirm() {

    setCancelVisitLoad(true)

    const deleteTimeslots = await fetch(`/user/ad/${appointmentModalEventPropertyId}/timeslots/${appointmentModalEventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Bearer ${cookies.uT}`
      }
    })

    if (deleteTimeslots.status === 500) {
      setCancelVisitLoad(false)
      setCancelVisitErrorMsg('Nous rencontrons des difficultés pour annuler votre visite, veuillez réessayer.')
  
    } else if (deleteTimeslots.status === 401) {
      setRedirectTo401(true)

    } else if (deleteTimeslots.status === 200) {
      const body = await deleteTimeslots.json()
      renewAccessToken(body.accessToken)
      setCancelVisitLoad(false)
      message.success('Votre visite a bien été annulée', 4)
      setMyEvents(myEvents.filter(e => e.extendedProps.adId !== appointmentModalEventPropertyId)) // delete visit on calendat
      setAppointmentModalVisible(false)
      setAppointmentModalEventDate(null)
      setAppointmentModalEventHour1(null)
      setAppointmentModalEventHour2(null)
      setAppointmentModalEventProperty(null)
      setAppointmentModalEventPropertyId(null)
      setAppointmentModalEventId(null)
    }
  }

  /* MODAL FOOTER */
  const modalFooter =

    <div>
      <div className="modal-footer-buttons">
        <div style={{display: 'flex', alignItems: 'center'}}>
          
          <Popconfirm
            title="Confirmer l'annulation ?"
            onConfirm={confirm}
            okText="Oui"
            okButtonProps={{type:'primary', className:'pop-confirm-buttons'}}
            cancelText="Non"
            cancelButtonProps={{type:'secondary', className:'pop-confirm-buttons'}}
            placement="bottomLeft"
          >
            <Button type="secondary" className="button-decline modal-footer-button-delete">
              Annuler la visite
            </Button>
          </Popconfirm>

          {cancelVisitLoad &&
            <Spin
                size="large"
                indicator={logo}
            />
          }

          {cancelVisitErrorMsg &&
            <p style={{marginLeft: '6px', color:'#f67280'}}>{cancelVisitErrorMsg}</p>
          }
        </div>
      </div>
    </div>

  /*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/

  if (redirectTo401) {
    return <Unauthorized401 />
  }

  return (

    <APIFetch
      fetchUrl= '/user/ads'
      fetchOptions={{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${cookies.uT}`
        }
      }}
      getApiResponse = { response => {
          if (!dataLoaded) {
            setAdsListFromDb(response.data.ads)
          }
          setDataLoaded(true)
      }}
    >
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
            plugins={[ dayGridPlugin, timeGrid, interaction, momentTimezonePlugin ]}
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
            timeZone='Europe/Paris'
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
              setAppointmentModalEventDate(info.event.start.toLocaleDateString().slice(0,10))
              setAppointmentModalEventHour1(info.event.start.toLocaleTimeString('fr-FR').slice(0,5))
              setAppointmentModalEventHour2(info.event.end.toLocaleTimeString('fr-FR').slice(0,5))
              setAppointmentModalEventProperty(info.event.title)
              setAppointmentModalEventPropertyId(info.event.extendedProps.adId)
              setAppointmentModalEventId(info.event.id)
              setAppointmentModalVisible(true)
            }}    
        />
        <p className='timezone-info'>Fuseau horaire : France Métropolitaine </p>


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
                <p className="input-modal-label">Horaire de la visite : de {appointmentModalEventHour1} à {appointmentModalEventHour2}</p>
            </div>

        </Modal>
    </APIFetch>
  )
}

function mapStateToProps(state) {
  return { 
    userLoginStatus : state.userLoginStatus
  }
}

export default connect(
  mapStateToProps,
  null
)(Visits)