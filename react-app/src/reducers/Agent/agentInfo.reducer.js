export default function(agentInfo = {lastname: null, firstname: null, email: null, id: null}, action){
    
    if (action.type === 'agent_saveInfo') {
        return action.agentInfo

    } else {
        return agentInfo
    }
}