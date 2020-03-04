import React, {useState, useRef, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import {RightOutlined, LeftOutlined, DownOutlined} from '@ant-design/icons'
import {Layout, Menu, Dropdown, Modal, DatePicker, TimePicker, Select, Button, Popconfirm, message, Radio} from 'antd'
import locale from 'antd/es/date-picker/locale/fr_FR';
import moment from 'moment'
import 'moment/locale/fr';

import Sidebar from '../../components/Sidebar';

import './Calendar.css'
import 'antd/dist/antd.css';


const ts = require("time-slots-generator");

const { RangePicker } = TimePicker;
const { Option } = Select;
const {Content} = Layout;

var tokenTest = "idMN5ebalGgc336ZVmkMI5n8P2zA8PXn"

function RendezVous() {
  
  const [myEvents, setMyEvents] = useState([])
  const [properties, setProperties] = useState([])
  const [title, setTitle] = useState('')
  const [view, setView] = useState('Semaine')

  var calendar = useRef(null)

  useEffect( () => {
    const changeTitle = async () => {
      setTitle(calendar.current.calendar.view.title)
    };
    const dbFetch = async () => {
      const timeslots = await fetch(`/pro/ad/timeslots?token=${tokenTest}`);
      const body = await timeslots.json();
      console.log(body.data)

      /* Création de la liste de timeslot */
      const events = body.data.map( e => {
        let backgroundColor;
        let textColor;
        let borderColor;
        if (e.timeSlots.booked) {
          backgroundColor = e.color
          textColor = "#FFF"
        } else {
          backgroundColor = "#FFF"
          textColor = e.color
          borderColor = e.color
        }
        return {
          title: e.title,
          start: e.timeSlots.start,
          end: e.timeSlots.end,
          backgroundColor,
          textColor,
          borderColor,
          id: e._id,
          extendedProps: {
              visitType: e.timeSlots.private
          }
        }
      })
    setMyEvents(events)
      
    /* Creation of properties list for modal */
    let prop = body.data.map( e => {
      return {
        name: e.title,
        color: e.color
      }
    })
    function getUnique(arr, comp) { //Remove duplicates in table
      const unique = arr
           .map(e => e[comp])
         // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);
       return unique;
    }
    setProperties(getUnique(prop, 'name'))

    }
  changeTitle()
  dbFetch()
  }, []);


  /* View choice : day, week, month */
  const menu = (
    <Menu>
      <Menu.Item
        key="0"
        onClick={ () => {
          const calendarApi = calendar.current.getApi()
          calendarApi.changeView('timeGridWeek');
          setView('Semaine');
        }}
      >
        Semaine
      </Menu.Item>
      <Menu.Item
        key="1"
        onClick={ () => {
          const calendarApi = calendar.current.getApi()
          calendarApi.changeView('timeGridDay');
          setView('Jour');
        }}
      >
        Jour
      </Menu.Item>
      <Menu.Item
        key="0"
        onClick={ () => {
          const calendarApi = calendar.current.getApi()
          calendarApi.changeView('dayGridMonth');
          setView('Mois');
        }}
      >
        Mois
      </Menu.Item>
    </Menu>
  );

  /*----------------------------------------------- MODAL ---------------------------------------------------*/
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false)
  const [appointmentModalMode, setAppointmentModalMode] = useState(null)
  const [appointmentModalOkLoading, setAppointmentModalOkLoading] =useState(false)

  const [appointmentModalDate, setAppointmentModalDate] = useState(null)
  const [appointmentModalHour1, setAppointmentModalHour1] = useState(null)
  const [appointmentModalHour2, setAppointmentModalHour2] = useState(null)
  const [appointmentModalProperty, setAppointmentModalProperty] = useState(null)
  const [appointmentModalId, setAppointmentModalId] = useState(0)
  const [appointmentModalVisitType, setAppointmentModalVisitType] = useState('Individuelle')

  const propertiesOptions = properties.map( (e,i) => (
    <Option
      key={i}
      value={e.name}
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

  /* Modal Footer*/

  /* TimeSlot: Convert time to hour and minutes */
  function minToHandM(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return {hour: rhours, minute: rminutes};
    }

  /* HANDLING BUTTONS */
  const handleOk = async () => {
    setAppointmentModalOkLoading(true);
    const year = appointmentModalDate.slice(0,4)
    let month = Number(appointmentModalDate.slice(5,7))-1
    const day = appointmentModalDate.slice(8,10)
    const hour1 = appointmentModalHour1.slice(0,2)
    const min1 = appointmentModalHour1.slice(3,5)
    const hour2 = appointmentModalHour2.slice(0,2)
    const min2 = appointmentModalHour2.slice(3,5)

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
    var interval = 30;
    var slots = ts.getTimeSlots([[0, startTime-interval], [endTime, 1450]], false, "half")
    slots = slots.map( e => {
      var start = new Date(year, month, day, minToHandM(e).hour, minToHandM(e).minute)
      return {
        start: start,
        end: moment(start).add(interval, 'm').toDate(),
        private: appointmentModalVisitType
        }
      })
      console.log(slots)
      slots = JSON.stringify(slots)

    //appel Base de données pour enregistrer les créneaux : simulation avec set time out
    // if (appointmentModalMode === 'create') {
    //   const postTimeslots = await fetch(`/pro/ad/${appointmentModalId}/timeslots`, {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    //     body: `id=${appointmentModalId}&token=${tokenTest}&timeslots=${slots}`
    //   })
    //   const body = await postTimeslots.json();
    //   console.log(body.data)
    // }


  //   setTimeout(() => {
  //     var eventsCopy=[...myEvents];
  //     if (appointmentModalMode === "edit") {
  //       eventsCopy = eventsCopy.filter( e => {
  //         console.log(e.id)
  //         console.log(appointmentModalId)
  //         return (e.id != appointmentModalId) })
  //     }
  //     eventsCopy = eventsCopy.concat(slots)
  //     setMyEvents(eventsCopy)

  //     setAppointmentModalOkLoading(false);
  //     setAppointmentModalVisible(false);
  //     setAppointmentModalDate(null);
  //     setAppointmentModalHour1(null);
  //     setAppointmentModalHour2(null);
  //     setAppointmentModalProperty(null);
  //     setAppointmentModalId(null);
  //     setAppointmentModalMode(null);
  //     setAppointmentModalVisitType('Individuelle');
  //   }, 2000)
  };

  const handleCancel = () => {
    setAppointmentModalVisible(false);
    setAppointmentModalDate(null);
    setAppointmentModalHour1(null);
    setAppointmentModalHour2(null);
    setAppointmentModalProperty(null);
    setAppointmentModalId(null);
    setAppointmentModalMode(null);
    setAppointmentModalVisitType('Individuelle');
  }

  function confirm(e) {
    setMyEvents(myEvents.filter( e => e.id != appointmentModalId))
    message.success('Créneau supprimé');
    setAppointmentModalVisible(false);
    setAppointmentModalDate(null);
    setAppointmentModalHour1(null);
    setAppointmentModalHour2(null);
    setAppointmentModalProperty(null);
    setAppointmentModalId(null);
    setAppointmentModalMode(null);
    setAppointmentModalVisitType('Individuelle');
  }

  const modalFooter =
    <div className="modal-footer">

      {appointmentModalMode === "edit" ? 
        <Popconfirm
          title="Confirmer la suppression du créneau ?"
          onConfirm={confirm}
          okText="Oui"
          cancelText="Non"
          placement="bottomLeft"
        >
          <Button className="button-delete">
            Supprimer
          </Button>
        </Popconfirm>
        : <div></div>
      }
  
      <div>
        <Button className="button-cancel" onClick={handleCancel}>
        Annuler
        </Button>
        <Button className="button-validate" loading={appointmentModalOkLoading} onClick={handleOk}>
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
  const daysTranslate = (state) => daysInFrench[state];


  return (
    <Layout>
      <Sidebar/>
        <Layout className='main-content'>
          <Content style={{ margin: '24px 16px 0' }}>
            <div className='pageTitle'>Gérer mes Rendez-Vous</div>

            <div className="calendar-header">
                <div className="calendar-headerNavLeft">
                <LeftOutlined
                    className="calendar-headerNavLeft-chevronIcon"
                    onClick={ () => {
                    const calendarApi = calendar.current.getApi()
                    calendarApi.prev();
                    setTitle(calendar.current.calendar.view.title);
                    }}
                />

                <div className="calendar-headerNavLeft-dateTitle">
                    {title}
                </div>

                <RightOutlined
                    className="calendar-headerNavLeft-chevronIcon"
                    onClick={ () => {
                    const calendarApi = calendar.current.getApi()
                    calendarApi.next();
                    setTitle(calendar.current.calendar.view.title);
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
                setAppointmentModalDate(info.start.toISOString().slice(0,10))
                setAppointmentModalHour1(info.start.toTimeString().slice(0,5))
                setAppointmentModalHour2(info.end.toTimeString().slice(0,5))
                setAppointmentModalMode("create")
                setAppointmentModalVisible(true)
                }}
                eventClick= { (info) => { console.log(info)
                setAppointmentModalDate(info.event.start.toISOString().slice(0,10))
                setAppointmentModalHour1(info.event.start.toTimeString().slice(0,5))
                setAppointmentModalHour2(info.event.end.toTimeString().slice(0,5))
                setAppointmentModalProperty(info.event.title)
                setAppointmentModalId(info.event.id)
                setAppointmentModalVisitType(info.event.extendedProps.visitType);
                setAppointmentModalMode('edit')
                setAppointmentModalVisible(true)
                }}    
            />

            <Modal
                title={appointmentModalMode === "edit" ? `Modifier: ${appointmentModalProperty}` : "Nouveau Rendez-Vous"}
                visible={appointmentModalVisible}
                footer= {modalFooter}
                destroyOnClose= {true}
                width= "50%"
                closable={false}
                maskClosable={true}
            >
                <div className='input-modal'>
                    <p className="input-modal-label">Date du RDV</p>
                    <DatePicker
                        locale={locale}
                        defaultValue={moment(appointmentModalDate, 'YYYY-MM-DD')}
                        onChange= {(date, dateString) => {
                        setAppointmentModalDate(dateString)
                        }}
                    />
                </div>

                <div className='input-modal'>
                    <p className="input-modal-label">Horaires du RDV</p>
                    <RangePicker
                        locale={locale}
                        format= 'HH:mm'
                        minuteStep={15}
                        disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23]}
                        hideDisabledOptions={true}
                        placeholder={["Début", "Fin"]}
                        defaultValue={[moment(appointmentModalHour1, 'HH:mm'), moment(appointmentModalHour2, 'HH:mm')]}
                        onChange= { (time, timeSring) => {
                        setAppointmentModalHour1(timeSring[0]);
                        setAppointmentModalHour2(timeSring[1]);
                        }}
                    />
                </div>

                {appointmentModalMode !== "edit" && 
                <div className='input-modal'>
                    <p className="input-modal-label">Choix du bien</p>
                    <Select
                        showSearch
                        style={{ width: '80%' }}
                        placeholder="Bien à faire visiter"
                        optionFilterProp="children"
                        defaultValue= {appointmentModalProperty}
                        onChange={value => setAppointmentModalProperty(value)}
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {propertiesOptions}
                    </Select>
                </div>
                }

                <div>
                <Radio.Group onChange={(e) => setAppointmentModalVisitType(e.target.value)} value={appointmentModalVisitType}>
                    <Radio value="Individuelle">Visite individuelle</Radio>
                    <Radio value="Groupe">Visite en groupe</Radio>
                </Radio.Group>
                </div>
            </Modal>
          </Content>  
        </Layout>
    </Layout>
  );
}

export default RendezVous;