import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";


export default function TimeslotPicker(props) {

const [slotsDisplay, setSlotsDisplay] = useState([]);

const timeslots = [ // Test array to replace with fetch in useEffect with ad id from props
{
user: [],
_id: "5e667918c8cd1041d8dabb4e",
start: "2020-03-11T07:00:00.000Z",
end: "2020-03-11T07:30:00.000Z",
booked: false,
private: true
},
{
user: [],
_id: "5e667918c8cd1041d8dabb4f",
start: "2020-03-11T07:30:00.000Z",
end: "2020-03-11T08:00:00.000Z",
booked: false,
private: true
},
{
user: [],
_id: "5e667918c8cd1041d8dabb50",
start: "2020-03-11T08:00:00.000Z",
end: "2020-03-11T08:30:00.000Z",
booked: false,
private: true
},
{
user: [],
_id: "5e667918c8cd1041d8dabb51",
start: "2020-03-11T08:30:00.000Z",
end: "2020-03-11T09:00:00.000Z",
booked: false,
private: true
}
]

const daySlots = []

for(let i=0 ; i < timeslots.length ; i++) {

  const year = timeslots[i].start.slice(0,4)
  let month = Number(timeslots[i].start.slice(5,7))-1
  const day = timeslots[i].start.slice(8,10)
  const hour1 = timeslots[i].start.slice(11,13)
  const min1 = timeslots[i].start.slice(14,16)
  const hour2 = timeslots[i].end.slice(11,13)
  const min2 = timeslots[i].end.slice(14,16)

  const date = new Date(year, month, day)

  const index = daySlots.findIndex((e) => {
    return e.day.getTime() == date.getTime()
  })
  
  if( timeslots[i].booked === false) {
    if( index !== -1 ) {
      daySlots[index].slots.push({
      start : hour1+min1,
      end : hour2+min2,
      timeslot : timeslots[i]._id
      })
    } else {
      daySlots.push({
        day: date,
        slots : [{
          start : hour1+ min1, 
          end : hour2+min2,
          timeslot : timeslots[i]._id
        }]
      })
    }
  }
}

console.log("daySlots", daySlots)

daySlots.sort((a,b) => {
  return (a.day - b.day)
})

const format = (number) => {
  if(number < 10) {
    console.log(number)
    return `0${number}`
  }
}

const pickerClick = async (timeslot) => {

  const response = await fetch(`/user/ad/${props.adID}/visit`, {
    method : "put",
    headers: {
      'Content-Type': 'application/json',
      token : 'njn2MLOiFPpUhfrAFUh1XeJj5ZBNgFHk' // A METTRE A JOUT AVEC LE TOKEN DU STORE REDUX
    },
    body: JSON.stringify({
      timeslot : timeslot
    })
  })
  let jsonResponse = await response.json()
  console.log("Reponse", jsonResponse)
}

  const mapSlots = daySlots.map((e, i) => {

    return <Col span={6} key={i}>

      <div className="picker-day">
      {`${format(e.day.getDate())}/${format(e.day.getMonth()+1)}`}
      </div>

        {
          e.slots.map((f, i) => (
            <div key={i} className="picker-slot" onClick={() => pickerClick(f.timeslot)}>
              {`${f.start.slice(0,2)}h${f.start.slice(2,4)}`}
            </div>
          ))
        }
      
      </Col>
    })

  return (

    <div className="timeslot-picker">
    <h4 style={{textAlign : "center"}}>Sélectionnez un créneau de visite</h4>
      <Row className="slot-row">
        {mapSlots}
      </Row>
  </div>

);
}