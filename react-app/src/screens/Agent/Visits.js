import React, {useState, useRef, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import {RightOutlined, LeftOutlined, DownOutlined, WarningOutlined} from '@ant-design/icons'
import {Menu, Dropdown, Modal, DatePicker, TimePicker, Select, Button, Popconfirm, message, Radio, Alert} from 'antd'
import locale from 'antd/es/date-picker/locale/fr_FR'
import moment from 'moment'
import 'moment/locale/fr'

import {connect} from 'react-redux'
import {useCookies} from 'react-cookie'

import Unauthorized401 from './Unauthorized401'
import InternalError500 from './InternalError500'
import GlobalSpin from './GlobalSpin'

import './Calendar.css'
import 'antd/dist/antd.css'


const ts = require("time-slots-generator")

const { RangePicker } = TimePicker
const { Option } = Select


function Visits() {
  
  const [myEvents, setMyEvents] = useState([])
  const [properties, setProperties] = useState([])
  const [title, setTitle] = useState('')
  const [view, setView] = useState('Semaine')
  const [displaySlots, setDisplaySlots] = useState(false)
  const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

  const [redirectTo401, setRedirectTo401] = useState(false)
  const [internalError, setInternalError] = useState(false)

  const [dbLoading, setDbLoading] = useState(true)

  const calendar = useRef(null)

  /* Token refresh */
  const renewAccessToken = (token) => {
    if (token !== cookies.aT) {
        setCookie('aT', token, {path:'/pro'})
    }
  }

/*----------------------------------------------- PREPARE DATA FOR CALENDAR ---------------------------------------------------*/

  // Load data from DB (at page load & after creating, deleting or editing an ad)
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
        renewAccessToken(response.accessToken)

        let adsWithTimeslots = response.data.ads.filter( e => e.timeSlots.length > 0) //filter on ads that have timeslots
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
        let prop = response.data.ads.map( e => {
          return {
            name: e.title,
            color: e.color,
            adId: e._id
          }
        })
        setProperties(prop)
        setDbLoading(false)
      }
    }
    dbFetch()
    
  }, [displaySlots])

  /* Date range display */
  useEffect( () => {
    if (!dbLoading) {
      setTitle(calendar.current.calendar.view.title)
    }
  }, [dbLoading])


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
  const [appointmentModalMode, setAppointmentModalMode] = useState(null)
  const [appointmentModalOkLoading, setAppointmentModalOkLoading] =useState(false)
  const [appointmentModalDeleteLoading, setAppointmentModalDeleteLoading] =useState(false)

  const [appointmentModalEventDate, setAppointmentModalEventDate] = useState(null)
  const [appointmentModalEventHour1, setAppointmentModalEventHour1] = useState(null)
  const [appointmentModalEventHour2, setAppointmentModalEventHour2] = useState(null)
  const [appointmentModalEventProperty, setAppointmentModalEventProperty] = useState(null)
  const [appointmentModalEventPropertyId, setAppointmentModalEventPropertyId] = useState(0)
  const [appointmentModalEventPrivate, setAppointmentModalEventPrivate] = useState(true)
  const [appointmentModalEventId, setAppointmentModalEventId] = useState(0)

  const [postTimeSlotError, setPostTimeSlotError] = useState('')

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
    setAppointmentModalOkLoading(true)
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
    var interval = 30
    var slots = ts.getTimeSlots([[0, startTime-interval], [endTime, 1450]], false, "half")
    slots = slots.map( e => {
      var start = new Date(year, month, day, minToHandM(e).hour, minToHandM(e).minute)
      return {
        start: start,
        end: moment(start).add(interval, 'm').toDate(),
        private: appointmentModalEventPrivate
        }
      })
      slots = JSON.stringify(slots)

    // DB Call to save timeslots
    if (appointmentModalMode === 'create') {
      const postTimeslots = await fetch(`/pro/ad/${appointmentModalEventPropertyId}/timeslots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'Authorization': `Bearer ${cookies.aT}`
        },
        body: `timeslot=${slots}`
      })

      if (postTimeslots.status === 500) {
        setPostTimeSlotError('Votre créneau n\'a pas pu être enregistré, veuillez réessayer.')
        setAppointmentModalOkLoading(false)
    
      } else if (postTimeslots.status === 401) {
        setRedirectTo401(true)
        setAppointmentModalOkLoading(false)
        setPostTimeSlotError('')

      } else if (postTimeslots.status === 201) {
        message.success('Le créneau a bien été enregistré', 3)
        setDisplaySlots(!displaySlots)
        setAppointmentModalOkLoading(false)
        setAppointmentModalVisible(false)
        setAppointmentModalEventDate(null)
        setAppointmentModalEventHour1(null)
        setAppointmentModalEventHour2(null)
        setAppointmentModalEventProperty(null)
        setAppointmentModalEventPropertyId(null)
        setAppointmentModalEventId(null)
        setAppointmentModalMode(null)
        setAppointmentModalEventPrivate(true)
        setPostTimeSlotError('')
      }

    } else if (appointmentModalMode === 'edit') {
      const updateTimeslots = await fetch(`/pro/ad/${appointmentModalEventPropertyId}/timeslot/${appointmentModalEventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'Authorization': `Bearer ${cookies.aT}`
        },
        body: `timeslot=${slots}`
      })

      if (updateTimeslots.status === 500) {
        setPostTimeSlotError('Votre créneau n\'a pas pu être modifié, veuillez réessayer.')
        setAppointmentModalOkLoading(false)
    
      } else if (updateTimeslots.status === 401) {
        setRedirectTo401(true)
        setAppointmentModalOkLoading(false)
        setPostTimeSlotError('')

      } else if (updateTimeslots.status === 200) {
        message.success('Le créneau a bien été modifié', 3)
        setDisplaySlots(!displaySlots)
        setAppointmentModalOkLoading(false)
        setAppointmentModalVisible(false)
        setAppointmentModalEventDate(null)
        setAppointmentModalEventHour1(null)
        setAppointmentModalEventHour2(null)
        setAppointmentModalEventProperty(null)
        setAppointmentModalEventPropertyId(null)
        setAppointmentModalEventId(null)
        setAppointmentModalMode(null)
        setAppointmentModalEventPrivate(true)
        setPostTimeSlotError('')
      }
    }
  }

  const handleCancel = () => {
    setAppointmentModalVisible(false)
    setAppointmentModalOkLoading(false)
    setAppointmentModalDeleteLoading(false)
    setAppointmentModalEventDate(null)
    setAppointmentModalEventHour1(null)
    setAppointmentModalEventHour2(null)
    setAppointmentModalEventProperty(null)
    setAppointmentModalEventPropertyId(null)
    setAppointmentModalEventId(null)
    setAppointmentModalMode(null)
    setAppointmentModalEventPrivate(true)
    setPostTimeSlotError('')
  }

  async function confirm() {
    
    setAppointmentModalDeleteLoading(true)

    const deleteTimeslots = await fetch(`/pro/ad/${appointmentModalEventPropertyId}/timeslot/${appointmentModalEventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'Authorization': `Bearer ${cookies.aT}`
      }
    })

    if (deleteTimeslots.status === 500) {
      setPostTimeSlotError('Votre créneau n\'a pas pu être supprimé, veuillez réessayer.')
      setAppointmentModalDeleteLoading(false)
  
    } else if (deleteTimeslots.status === 401) {
      setRedirectTo401(true)
      setAppointmentModalDeleteLoading(false)
      setPostTimeSlotError('')

    } else if (deleteTimeslots.status === 200) {
      message.success('Le créneau a bien été supprimé', 3)
      setDisplaySlots(!displaySlots)
      setAppointmentModalDeleteLoading(false)
      setAppointmentModalVisible(false)
      setAppointmentModalEventDate(null)
      setAppointmentModalEventHour1(null)
      setAppointmentModalEventHour2(null)
      setAppointmentModalEventProperty(null)
      setAppointmentModalEventPropertyId(null)
      setAppointmentModalEventId(null)
      setAppointmentModalMode(null)
      setAppointmentModalEventPrivate(true)
      setPostTimeSlotError('')
    }
  }

  /* MODAL FOOTER */
  const modalFooter =
  
    <div>

      {postTimeSlotError !=='' &&
          <div style={{marginBottom: '8px', textAlign: 'center', color:'#f67280'}}>
          <WarningOutlined style={{marginRight: '2px'}}/>
          <span style={{marginLeft: '2px'}}>
            {postTimeSlotError}
          </span>
        </div>
      }

      <div className="modal-footer-buttons">

        {appointmentModalMode === "edit"
          &&
            <Popconfirm
              title="Confirmer la suppression du créneau ?"
              onConfirm={confirm}
              okText="Oui"
              okButtonProps={{type:'primary', className:'pop-confirm-buttons'}}
              cancelText="Non"
              cancelButtonProps={{type:'secondary', className:'pop-confirm-buttons'}}
              placement="bottomLeft"
            >
              <Button type="secondary" loading={appointmentModalDeleteLoading} className="button-decline modal-footer-button-delete">
                Supprimer
              </Button>
            </Popconfirm>
        }
    
          <Button type="primary" className="button-back modal-footer-button-back" onClick={handleCancel}>
          Annuler
          </Button>

          <Button type= "primary" className="button-validate" loading={appointmentModalOkLoading} onClick={handleOk}>
            Valider
          </Button>
      </div>
    </div>

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

    <div>
      <h1 className='pageTitle'>Visites</h1>

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
        select={(info) => {
          setAppointmentModalEventDate(info.start.toISOString().slice(0,10))
          setAppointmentModalEventHour1(info.start.toTimeString().slice(0,5))
          setAppointmentModalEventHour2(info.end.toTimeString().slice(0,5))
          setAppointmentModalMode("create")
          setAppointmentModalVisible(true)
        }}
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
          title={appointmentModalMode === "edit" ? `Modifier: ${appointmentModalEventProperty}` : "Nouveau Rendez-Vous"}
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

          {appointmentModalMode !== "edit" && 
          <div className='input-modal'>
              <p className="input-modal-label">Choix du bien</p>
              <Select
                  style={{ width: '80%' }}
                  placeholder="Bien à faire visiter"
                  optionFilterProp="children"
                  onChange={value => setAppointmentModalEventPropertyId(value)}
              >
                  {propertiesOptions}
              </Select>
          </div>
          }

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
)(Visits)