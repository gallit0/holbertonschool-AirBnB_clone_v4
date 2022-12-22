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
