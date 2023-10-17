//Şehirleri getirir
async function getBusLocations(searchTerm = null) {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Basic JEcYcEMyantZV095WVc3G2JtVjNZbWx1");

  var raw = JSON.stringify({
    "data": searchTerm,
    "device-session": {
      "session-id": sessionStorage.getItem("sessionId"),
      "device-id": sessionStorage.getItem("deviceId")
    },
    "date": new Date(), 
    "language": "tr-TR"
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
    let response = await fetch("https://v2-api.obilet.com/api/location/getbuslocations", requestOptions);
    let data = await response.json(); 
    return data; 
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
  }

}
//Şehir bilgisini kullanarak "nereden" ve "nereye" select'ini doldurur
function populateFromCitySelectBoxes(data) {
  const fromCitySelect = document.querySelectorAll(".fromCityList > ul");
  fromCitySelect.forEach((ul)=> {
    ul.innerHTML = '';
  });
  data?.data?.forEach(city => {
    const li = document.createElement("li");
    li.className = "no-style-li";
    li.textContent = city.name; // Şehir adı
    li.setAttribute('data-cityid', city.id); // Şehir ID'sini sakla
    fromCitySelect[0].appendChild(li); // 'from' select kutusu için
  });
}
function populateToCitySelectBoxes(data) {
  const toCitySelect = document.querySelectorAll(".toCityList > ul");
  toCitySelect.forEach((ul)=> {
    ul.innerHTML = '';
  });
  data?.data?.forEach(city => {
    const li = document.createElement("li");
    li.className = "no-style-li";
    li.textContent = city.name; // Şehir adı
    li.setAttribute('data-cityid', city.id); // Şehir ID'sini sakla
    toCitySelect[0].appendChild(li); // 'from' select kutusu için
  });
}
//datayı kullanan tüm durumlar
async function initializePage() {
  // getBusLocations fonksiyonunun tamamlanmasını bekleyip apiden veriyi çek
  const data = await getBusLocations(); 
  var element = document.querySelector('button.btn-primary');
  element.innerHTML="Bileti Bul"
  element.removeAttribute('disabled')
 
  // Gerekli elementlerin seçilmesi
  const fromCityInput = document.getElementById('fromCity--search');
  const ulFromCity = document.querySelector('.fromCity--ul');
  const toCityInput = document.getElementById('toCity--search');
  const ulToCity = document.querySelector('.toCity--ul');

  //input'a tıklandığında li sıralanması
  fromCityInput.addEventListener("click",function (){
    if(!this._populated){
        populateFromCitySelectBoxes(data)
      this._populated=true
    }
    ulFromCity.classList.add('show');

  });
  toCityInput.addEventListener("click",function (){
    if(!this._populated){
      populateToCitySelectBoxes(data)
      this._populated=true
    }    
    ulToCity.classList.add('show');

  });

  // li öğesine tıklandığında input'lara değeri aktarıp ve ul'u gizleyelim
  ulFromCity.addEventListener('click', function(event) {
    if (event.target.matches('.no-style-li')) {
        fromCityInput.setAttribute('data-selectedcityid', event.target.getAttribute('data-cityid')); // Seçilen ID'yi input'a kaydedin

        fromCityInput.value = event.target.innerText;
        ulFromCity.classList.remove('show');
    }
  });
  ulToCity.addEventListener('click', function(event) {
    if (event.target.matches('.no-style-li')) {
        toCityInput.setAttribute('data-selectedcityid', event.target.getAttribute('data-cityid')); // Seçilen ID'yi input'a kaydedin
        toCityInput.value = event.target.innerText;
        ulToCity.classList.remove('show');
    }
  });

  // Eğer ul dışında bir yere tıklanırsa ul'u gizleyelim
  document.addEventListener('mousedown', function(event) {
      if (!ulFromCity.contains(event.target) && event.target !== fromCityInput) {
          ulFromCity.classList.remove('show');
      }
      if (!ulToCity.contains(event.target) && event.target !== toCityInput) {
        ulToCity.classList.remove('show');
    }
  });
  
  //listenerler
  document.getElementById("fromCity--search").addEventListener("change", filterFromCities);
  document.getElementById("toCity--search").addEventListener("change", filterToCities);
  document.getElementById("date").addEventListener("change", dateChange);
  document.getElementById("swap").addEventListener("click", swap);

  async function filterFromCities(event) {
      const searchTerm = event.target.value;
      const data = await getBusLocations(searchTerm);
      populateFromCitySelectBoxes(data);
  }
  async function filterToCities(event) {
      const searchTerm = event.target.value;
      const data = await getBusLocations(searchTerm);
      populateToCitySelectBoxes(data);
  }
  function swap(){
    const toValue=toCityInput.value 
    const fromValue=fromCityInput.value 
    const toId=toCityInput.getAttribute("data-selectedcityid")
    const fromId=fromCityInput.getAttribute("data-selectedcityid")
    if(toId && fromId){
      toCityInput.setAttribute('data-selectedcityid', fromId); // To inputunu, from ile değiştirelim
      toCityInput.value = fromValue;
      fromCityInput.setAttribute('data-selectedcityid', toId); // from inputunu to ile değiştirelim
      fromCityInput.value = toValue;
    }
  }

  document.getElementById('journeySearchForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Formun normal gönderimini engelle
      const existingAlerts = document.querySelectorAll('.alert--text');
      existingAlerts.forEach(alert => alert.remove());
      //journey list sayfasında title bilgisi için kullanılacak(seyahat listin olmadığı, data boş geldiği durumlar için sessionstorage'dan alınacak)
      sessionStorage.setItem("fromCity",fromCityInput.value)
      sessionStorage.setItem("toCity",toCityInput.value)

      const fromCityID = fromCityInput.getAttribute('data-selectedcityid');
      const toCityID = toCityInput.getAttribute('data-selectedcityid');
      const date = document.getElementById('date').value; // Tarih değerini al

      if(fromCityID!== null && toCityID !==null && fromCityID === toCityID){//Şehirler null değil ve aynı şehir seçilmişse
        const div = document.createElement("div");
        div.textContent = "Lütfen farklı şehirler seçiniz!"; // Şehir adı
        div.className = "alert--text case-1";
        document.querySelectorAll(".ticket-search")[0].appendChild(div); // 'from' select kutusu için
      }else if(fromCityID=== null || toCityID ===null || date===""){
        const div = document.createElement("div");
        div.textContent = "Lütfen boş alanları doldurunuz!"; // Şehir adı
        div.className = "alert--text";
        document.querySelectorAll(".ticket-search")[0].appendChild(div); // 'from' select kutusu için
      }else{ 
       // Parametrelerle yeni bir URL oluştur
        const queryParams = new URLSearchParams({fromCity: fromCityID, toCity: toCityID, date: date});
        const newActionURL = `/journey.html?${queryParams.toString()}`;

        // URL'yi kullanarak formu gönder
        window.location.href = newActionURL;
       
      }

  });
  //"yyyy-MM-dd"
  function dateChange(event) {
    // const dateInput = event.target.value;
    // const formattedDate= formatDate(dateInput,isDay=true)
    // document.getElementById("formattedDateDisplay").innerText = formattedDate;
    var element = document.querySelector('.tiny-date-active');
    element!== null? element.classList.remove('tiny-date-active'):"";

  }
  const elements=document.getElementsByClassName("tiny-date")
  // Her bir öğe için
  for (var i = 0; i < elements.length; i++) {
    // 'click' listener'ı
    elements[i].addEventListener("click",tinyDate);
  }
  function tinyDate(event) {  
    var element = document.querySelector('.tiny-date-active');
    element!== null? element.classList.remove('tiny-date-active'):"";

    const dateInput = event.target.value;    
    let today = new Date();
    event.target.classList.add("tiny-date-active")

    if(dateInput==="today"){
      document.getElementById('date').value=formatDate2(today)

    }else{
      let tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById('date').value=formatDate2(tomorrow) 
    }
  }
}
window.onload = initializePage;


