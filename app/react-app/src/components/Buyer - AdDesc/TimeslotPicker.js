import React, { useState, useEffect } from "react";
import { Col, Row, Popconfirm } from "antd";
import { Redirect, Link } from "react-router-dom";

export default function TimeslotPicker(props) {

const [slotsDisplay, setSlotsDisplay] = useState([]);

    useEffect(() => {

        const getTimeslots = async () => {

            let response = await fetch(`/user/ad/${props.adID}/timeslots`)
            
            let cleanresponse = await response.json()

            let timeslots = cleanresponse.data.timeslots

            timeslots = timeslots.filter((e)=> {

                const year = e.start.slice(0,4)
                let month = Number(e.start.slice(5,7))-1
                const day = e.start.slice(8,10)
                const hour1 = e.start.slice(11,13)
                const min1 = e.start.slice(14,16)

                const fullDate = new Date(year, month, hour1, min1)

                const now = new Date()

                now.setHours(now.getHours() + 1)

                console.log("now+1h:", now)
                console.log("millisecondes :", now.getTime())
                
                console.log("timeslot:", fullDate)
                console.log("millisecondes:", fullDate.getTime())
                

                console.log(fullDate.getTime() > now.getTime())

                return fullDate.getTime() > now.getTime()

            })

            console.log('filtered', timeslots)

        const daySlots = []

        for(let i=0 ; i < timeslots.length ; i++) {

        const year = timeslots[i].start.slice(0,4)
        let month = Number(timeslots[i].start.slice(5,7))-1
        const day = timeslots[i].start.slice(8,10)
        const hour1 = timeslots[i].start.slice(11,13)
        const min1 = timeslots[i].start.slice(14,16)

        const date = new Date(year, month, day)

        const index = daySlots.findIndex((e) => {
            return e.day.getTime() == date.getTime()
        })
        
        if( timeslots[i].booked === false || (timeslots[i].booked === true && timeslots[i].private === false) ) {
            if( index !== -1 ) {
            daySlots[index].slots.push({
            start : hour1+min1,
            timeslot : timeslots[i]._id
            })
            } else {
            daySlots.push({
                day: date,
                slots : [{
                start : hour1+ min1, 
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
        } else {
            return number
        }
        }

        const pickerClick = async (timeslot) => {
            console.log("token:",props.token)
        const response = await fetch(`/user/ad/${props.adID}/visit`, {
            method : "put",
            headers: {
            'Content-Type': 'application/json',
            'token' : props.token
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
                    <Popconfirm
                    title="Confirmer le rendez-vous ?"
                    onConfirm={() => pickerClick(f.timeslot)}
                    okText="Oui"
                    okButtonProps={{type:'primary', className:'pop-confirm-buttons'}}
                    cancelText="Non"
                    cancelButtonProps={{type:'secondary', className:'pop-confirm-buttons'}}
                    placement="bottomLeft"
                  >
                    <div key={i} className="picker-slot">
                    {`${f.start.slice(0,2)}h${f.start.slice(2,4)}`}
                    </div>
                    </Popconfirm>
                ))
                }
            
            </Col>
            })

            setSlotsDisplay(mapSlots);
        };

        getTimeslots();

}, [])

  return (

    <div className="timeslot-picker">
    <h4 style={{textAlign : "center"}}>Sélectionnez un créneau de visite</h4>
      <Row className="slot-row">
        {slotsDisplay}
      </Row>
  </div>

);

}



    