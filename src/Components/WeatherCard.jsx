import React, { useEffect, useState } from 'react'

const WeatherCard = () => 
{
   const [weatherData, setWeatherData] = useState({})
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState("")
   const [city, setCity] = useState("Delhi")
   const [inputCity, setInputCity] = useState("")
   const [time, setTime] = useState(new Date()) 
   const [forcastData, setForecastData] = useState([]) 

    const fetchData = async () => {

        try {
                setLoading(true)

                const information = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=38ff86cbe9661a51e876d452e4ded41f&units=metric`)
                const weatherInformation = await information.json()

                if(weatherInformation.cod !== 200)
                {
                    setError(weatherInformation.message)
                    setWeatherData({})
                    return 
                }

                setWeatherData(weatherInformation) 
                setError("")
                setInputCity("")
        }
        catch {
                    setError("There Is An Error In API")
        }
        finally {
            setLoading(false)
        }

} 


const fetchforcastData = async () => {
    try 
    {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=38ff86cbe9661a51e876d452e4ded41f&units=metric`
        ) 

        const data = await response.json()

        if(data.cod != "200")
        {
            setForecastData([])
            return 
        }

        // FILTER ONE FORECAST PER DAY
        const dailyData = data.list.filter((item) =>
            item.dt_txt.includes("12:00:00")
        )

        setForecastData(dailyData)
    }
    catch 
    {
        console.log("Error In The API")
    }
}


useEffect( () => {
    fetchData()
    fetchforcastData()
}, [city] )


const handleSubmit = (e) => {
       e.preventDefault()

       if(inputCity.trim() === "")
       {
            return 
       }
       setCity(inputCity)

}

const isNight = weatherData?.weather?.[0]?.icon?.includes('n') 

const useMineLocation = () => {

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude 

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=38ff86cbe9661a51e876d452e4ded41f&units=metric` )
            const data = await response.json()

            setWeatherData(data) 

            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=38ff86cbe9661a51e876d452e4ded41f&units=metric`
            ) 

            const dailyData = await forecastResponse.json()

            const dailyForcastData = dailyData.list.filter((item) => {
                return item.dt_txt.includes("12:00:00")
            }) 

            setForecastData(dailyForcastData) 
        }
    )
}


    const refreshWeather = async () => {

    setInputCity("")
    setCity("Delhi")

    try {
        setLoading(true)

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=38ff86cbe9661a51e876d452e4ded41f&units=metric`)

        const data = await response.json()

        setWeatherData(data)

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=38ff86cbe9661a51e876d452e4ded41f&units=metric`
        )

        const forecastData = await forecastResponse.json()

        const dailyData = forecastData.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        )

        setForecastData(dailyData)

    } catch {
        setError("Unable to refresh weather")
    } finally {
        setLoading(false)
    }
}

  return (
    <div className={` min-h-screen flex items-center justify-center px-4 transition-all duration-500 ${ 
        isNight ? 
        "bg-linear-to-br from-gray-900 to-black text-white" : 
        "bg-linear-to-br from-sky-400 to-blue-200 text-black" }`} >
            <div className='backdrop-blur-md bg-white/20 p-8 rounded-3xl shadow-2xl w-87.5 text-center'>
                
                 {/* SEARCH BAR */}
                <form 
                    onSubmit={handleSubmit} 
                    className='flex gap-2 mb-6' >
                    <input 
                        className='flex-1 p-3 rounded-xl outline-none text-black' 
                        value={inputCity} 
                        type='text' 
                        placeholder='Enter City'
                        onChange={(e) => setInputCity(e.target.value)} 
                        />
                    
                    <button 
                            className='bg-black text-white px-4 rounded-xl hover:scale-105 transition'  >Search
                    </button>
                </form> 

                {/* LOADING */}
                {
                    loading && 
                    <div className='flex justify-center items-center mb-5'>
                        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-white'></div>
                    </div>
                } 

                {/* Error */}
                {
                    error.length > 0 && 
                    <h1>
                        {error}
                    </h1>
                }

                {/* WEATHER DATA */}
                {
                    weatherData?.main && 
                    <div>

                        {/* CITY */}
                        <h1 className='text-4xl font-bold'>
                            {weatherData?.name}
                        </h1> 

                        {/* Weather Icon */}
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData?.weather?.[0]?.icon}@2x.png`} 
                            alt='weather-icon'
                            className='mx-auto'
                        />

                        {/* Tempreture */}
                        <h1 className='text-6xl font-bold'>
                            {Math.round(weatherData?.main?.temp)}°C
                        </h1>

                        {/* Description */}
                        <h1 className='capitalize text-xl mt-2'>
                            {weatherData?.weather?.[0]?.description}
                        </h1>


                        {/* Extra Info */}
                        <div className='grid grid-cols-2 gap-4 mt-6'>
                            <div className='bg-white/20 p-4 rounded-2xl'>
                                <p className='text-sm'>Humidity</p>
                                <h2 className='text-2xl font-bold'>{weatherData?.main?.humidity}</h2>
                            </div>

                            <div className='bg-white/20 p-4 rounded-2xl' >
                                  <p className='text-sm' >Wind Speed</p>
                                <h2  className='text-2xl font-bold'>{weatherData?.wind?.speed}</h2>
                            </div>       
                        </div> 


                            {/*Date And Time  */}
                            <div className='mt-6 space-y-1'>
                                <h1 className='text-lg font-semibold'>{time.toLocaleDateString()}</h1>
                                <h1 className='text-lg'>{time.toLocaleTimeString()}</h1>
                            </div>

                            {/* BUTTONS */}
                            <div className='flex gap-3 mt-6 justify-center'>
                                <button className='bg-blue-500 px-4 py-2 rounded-xl hover:scale-105 transition' onClick={refreshWeather}>Refresh</button>
                                <button className='bg-green-500 px-4 py-2 rounded-xl hover:scale-105 transition' onClick={useMineLocation}>Use Mine Location</button>
                            </div>   
                    </div>   
                }  
                {/* 5 day Forcast */}
                
                <div className='mt-8'>
                    <h1 className='text-2xl font-bold mb-4'>5 Day Weather Forcast</h1>
                    <div className='flex gap-3 overflow-x-auto pb-2'>
                        {
                            forcastData.map((item,index) => {
                                return (
                                    <div key={index} className='bg-white/20 min-w-[25] p-4 rounded-2xl text-center' >
                                        <h2 className='font-semibold'>
                                            {
                                                new Date(item.dt_txt).toLocaleDateString(
                                                    'en-US',
                                                    { weekday : 'short' }
                                                )
                                            }
                                        </h2>
                                        <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} className='mx-auto' />
                                        <h1 className='text-xl font-bold'>{Math.round(item.main.temp)}°C</h1>
                                        <p className='text-xl capitalize'>{item.weather[0].description}</p>
                                    </div>    
                                )
                            })
                        }
                    </div> 
                </div>      
            </div>
    </div>
  )
}

export default WeatherCard
