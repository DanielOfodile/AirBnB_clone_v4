let status_url = 'http://0.0.0.0:5001/api/v1/status/';
let placesSearch = 'http://0.0.0.0:5001/api/v1/places_search/';
let li = '';

(reviews) => {
  for (let review of reviews) {
    // get user name
    $.get('http://0.0.0.0:5001/api/v1/users/' + review.user_id, (user) => {
      li = li + `
      <li>
        <h3>From ` + user.first_name + ` ` + review.created_at + `</h3>
        <p>` + review.text + `</p>
      </li>
      `;
    });
  }
  return li;
}

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
        $.get('http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews', (reviews) => {
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
                  <div class="reviews_list">
                    <div class="review_title">
                      <h2>` + reviews.length + ` Reviews</h2>
                      <h4 class="review_toggle" id="` + place.id + `">Show</h4>
                    </div>
                    <div class="reviews_pad">
                      <ul>
                      </ul>
                    </div>
                  </div>
                </article>
            `);
          });
        }
      }
  });
}

$('document').ready(function () {
  // grab amenities
  const amenityChecked = {};
  const stateChecked = {};
  const cityChecked = {};
  const amenityCheckboxArray = Array.from($('div.amenities input:checkbox'));
  const stateCheckboxArray = Array.from($('input.state:checkbox'));
  const cityCheckboxArray = Array.from($('input.city:checkbox'));
  let stateList = [];
  let cityList = [];
  for (let i = 0; i < amenityCheckboxArray.length; i++) {
    amenityCheckboxArray[i].addEventListener('change', () => {
      const amenityList = [];
      if ($(amenityCheckboxArray[i]).is(':checked')) {
        amenityChecked[$(amenityCheckboxArray[i]).attr('data-id')] = $(amenityCheckboxArray[i]).attr('data-name');
      } else {
        delete amenityChecked[$(amenityCheckboxArray[i]).attr('data-id')];
      }
      // update h4 amenities list (ordered)
      for (let id in amenityChecked) {
        amenityList.push(amenityChecked[id]);
      }
      amenityList.sort();
      if (amenityList.length !== 0) {
        $('div.amenities h4').html(amenityList.join(', '));
      } else {
        $('div.amenities h4').html('&nbsp;');
      }
    });
  }
  for (let i = 0; i < stateCheckboxArray.length; i++) {
    stateCheckboxArray[i].addEventListener('change', () => {
      if ($(stateCheckboxArray[i]).is(':checked')) {
        stateChecked[$(stateCheckboxArray[i]).attr('data-id')] = $(stateCheckboxArray[i]).attr('data-name');
      } else {
        delete stateChecked[$(stateCheckboxArray[i]).attr('data-id')];
      }
      stateList = [];
      for (let id in stateChecked) {
        stateList.push(stateChecked[id]);
      }
      stateList.sort();
      let list = stateList.concat(cityList);
      if (list.length !== 0) {
        $('div.locations h4').html(list.join(', '));
      } else {
        $('div.locations h4').html('&nbsp;');
      }
    });
  }
  for (let i = 0; i < cityCheckboxArray.length; i++) {
    cityCheckboxArray[i].addEventListener('change', () => {
      if ($(cityCheckboxArray[i]).is(':checked')) {
        cityChecked[$(cityCheckboxArray[i]).attr('data-id')] = $(cityCheckboxArray[i]).attr('data-name');
      } else {
        delete cityChecked[$(cityCheckboxArray[i]).attr('data-id')];
      }
      cityList = [];
      for (let id in cityChecked) {
        cityList.push(cityChecked[id]);
      }
      cityList.sort();
      let list = stateList.concat(cityList);
      if (list.length !== 0) {
        $('div.locations h4').html(list.join(', '));
      } else {
        $('div.locations h4').html('&nbsp;');
      }
    });
  }
  $.get(status_url, function (data, statusText, xhr) {
    if (statusText === 'success') {
      $('DIV#api_status').toggleClass('available');
    } else {
      $('DIV#api_status').toggleClass('available');
    }
  });
  filterData({});
  $('button').click(() => {
    let amenityList = [];
    let stateList = [];
    let cityList = [];
    $('.places').empty();
    $('.places').append('<h1>Places</h1>');
    for (let i in amenityChecked) {
      amenityList.push(i);
    }
    for (let i in stateChecked) {
      stateList.push(i);
    }
    for (let i in cityChecked) {
      cityList.push(i);
    }
    filterData({
      'amenities': amenityList,
      'states': stateList,
      'cities': cityList
    });
  });
});
