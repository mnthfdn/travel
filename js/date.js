
//Tarih formatlama
function formatDate(selectedDate,isDay) {
    var dateObject = new Date(selectedDate);

var day = dateObject.getDate(); // Gün
var year = dateObject.getFullYear(); // Yıl

// Ay isimleri dizisi.
var months = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

var month = months[dateObject.getMonth()]; // Ay

// Haftanın günleri.
var days = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba",
  "Perşembe", "Cuma", "Cumartesi"
];

var weekDay = days[dateObject.getDay()]; // Haftanın günü

// isDay, anasayfada gün bilgisi için true gelir. journey listing'de ise false
var formattedDate =isDay? day + ' ' + month + ' ' + year + ' ' + weekDay : day + ' ' + month + ' ' + year;

return formattedDate

}


function formatDate2(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-');
  }