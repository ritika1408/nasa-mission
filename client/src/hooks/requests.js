const API_URL = "v1"
// Load planets and return as JSON.
async function httpGetPlanets() {
  const data = await fetch(`${API_URL}/planet`)
  return await data.json()  
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`)
  const fetched = await response.json()
  return fetched.sort((a,b) => a.flightNumber - b.flightNumber)
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try{
    return await fetch(`${API_URL}/launches`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(launch)
    }) 
  }
  catch{
    return {
      ok :false
    }
  }
}

async function httpAbortLaunch(id) {
  try{
    return await fetch(`${API_URL}/launches/${id}`,{
      method:'delete'
    })
  }
  catch{
    return {
      ok:false
    }
  }
}
 
export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};