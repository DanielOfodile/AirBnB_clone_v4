let url = 'https://www.raymondlf266.online/api/v1/status/';
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
  $.get(url, {'Access-Control-Allow-Origin': '*'}, function (data, statusText, xhr) {
    if (statusText === 'success') {
      $('DIV#api_status').toggleClass('available');
    } else {
      $('DIV#api_status').toggleClass('available');
    }
  });
});
