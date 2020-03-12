import React, { useState, useEffect } from "react";
import { Col, Row, Popconfirm, message } from "antd";
import { Redirect, Link } from "react-router-dom";

export default function TimeslotPicker(props) {

const [slotsDisplay, setSlotsDisplay] = useState([]);

var weekday = new Array(7);
weekday[0] = "dimanche";
weekday[1] = "lundi";
weekday[2] = "mardi";
weekday[3] = "mercredi";
weekday[4] = "jeudi";
weekday[5] = "vendredi";
weekday[6] = "samedi";

var month = new Array();
month[0] = "janv";
month[1] = "fev";
month[2] = "mar";
month[3] = "avr";
month[4] = "mai";
month[5] = "juin";
month[6] = "juil";
month[7] = "août";
month[8] = "sept";
month[9] = "oct";
month[10] = "nov";
month[11] = "dec";


    useEffect(() => {

        const getTimeslots = async () => {

            let response = await fetch(`/user/ad/${props.adId}/timeslots`)
            
            let cleanresponse = await response.json()

            let timeslots = cleanresponse.data.timeslots

            timeslots = timeslots.filter((e)=> {

                const year = e.start.slice(0,4)
                let month = Number(e.start.slice(5,7))-1
                const day = e.start.slice(8,10)
                const hour1 = e.start.slice(11,13)
                const min1 = e.start.slice(14,16)

                const fullDate = new Date(year, month, day, hour1, min1)

                const now = new Date()

                now.setHours(now.getHours() + 1)

                return fullDate.getTime() > now.getTime()

            })

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
            const response = await fetch(`/user/ad/${props.adId}/visit`, {
                method : "put",
                headers: {
                'Content-Type': 'application/json',
                'token' : props.token
                },
                body: JSON.stringify({
                timeslot : timeslot
                })
            })
            let body = await response.json()
            if (body.message === 'OK') {
                props.goToVisitParent()
            }
            else {
                message.error('Il y a eu une erreur, veuillez rééssayer');
            }
        }

        const mapSlots = daySlots.map((e, i) => {

            return <Col span={6} key={i}>

            <div className="picker-date">
                <div style={{fontWeight : 700, marginBottom : "-5px"}}>
                {weekday[e.day.getDay()]}
                </div>
                <div>
                {`${e.day.getDay()} ${month[e.day.getMonth()+1]}`}
                </div>
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
    { slotsDisplay.length > 0 ? 
    <div>
        <h4 style={{textAlign : "center"}}>Sélectionnez un créneau de visite</h4>
            <Row className="slot-row">
                {slotsDisplay} 
            </Row>
        </div>
    :  
    <div>
    <p>Aucun créneau de visite disponible pour le moment</p>
    </div>
    }
  </div>
   

);

}