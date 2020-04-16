export default function(agentInfo = {lastname: null, firstname: null, email: null, id: null}, action){
    
    if (action.type === 'agent_saveInfo') {
        return action.agentInfo

    } else if (action.type === 'agent_clearInfo') {
        return {
            lastname: null,
            firstname: null,
            email: null,
            id: null
        }

    } else {
        return agentInfo
    }
}