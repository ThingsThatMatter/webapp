import React, {useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import './App.css' 

function App() {

  //var calendar = useRef(null)
  const [myEvents, setMyEvents] = useState([{
    title:'test',
    start:'2020-02-27'
  },
  {
    title:'test',
    start:'2020-02-26',
    backgroundColor: 'red'
  }]) 

  const newEvent = (info) => {
    var eventsCopy = [...myEvents, {title: 'newRDV', start: info.dateStr}];
    console.log(eventsCopy)
    setMyEvents(eventsCopy)
  }

  return (
    <FullCalendar
      //ref={ref => (calendar = ref)} 
      defaultView="timeGridWeek"
      plugins={[ dayGridPlugin, timeGrid, interaction ]}
      locale= 'fr'
      firstDay= {1}
      hiddenDays={[0]}
      themeSystem='bootstrap'
      
      header={{
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,dayGridMonth'
        }}
      
      selectable= {true}
      select={ (info) => newEvent(info)}
      events={myEvents}
      eventColor={'#378006'}
      defaultTimedEventDuration={'00:30'}
      
      

      // businessHours={{
      //   startTime: '10:00',
      //   endTime: '18:00'
      // }}  
      
    />
    
  );
}

export default App;
