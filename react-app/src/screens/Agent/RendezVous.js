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

import Sidebar from '../../components/Sidebar'

import './Calendar.css'
import 'antd/dist/antd.css'


const ts = require("time-slots-generator")

const { RangePicker } = TimePicker
const { Option } = Select
const {Content} = Layout


function RendezVous(props) {
  
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
      const ads = await fetch('/pro/ads', {
        method: 'GET',
        headers: {'token': props.token}
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
          'token': props.token
        },
        body: `timeslot=${slots}`
      })
      const body = await postTimeslots.json()
      if (body.message === 'OK') {
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
        setFailMsgVisible(false)
      } else {
        setFailMsgVisible(true)
        setAppointmentModalOkLoading(false)
      }
    } else if (appointmentModalMode === 'edit') {
      const updateTimeslots = await fetch(`/pro/ad/${appointmentModalEventPropertyId}/timeslot/${appointmentModalEventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': props.token
        },
        body: `timeslot=${slots}`
      })
      const body = await updateTimeslots.json()
      if (body.message === 'OK') {
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
        setFailMsgVisible(false)
      } else {
        setFailMsgVisible(true)
        setAppointmentModalOkLoading(false)
      }
    }
  }

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

    const deleteTimeslots = await fetch(`/pro/ad/${appointmentModalEventPropertyId}/timeslot/${appointmentModalEventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': props.token
      }
    })
    const body = await deleteTimeslots.json()
    if (body.message === 'OK') {
      message.success('Créneau supprimé')
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
      <div>
        {failMsgVisible === true
        &&
          <Alert className="add-slot-alert-fail-db"
            message="Erreur"
            description="Votre créneau n'a pas été sauvegardé. Veuillez réessayer."
            type="error"
            closable
            afterClose={ () => setFailMsgVisible(false) }
          />
        }
      </div>

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
              <Button type="secondary" className="button-delete modal-footer-button-delete">
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
    <Layout>
      <Sidebar/>
        <Layout className='main-content'>
          <Content>
            <h1 className='pageTitle'>Les rendez-vous</h1>

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
          </Content>  
        </Layout>
    </Layout>
  )
}

function mapStateToProps(state) {
  return { 
      token : state.token
  }
}

export default connect(
  mapStateToProps,
  null
)(RendezVous)