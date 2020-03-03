import React, {useState, useRef, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import {RightOutlined, LeftOutlined, DownOutlined} from '@ant-design/icons'
import {Menu, Dropdown, Modal, DatePicker, TimePicker, Select, Button, Popconfirm, message} from 'antd'
import locale from 'antd/es/date-picker/locale/fr_FR';
import moment from 'moment'
import 'moment/locale/fr';

import './Calendar.css'
import 'antd/dist/antd.css';

const ts = require("time-slots-generator");

const { RangePicker } = TimePicker;
const { Option } = Select;

function Calendar() {
  
  const [myEvents, setMyEvents] = useState([]) 
  const [title, setTitle] = useState('')
  const [view, setView] = useState('Semaine')

  var calendar = useRef(null)

  useEffect( () => { async function changeTitle() {
    setTitle(calendar.current.calendar.view.title)
  };
  changeTitle()
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

  const [appointmentModalDate, setAppointmentModalDate] = useState()
  const [appointmentModalHour1, setAppointmentModalHour1] = useState()
  const [appointmentModalHour2, setAppointmentModalHour2] = useState()
  const [appointmentModalProperty, setAppointmentModalProperty] = useState()
  const [appointmentModalColor, setAppointmentModalColor] = useState()
  const [appointmentModalColorInput, setAppointmentModalColorInput] = useState()
  const [appointmentModalId, setAppointmentModalId] = useState(0)

  /* Properties table (without DB)*/
  const properties = [
    "Appartement rue de Turbigo, Paris - 55m2 - 500 k€",
    "Maison rue Saint-Denis, Paris - 120m2 - 1500 k€",
    "Appartement rue Etienne Marcel, Saint-Germain-en-Laye - 80m2 - 432 k€"
  ]

  const propertiesOptions = properties.map( (e,i) => (
    <Option
      key={i}
      value={e}
    >
      {e}
    </Option>
  ))

  /* Color Init */
  const colors = [{
    hex: '#051F40', name: 'Bleu Marine'},
    {hex: '#1065CC', name: 'Bleu'},
    {hex: '#2ed573', name: 'Vert'},
    {hex: '#ee5253', name: 'Rouge'},
    {hex: '#f9ca24', name: 'Jaune'},
    {hex: '#95afc0', name: 'Gris'
  }]

  const colorOptions = colors.map( e => (
    <Option
      key={e.hex}
      value={e.name}
    >
      <span className="dot" style={{
        backgroundColor: e.hex,
        height: '15px',
        width: '15px',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '1em'
      }}></span>
      <span>{e.name}</span>
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
  const handleOk = () => {
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
    slots = slots.map( (e,i) => {
      var start = new Date(year, month, day, minToHandM(e).hour, minToHandM(e).minute)
      return {
        title: appointmentModalProperty,
        start: start,
        end: moment(start).add(interval, 'm').toDate(),
        color: appointmentModalColor,
        id: Math.floor(Math.random()*100000)
      }
    })

    //appel Base de données pour enregistrer les créneaux : simulation avec set time out
    setTimeout(() => {
      var eventsCopy=[...myEvents];
      if (appointmentModalMode === "edit") {
        eventsCopy = eventsCopy.filter( e => {
          console.log(e.id)
          console.log(appointmentModalId)
          return (e.id != appointmentModalId) })
      }
      eventsCopy = eventsCopy.concat(slots)
      setMyEvents(eventsCopy)

      setAppointmentModalOkLoading(false);
      setAppointmentModalVisible(false);
      setAppointmentModalDate(null);
      setAppointmentModalHour1(null);
      setAppointmentModalHour2(null);
      setAppointmentModalProperty(null);
      setAppointmentModalColor(null);
      setAppointmentModalId(null);
      setAppointmentModalMode(null);
    }, 2000)
  };

  const handleCancel = () => {
    setAppointmentModalVisible(false);
    setAppointmentModalDate(null);
    setAppointmentModalHour1(null);
    setAppointmentModalHour2(null);
    setAppointmentModalProperty(null);
    setAppointmentModalColor(null);
    setAppointmentModalId(null);
    setAppointmentModalMode(null);
  }

  function confirm(e) {
    setMyEvents(myEvents.filter( e => e.id != appointmentModalId))
    message.success('Créneau supprimé');
    setAppointmentModalVisible(false);
    setAppointmentModalDate(null);
    setAppointmentModalHour1(null);
    setAppointmentModalHour2(null);
    setAppointmentModalProperty(null);
    setAppointmentModalColor(null);
    setAppointmentModalId(null);
    setAppointmentModalMode(null);
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
    <div>
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
              `<div class="toto" style="
                margin: 0.5em auto 0.5em 1em;
                margin-left: 1em;
                margin-right: auto;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                text-align: left;
                line-height:1.1"
              >
                <div style="color:#6F6E6E; font-weight:normal; margin:0; padding:0">${daysTranslate(date.getDay())}</div>
                <div style="color:#000; font-weight:normal; font-size:40px ">${date.getDate()}</div>
              </div>`
            )
          }
        else if (view==='Mois') {
          return (
            `<div style="color:#6F6E6E; font-weight:normal; margin:0; padding:0">${daysTranslate(date.getDay())}</div>`
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
          setAppointmentModalVisible(true);
          }}
        eventClick= { (info) => {
          setAppointmentModalDate(info.event.start.toISOString().slice(0,10))
          setAppointmentModalHour1(info.event.start.toTimeString().slice(0,5))
          setAppointmentModalHour2(info.event.end.toTimeString().slice(0,5))
          setAppointmentModalProperty(info.event.title)
          setAppointmentModalColor(info.event.backgroundColor)
          setAppointmentModalColorInput(<span className="dot" style={{
            backgroundColor: info.event.backgroundColor,
            height: '15px',
            width: '15px',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '1em'
          }}></span>)
          setAppointmentModalId(info.event.id)
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

        <div className='input-modal'>
          <p className="input-modal-label">Couleur dans l'agenda</p>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Couleur"
            optionFilterProp="children"
            defaultValue= {appointmentModalColorInput}
            onChange={ (value, option) => {
              setAppointmentModalColor(option.key)}}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {colorOptions}
          </Select>
        </div>
      </Modal>

    </div>
  );
}

export default Calendar;