#!/usr/bin/node
const h = document.getElementById('amenities_selected')
var checked = {}
var inputs = Array.prototype.slice.call(document.getElementsByTagName("input"))
inputs.forEach(input => {
  input.addEventListener("click", function(check){
    const element = check['srcElement']
    const data = element['dataset']
    if (checked[data['id']]) delete checked[data['id']]
    else checked[data['id']] = data['name']
    h.innerText = Object.values(checked).join(', ')
  });
})
const fetchRes = fetch("http://127.0.0.1:5001/api/v1/status/") //127.0.0.1 because of ubuntu-windows compatibility
fetchRes.then(res => res.json().then(d => {
  if (d.status === 'OK') {
    document.getElementById('api_status').classList.add('available')
  }
}
))

