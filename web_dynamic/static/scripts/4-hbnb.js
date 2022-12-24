#!/usr/bin/node
const h = document.getElementById('amenities_selected')
const places = document.getElementsByClassName('places')[0]
const placeTemp = places.children[0].cloneNode(true);

var checked = {}
var inputs = Array.prototype.slice.call(document.getElementsByTagName("input"))
inputs.forEach(input => {
  input.addEventListener("click", function (check) {
    const element = check['srcElement']
    const data = element['dataset']
    if (checked[data['id']]) delete checked[data['id']]
    else checked[data['id']] = data['name']
    h.innerText = Object.values(checked).join(', ')
  });
})
show()
function show() {

  const fetchRes = fetch("http://0.0.0.0:5001/api/v1/status/")
  fetchRes.then(res => res.json().then(d => {
    if (d.status != 'OK') {
      return
    }
    document.getElementById('api_status').classList.add('available')
  
    const fetchPlace = fetch("http://0.0.0.0:5001/api/v1/places_search/", {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amenities: checked
      })
    },
    )
    fetchPlace.then(res => res.json().then(d => {
      while (places.firstChild) {
        places.removeChild(places.lastChild);
      }
      d.forEach(place => {
        const newPlace = placeTemp.cloneNode(true);
        newPlace.style.display = "inline-block";
        newPlace.children[0].children[0].innerText = place.name;
        newPlace.children[0].children[1].innerText = '$'+place.price_by_night;
        newPlace.children[1].children[0].innerText = place.max_guest + ' ';
        newPlace.children[1].children[0].innerText += place.max_guest > 1 ? 'Guests' : 'Guest';
        newPlace.children[1].children[1].innerText = place.number_rooms + ' '
        newPlace.children[1].children[1].innerText += place.max_guest > 1 ? 'Rooms' : 'Room';
        newPlace.children[1].children[2].innerText = place.number_bathrooms + ' '
        newPlace.children[1].children[2].innerText += place.max_bathrooms > 1 ? 'Bathrooms' : 'Bathroom';
        
        const fetchUser = fetch("http://0.0.0.0:5001/api/v1/users/" + place.user_id)
        fetchUser.then(res => res.json().then(user => {
          newPlace.children[2].innerHTML = '<b>Owner:</b> ' +user.first_name + ' ' +  user.last_name
        }));
        places.appendChild(newPlace);
        newPlace.children[3].innerText = place.description
      });
    }))
  }
  ))
}
const search_button = document.getElementById('search_button')
search_button.addEventListener('click', function() { 
  show()
})
