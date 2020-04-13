import React from 'react'

function StepDots(props) {

    let spans = []
    for (let i=0 ; i<props.currentStep ; i++) {
        spans.push(
            <span
                key={i}
                className="step-dots"
                style={{
                    backgroundColor: props.filledDotsBackgroundColor,
                    border: `2px solid ${props.filledDotsBorderColor}`
                }}
            ></span>
        )
    }
    for (let i=0 ; i<props.totalSteps-props.currentStep ; i++) {
        spans.push(
            <span
                key={props.totalSteps+i}
                className="step-dots"
                style={{
                    backgroundColor: props.emptyBackgroundColor,
                    border: `2px solid ${props.emptyDotsBorderColor}`
                }}
            ></span>
        )
    }

    return (
        <div className="stepbar">
            <h2 className="stepbar-title"> {props.title} </h2>
            <div>{spans}</div>
        </div>
    )
}

export default StepDots