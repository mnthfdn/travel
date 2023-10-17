const fromCity=window.location.search?.split("fromCity=")[1]?.split("&")[0]
const toCity=window.location.search?.split("toCity=")[1]?.split("&")[0]
const date=window.location.search?.split("date=")[1]

async function getSearchResults() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic JEcYcEMyantZV095WVc3G2JtVjNZbWx1");
  
    var raw = JSON.stringify({
        "device-session": {
            "session-id": sessionStorage.getItem("sessionId"),
            "device-id": sessionStorage.getItem("deviceId")
        },
        "date": new Date(),
        "language": "tr-TR",
        "data": {
          "origin-id": fromCity,
          "destination-id": toCity,
          "departure-date": date
        }
      });
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      "cors": {
        "headers": ["Accept", "Authorization", "Content-Type", "If-None-Match", "Accept-language"]
      },
      body: raw,
      redirect: 'follow'
    };
  
    try {
        let response = await fetch("https://v2-api.obilet.com/api/journey/getbusjourneys", requestOptions);
        let data = await response.json(); // veriyi JSON olarak al
        return data; // veriyi döndür    
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
    
}
  
async function initializeListPage() {
    const data = await getSearchResults(); 
    populateJourneyList(data.data);
    setHeaderTitle(data.data)
}  

window.onload = initializeListPage;

// Bu fonksiyon, her bir 'journey' için bir HTML string'i oluşturur ve bunları konteynıra ekler.
function populateJourneyList(data) {
    const journeyListContainer = document.getElementById('journeyListContainer');
    
    journeyListContainer.innerHTML=""
    data.length ===0 ? journeyListContainer.innerHTML='<div  class="margin30 alert--text">Listelenecek seyahat bulunmamaktadır.</div>' :
    data.forEach(item => {
        const journey=item.journey
        const departure=journey?.departure.split("T")[1].split(":")
        const arrival=journey?.arrival.split("T")[1].split(":")
        const journeyItem = `
            <li class="journey">
                <div class="flex content-between">
                    <div class="journey__date kalkis flex flex-column">
                        <div class="text">KALKIŞ:</div>
                        <div>${departure[0]}:${departure[1]}</div>
                    </div> 
                    <span class="material-symbols-outlined">arrow_right_alt</span>
                    <div class="journey__date varis flex flex-column">
                        <div class="text">KALKIŞ:</div>
                        <div>${arrival[0]}:${arrival[1]}</div>
                    </div> 
                    <div class="price-container"><div class="journey__price bg-red text-white">${journey['internet-price']},00 TL</div> </div>
                </div>
                <div class="journey__title">${journey.origin} - ${journey.destination}</div> 
            </li>
        `;

        journeyListContainer.innerHTML += journeyItem;
    });
}
function setHeaderTitle(data) {
    const journeyListContainer = document.getElementById('header');

    const time=formatDate(date,isDay=false)
    const fromCity=sessionStorage.getItem("fromCity") 
    const toCity=sessionStorage.getItem("toCity") 

    const journeyItem = `
            <a href="/index.html"  rel="noopener noreferrer"><span class="material-symbols-outlined">arrow_left_alt</span></a>
            <span class="header--place">${fromCity} - ${toCity}</span>
            <span class="header--date">${time}</span>
    `;

    journeyListContainer.innerHTML += journeyItem;

}
