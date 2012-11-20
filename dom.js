(function () {

  var
    obj = [
      {pName: 'Andy Willis', pCode: '1234-56778', mVal: 10045},
      {pName: 'Barney Stintson', pCode: '00-8764-10', mVal: -1078},
      {pName: 'James Corvel', pCode: '34-4567-8700-0', mVal: 32},
      {pName: 'Bernard Bresslaw', pCode: '1234-56778', mVal: 10045},
      {pName: 'Tarzan', pCode: '00-8764-10', mVal: 1078},
      {pName: 'Mr. Machine', pCode: '34-4567-8700-0', mVal: -132}
      ],
    el = function (id) { return document.getElementById(id); };

  // Click link, remove any existing data,
  // then - and only then - display data (uses a callback)
  el('link').addEventListener('click', function () {
    clearData(function () {
      displayData();
    });
  }, false);

  // Clears data from the main area
  function clearData(callback) {
    var table = el('table');
    if (table) {
      table.parentNode.removeChild(table);
    }
    callback();
  }

  // Build table by creating a docfrag first, populating it with table data
  // then pinning it to the DOM tree
  function displayData() {
    var
      frag = document.createDocumentFragment('frag'),
      table = document.createElement('table'),
      html = '', color, i, len;

    // Loop over data adding to the html var
    // changing the color appropriate to the market value
    // Decided to run with innerHTML rather than full-comp DOM building.
    html += '<th>Portfolio information</th><th>Market value</th>'
    for (i = 0, len = obj.length; i < len; i++) {
      color = (obj[i].mVal < 0) ? 'on' : 'off';
      html += '<tr><td class="first"><span>' + obj[i].pName + '</span><span class="bold">' + obj[i].pCode + '</span></td>';
      html += '<td class="' + color + '">' + obj[i].mVal + '</td></tr>';
      table.innerHTML = html;
    }

    // Set the table id to 'table'
    // Add the table to the fragment and add the fragment to the DOM
    table.setAttribute('id', 'table');
    frag.appendChild(table);
    el('main').appendChild(frag);
  }

})()