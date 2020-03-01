import React, {useState, useRef, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import {RightOutlined, LeftOutlined, DownOutlined} from '@ant-design/icons'
import {Menu, Dropdown, Modal, DatePicker, TimePicker, Select} from 'antd'
import locale from 'antd/es/date-picker/locale/fr_FR';
import moment from 'moment'
import 'moment/locale/fr';

import './App.css' 
import 'antd/dist/antd.css';

const { RangePicker } = TimePicker;
const { Option } = Select;

function App() {
  
  const [myEvents, setMyEvents] = useState([]) 
  const [title, setTitle] = useState('')
  const [view, setView] = useState('Semaine')

  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false)
  const [appointmentModalOkLoading, setAppointmentModalOkLoading] =useState(false)

  const [newEventDate, setNewEventDate] = useState()
  const [newEventHour1, setNewEventHour1] = useState()
  const [newEventHour2, setNewEventHour2] = useState()
  const [newEventProperty, setNewEventProperty] = useState()
  const [newEventColor, setNewEventColor] = useState()

  var calendar = useRef(null)

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

  useEffect( () => { async function changeTitle() {
    setTitle(calendar.current.calendar.view.title)
  };
  changeTitle()
  }, []);

  /* Choix de la vue : jour, semaine, mois */
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

  /*Modal*/
  
  const handleOk = () => {
    setAppointmentModalOkLoading(true);
    const year = newEventDate.slice(0,4)
    let month = newEventDate.slice(5,7)
    month = Number(month) -1
    const day = newEventDate.slice(8,10)
    const hour1 = newEventHour1.slice(0,2)
    const min1 = newEventHour1.slice(3,5)
    const hour2 = newEventHour2.slice(0,2)
    const min2 = newEventHour2.slice(3,5)

    const date1 = new Date(year, month, day, hour1, min1)
    const date2 = new Date(year, month, day, hour2, min2)

    let startDate 
    let endDate
    if (date1 < date2) {
      startDate = date1
      endDate = date2
    } else {
      startDate = date2
      endDate = date1
    }

    //appel Base de données pour enregistrer les créneaux : simulation avec set time out
    setTimeout(() => {
      var eventsCopy = [...myEvents, {title: newEventProperty, start: startDate, end: endDate, color: newEventColor}];
      setMyEvents(eventsCopy)

      setAppointmentModalOkLoading(false)
      setAppointmentModalVisible(false);
    }, 2000)
  };

  const handleCancel = () => {
    setAppointmentModalVisible(false);
  }

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

  return (
    <div>
      <div className="header" style={styles.header}>
        <div className="headerNavLeft" style={styles.headerNavLeft}>
          <LeftOutlined
            style={styles.chevronIcon}
            onClick={ () => {
              const calendarApi = calendar.current.getApi()
              calendarApi.prev();
              setTitle(calendar.current.calendar.view.title);
            }}
          />

          <div className="dateTitle" style={styles.dateTitle}>
            {title}
          </div>

          <RightOutlined
            style={styles.chevronIcon}
            onClick={ () => {
              const calendarApi = calendar.current.getApi()
              calendarApi.next();
              setTitle(calendar.current.calendar.view.title);
            }}
          />
        </div>

        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" style={styles.headerNavRight} onClick={e => e.preventDefault()}>
            {view} <DownOutlined />
          </a>
        </Dropdown>
      
      </div>
      <FullCalendar
        ref={calendar}
        defaultView="timeGridWeek"
        plugins={[ dayGridPlugin, timeGrid, interaction ]}
        locale= 'fr'
        firstDay= {1}
        hiddenDays={[0]}
        
        header={{
          left: '',
          center: '',
          right: ''
          }}

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
        
        allDaySlot={false}
        
        selectable= {true}
        navLinks= {true}
        navLinkDayClick="timeGridDay"
        select={(info) => {
          setNewEventDate(info.start.toISOString().slice(0,10))
          setNewEventHour1(info.start.toTimeString().slice(0,5))
          setNewEventHour2(info.end.toTimeString().slice(0,5))
          setAppointmentModalVisible(true);
          }}
        events={myEvents}
        minTime={'08:00'}
        maxTime={'20:00'}
        defaultTimedEventDuration={'00:30'}
        eventColor={'#052040'}
        
        contentHeight= "auto"

        // businessHours={{
        //   startTime: '10:00',
        //   endTime: '18:00'
        // }}  
        
      />

      <Modal
        title="Nouveau Rendez-Vous"
        visible={appointmentModalVisible}
        okText="Valider RDV"
        onOk={ () => handleOk()}
        okButtonProps= {{
          style:{
            backgroundColor:"#052040",
            borderColor: "#052040",
          }
        }}
        confirmLoading={appointmentModalOkLoading}
        cancelText= "Annuler"
        onCancel={ () => handleCancel()}
        destroyOnClose= {true}
        width= "70%"
      >
        <div className='inputModal' style={styles.inputModal}>
          <p className="inputLabelModal" style={styles.inputLabelModal}>Date du RDV</p>
          <DatePicker
            locale={locale}
            defaultValue={moment(newEventDate, 'YYYY-MM-DD')}
            onChange= {(date, dateString) => {
              setNewEventDate(dateString)
            }}
          />
        </div>

        <div className='inputModal' style={styles.inputModal}>
          <p className="inputLabelModal" style={styles.inputLabelModal}>Horaires du RDV</p>
          <RangePicker
            locale={locale}
            format= 'HH:mm'
            minuteStep={15}
            disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23]}
            hideDisabledOptions={true}
            placeholder={["Début", "Fin"]}
            defaultValue={[moment(newEventHour1, 'HH:mm'), moment(newEventHour2, 'HH:mm')]}
            onChange= { (time, timeSring) => {
              setNewEventHour1(timeSring[0]);
              setNewEventHour2(timeSring[1]);
            }}
          />
        </div>

        <div className='inputModal' style={styles.inputModal}>
          <p className="inputLabelModal" style={styles.inputLabelModal}>Choix du bien</p>
          <Select
            showSearch
            style={{ width: 500 }}
            placeholder="Bien à faire visiter"
            optionFilterProp="children"
            onChange={value => setNewEventProperty(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {propertiesOptions}
          </Select>
        </div>

        <div className='inputModal' style={styles.inputModal}>
          <p className="inputLabelModal" style={styles.inputLabelModal}>Couleur dans l'agenda</p>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Couleur"
            optionFilterProp="children"
            onChange={ (value, option) => {
              setNewEventColor(option.key)}}
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

export default App;

const styles = {
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2em",
    marginBottom: "1em"
  },

    headerNavLeft: {
      width: "33%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginLeft: 15,
      
    },
      chevronIcon: {
        color: "#6F6E6E",
        fontSize: 20,
      },
      dateTitle:{
        margin:0,
        textAlign: "center",
        color: "#052040"
      },
    
    headerNavRight: {
      marginRight: 15,
      fontSize: 14,
      color: "#052040",
      textDecoration: "underline"
    },

  inputModal: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1em"
  },
    inputLabelModal: {
      margin: "0 1em"
    }
}
