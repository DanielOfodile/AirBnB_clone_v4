let url = 'http://0.0.0.0:5001/api/v1/status/';
let placesSearch = 'http://0.0.0.0:5001/api/v1/places_search/';

function filterData (data) {
  $.ajax({
    url: placesSearch,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function (data) {
      data.sort((first, second) => {
        return first.name < second.name ? -1 : 1;
      });
      for (let place of data) {
        $('.places').append(`
          <article>
            <div class='title'>
              <h2>` + place.name + `</h2>
              <div class='price_by_night'>
                ` + place.price_by_night +
            `   </div>
            </div>
            <div class='information'>
              <div class='max_guest'>
                <i class='fa fa-users fa-3x' aria-hidden='true'></i>
                <br />
                ` + place.max_guest + `Guests
              </div>
              <div class='number_rooms'>
                <i class='fa fa-bed fa-3x' aria-hidden='true'></i>
                <br />
                ` + place.number_rooms + `Bedrooms
              </div>
              <div class='number_bathrooms'>
                <i class='fa fa-bath fa-3x' aria-hidden='true'></i>
                <br />
                ` + place.number_bathrooms + `Bathroom
              </div>
            </div>
            <div class='description'>
              ` + place.description +
          ` </div>
          </article>
        `);
      }
    }
  });
}

$('document').ready(function () {
  const amenityChecked = {};
  const amenityCheckboxArray = Array.from($('div.amenities input:checkbox'));
  for (let i = 0; i < amenityCheckboxArray.length; i++) {
    amenityCheckboxArray[i].addEventListener('change', () => {
      if ($(amenityCheckboxArray[i]).is(':checked')) {
        amenityChecked[$(amenityCheckboxArray[i]).attr('data-id')] = $(amenityCheckboxArray[i]).attr('data-name');
      } else {
        delete amenityChecked[$(amenityCheckboxArray[i]).attr('data-id')];
      }
      // update h4 amenities list (ordered)
      let list = [];
      for (let id in amenityChecked) {
        list.push(amenityChecked[id]);
      }
      list.sort();
      if (list.length !== 0) {
        $('div.amenities h4').html(list.join(', '));
      } else {
        $('div.amenities h4').html('&nbsp;');
      }
    });
  }
  $.get(url, function (data, statusText, xhr) {
    if (statusText === 'success') {
      $('DIV#api_status').toggleClass('available');
    } else {
      $('DIV#api_status').toggleClass('available');
    }
  });
  filterData({});
});
