$(document).ready(function() {
  var ApiKey = "30743f728290a89379008b370ac44151";
  var LinkFilm = "https://api.themoviedb.org/3/search/movie";
  var LinkSerieTv = "https://api.themoviedb.org/3/search/tv";

  $(document).on("click", ".cerca", function() {
    ricercaFilm(ApiKey, LinkFilm);
    ricercaSerieTv(ApiKey, LinkSerieTv);
  });

  $('.input-ricerca').keypress(
    function() {
      if (event.which == 13 || event.keyCode == 13) {
        ricercaFilm(ApiKey, LinkFilm);
        ricercaSerieTv(ApiKey, LinkSerieTv);
      }
    });

});

// FUNZIONI DELLO SCRIPT
function ricercaFilm(ApiKey, LinkFilm) {
  var query = $(".input-ricerca").val();

  if (query == 0) {
    alert("devi inserire una ricerca");
  } else {
    $(".film").html("");
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
        stampaFilm(risultatiFilm);
      },
      error: function(richiesta, stato, errori) {
        console.log(errori);
      }
    });

  }
}

function stampaFilm(risultatiFilm) {
  var source = $("#film").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < risultatiFilm.length; i++) {
    var filmSingolo = risultatiFilm[i];
    var context = {
      "poster_path": linkImgPoster(filmSingolo.poster_path),
      "title": filmSingolo.title,
      "original_title": filmSingolo.original_title,
      "original_language": flagLingua(filmSingolo.original_language),
      "vote_average": votoStelle(filmSingolo.vote_average),
    };
    var html = template(context);
    $(".film").append(html);
  }
}

//FUNZIONE PER RICERCA SERIE TV
function ricercaSerieTv(ApiKey, LinkSerieTv) {
  var query = $(".input-ricerca").val();

  if (query == 0) {

  } else {
    $(".serie_tv").html("");
    $.ajax({
      url: LinkSerieTv,
      method: 'GET',
      data: {
        api_key: ApiKey,
        language: "it-IT",
        query: query,
      },
      success: function(data) {
        var risultatiSerieTv = data.results;
        stampaSerieTv(risultatiSerieTv);
      },
      error: function(richiesta, stato, errori) {
        console.log(errori);
      }
    });
    $(".input-ricerca").val("");
  }
}

// FUNZIONE STAMPA SERIE TV
function stampaSerieTv(risultatiSerieTv) {
  var source = $("#serie_tv").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < risultatiSerieTv.length; i++) {
    var serieTvSingolo = risultatiSerieTv[i];
    var context = {
      "poster_path": linkImgPoster(serieTvSingolo.poster_path),
      "name": serieTvSingolo.name,
      "original_name": serieTvSingolo.original_name,
      "original_language": flagLingua(serieTvSingolo.original_language),
      "vote_average": votoStelle(serieTvSingolo.vote_average)
    };
    var html = template(context);
    $(".serie_tv").append(html);
  }
}

//FUNZIONE FLAG LINGUA
function flagLingua(lingua) {
  var Lingue = ["en", "bg", "zh", "it", "de", "fr", "el", "hi", "es", "ru"];
  bandiera = "";
  if (Lingue.includes(lingua)) {
    bandiera = '<img class="lingue" src="img/flag/' + lingua + '.svg">';
  } else {
    bandiera = lingua;
  }
  return bandiera;
}

function votoStelle(voto) {
  var votoModificato = Math.ceil((voto / 2));
  var stella = "";
  for (var i = 1; i <= 5; i++) {
    if (i <= votoModificato) {
      stella += '<i class="fas fa-star"></i>';
    } else {
      stella += '<i class="far fa-star"></i>';
    }
  }
  return stella
}

function linkImgPoster(path) {
  var LinkImg = "https://image.tmdb.org/t/p/";
  var DimensioneImg = "w342/";
  var linkPoster = "";
  if (path == null) {
    linkPoster = "img/nessunafoto.jpg"
  } else {
    linkPoster = LinkImg + DimensioneImg + path;
  }
  return linkPoster
}
