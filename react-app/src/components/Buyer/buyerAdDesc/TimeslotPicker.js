import React, { useState, useEffect } from 'react'
import { Col, Row, Popconfirm, message, Button } from 'antd'
import {useCookies} from 'react-cookie'

import Unauthorized401 from '../../../screens/Buyer/Unauthorized401'

export default function TimeslotPicker(props) {

    const [slotsDisplay, setSlotsDisplay] = useState([])
    const [cookies, setCookie] = useCookies(['name']) // initilizing state cookies

    const [redirectTo401, setRedirectTo401] = useState(false)

    /* Renew Access Token */
    const renewAccessToken = (token) => {
        if (token !== cookies.uT) {
            setCookie('uT', token, {path:'/'})
        }
    }

    let weekday = new Array(7)
    weekday[0] = "dim"
    weekday[1] = "lun"
    weekday[2] = "mar"
    weekday[3] = "mer"
    weekday[4] = "jeu"
    weekday[5] = "ven"
    weekday[6] = "sam"

    let month = new Array()
    month[0] = "janv"
    month[1] = "fev"
    month[2] = "mar"
    month[3] = "avr"
    month[4] = "mai"
    month[5] = "juin"
    month[6] = "juil"
    month[7] = "août"
    month[8] = "sept"
    month[9] = "oct"
    month[10] = "nov"
    month[11] = "dec"


    useEffect(() => {

        const getTimeslots = async () => {

            let response = await fetch(`/user/ad/${props.adId}/timeslots`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${cookies.uT}`
                }
            })
        
            let body = await response.json()
            // No token refresh, because we already called the sidebar if user is loggedin

            let timeslots = body.data.timeslots

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
                        timeslotId : timeslots[i]._id
                        })
                    } else {
                    daySlots.push({
                        day: date,
                        slots : [{
                            start : hour1+ min1, 
                            timeslotId : timeslots[i]._id
                            }]
                        })
                    }
                }
            }


            daySlots.sort((a,b) => {
                return (a.day - b.day)
            })

            const pickerClick = async (timeslotId) => {
                const postVisit = await fetch(`/user/ad/${props.adId}/timeslots/${timeslotId}`, {
                    method : "put",
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${cookies.uT}`
                    }
                })

                if (postVisit.status === 500) {
                    message.warning('Nous rencontrons des difficultés pour planifier votre visite, veuillez réessayer.', 4)
                
                } else if (postVisit.status === 401) {
                    setRedirectTo401(true)
              
                } else if (postVisit.status === 200) {
                    const body = await postVisit.json()
                    renewAccessToken(body.accessToken)
                    message.success('Votre visite a bien été enregistrée', 2)
                    props.goToVisitParent()
                }
                    
            }

            const mapSlots = daySlots.map((e, i) => {

                return <Col span={6} key={i}>

                    <div className="picker-date">
                        <div style={{fontWeight : 700, marginBottom : "-5px"}}>
                            {weekday[e.day.getDay()]}
                        </div>
                        <div>
                            {`${e.day.getDate()} ${month[e.day.getMonth()]}`}
                        </div>
                    </div>

                    {e.slots.map((f, i) => (
                        <Popconfirm
                            title="Confirmer le créneau de visite ?"
                            onConfirm={() => pickerClick(f.timeslotId)}
                            okText="Oui"
                            okButtonProps={{type:'primary', className:'pop-confirm-buttons'}}
                            cancelText="Non"
                            cancelButtonProps={{type:'secondary', className:'pop-confirm-buttons'}}
                            placement="bottomLeft"
                        >
                            <div key={i} className="picker-slot" >
                                {`${f.start.slice(0,2)}h${f.start.slice(2,4)}`}
                            </div>
                        </Popconfirm>
                    ))}
                </Col>
            })
            setSlotsDisplay(mapSlots)
        }
        getTimeslots()
    }, [])

  /*----------------------------------------------- RENDER COMPONENT ---------------------------------------------------*/

  if (redirectTo401) {
    return <Unauthorized401 />
  } else {

        return (

            <div className="sidebar-calendar">
                { slotsDisplay.length > 0 ?
                    <div>
                    <div className="sidebar-title">
                        <h4>Sélectionnez un créneau de visite</h4>
                    </div>
                            <Row className="slot-row">
                                {slotsDisplay} 
                            </Row>
                    </div>
                :  
                    <div className="sidebar-calendar-content">
                        <p>Aucun créneau de visite</p>
                        <Button type="primary">Contacter mon agent</Button>
                    </div>
                }
            </div>
        )
    }
}