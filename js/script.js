$(document).ready(function() {
  var ApiKey = "30743f728290a89379008b370ac44151";
  var LinkFilm = "https://api.themoviedb.org/3/search/movie";

  $(document).on("click", ".cerca", function() {
    chiamataAjaxFilm(ApiKey, LinkFilm);


  })
});

// FUNZIONI DELLO SCRIPT

function chiamataAjaxFilm(ApiKey, LinkFilm) {
  var query = $(".input-ricerca").val();
  console.log("ricerca:" + query);
  $.ajax({
    url: LinkFilm,
    method: 'GET',
    data: {
      api_key: ApiKey,
      language: "it-IT",
      query: query,
    },
    success: function(data) {
      var risultatiFilm = data.results;
      console.log("risultati" + risultatiFilm)
      stampaFilm(risultatiFilm);
    },
    error: function(richiesta, stato, errori) {
      console.log(errori);
    }
  });
}

function stampaFilm(risultatiFilm){
  var source = $("#film").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < risultatiFilm.length; i++) {
    var filmSingolo = risultatiFilm[i];
    var context = {
      "title": filmSingolo.title,
      "original_title": filmSingolo.original_title,
      "original_language": filmSingolo.original_language,
      "vote_average": filmSingolo.vote_average
    };
    var html = template(context);
    $(".film").append(html);
  }
}
