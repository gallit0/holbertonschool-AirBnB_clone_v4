#!/usr/bin/node
const h = document.getElementById('amenities_selected')
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

const fetchRes = fetch("http://127.0.0.1:5001/api/v1/status/") //127.0.0.1 because of ubuntu-windows compatibility
fetchRes.then(res => res.json().then(d => {
  let places = document.getElementsByClassName('places')[0]
  if (d.status != 'OK') {
    return
  }
  document.getElementById('api_status').classList.add('available')

  const fetchPlace = fetch("http://127.0.0.1:5001/api/v1/places_search/", {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
  },
  )
  fetchPlace.then(res => res.json().then(d => {
    console.log({places});
    let placeTemp = places.children[0].cloneNode(true);
    places.removeChild(places.children[0]);
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
      
      const fetchUser = fetch("http://127.0.0.1:5001/api/v1/users/" + place.user_id)
      fetchUser.then(res => res.json().then(user => {
        newPlace.children[2].innerHTML += ' ' +user.first_name + ' ' +  user.last_name
      }));
      console.log({newPlace});
      places.appendChild(newPlace);
      newPlace.children[3].innerText = place.description
    });
  }))
}
))
