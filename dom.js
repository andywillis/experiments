// Revisited the SP test.

var obj = [{pName: 'p1', pCode: 'abcd', mVal: 0}, {pName: 'p2', pCode: 'dcba', mVal: 11}, {pName: 'p1', pCode: 'abcd', mVal: -21}]
var el = function(id) { return document.getElementById(id) }

// Click link and display data
el('link').onclick = function() { displayData(); }

// Build table by creating a docfrag first, then pinning it to the tree.
function displayData() {
  // Create fragment and append a table element to it
  // html and color are used in the loop
  var frag = document.createDocumentFragment('frag')
    , table = document.createElement('table')
    , html, color
    ;

  // Loop over data adding to the html var
  // changing the color appropriate to the market value
  // Decided to run with innerHTML rather than full-comp DOM building.
  for (var i = 0, len = obj.length; i < len; i++) {
    color = obj[i].mVal < 0 ? 'on' : 'off'
    html += '<tr><td>' + obj[i].pName + '<br/>' + obj[i].pCode + '</td>'
    html += '<td class="' + color + '">' + obj[i].mVal + '</td></tr>'
    table.innerHTML = html
  }

  // Add the table to the fragment and add the fragment to the DOM
  frag.appendChild(table)
  el('main').appendChild(frag)
}