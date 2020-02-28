import React, {useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGrid from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import './App.css' 

function App() {

  //var calendar = useRef(null)
  const [myEvents, setMyEvents] = useState([]) 

  const newEvent = (info) => {
    var eventsCopy = [...myEvents, {title: 'newRDV', start: info.startStr, end: info.endStr}];
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
      
      header={{
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,dayGridMonth'
        }}
      
      selectable= {true}
      navLinks= {true}
      // dateClick={ (info) => newEvent(info) }
      select={ (info) => newEvent(info) }
      events={myEvents}
      minTime={'08:00'}
      maxTime={'18:00'}
      defaultTimedEventDuration={'00:30'}
      eventColor={'#378006'}
      
      

      // businessHours={{
      //   startTime: '10:00',
      //   endTime: '18:00'
      // }}  
      
    />
    
  );
}

export default App;
