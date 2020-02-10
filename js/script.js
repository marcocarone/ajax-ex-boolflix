$(document).ready(function() {
  var ApiKey = "30743f728290a89379008b370ac44151";
  var LinkFilm = "https://api.themoviedb.org/3/search/movie";
  var LinkSerieTv = "https://api.themoviedb.org/3/search/tv";



  $(document).on("click", ".cerca", function() {

    ricercaFilmSerieTv(ApiKey, LinkFilm, LinkSerieTv, listaGeneriFilm, listaGeneriSerieTv);
  });

  $('.input-ricerca').keypress(
    function() {
      if (event.which == 13 || event.keyCode == 13) {

        ricercaFilmSerieTv(ApiKey, LinkFilm, LinkSerieTv, listaGeneriFilm, listaGeneriSerieTv);
      }
    });


  /////////////////////////// CLICK SU + INFO /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  $(document).on("click", ".bottone__info", function() {
    var questo = $(this).parent().parent().parent().parent().find(".modal__bg");
    $(this).parent().parent().parent().parent().find(".modal__bg").addClass("show");

    ////////////// RICERCA CAST FILM E SERIE TRAMITE ID  //////////////////////
    var numeroIdHtml = questo.attr('data-id');
    // console.log("data id: " + numeroIdHtml);
    $.ajax({
      url: "https://api.themoviedb.org/3/movie/" + numeroIdHtml + "/credits?api_key=30743f728290a89379008b370ac44151",
      method: 'GET',
      success: function(data) {
        var risultatoCast = data.cast;
        var dataid = data.id;
        if (dataid == numeroIdHtml) {
          var source = $("#cast").html();
          var template = Handlebars.compile(source);

          for (var e = 0; e < risultatoCast.length; e++) {
            var castSingolo = risultatoCast[e];

            var context = {
              "profile_path": linkImgPoster(castSingolo.profile_path),
              "namecast": castSingolo.name,
            };
            var html = template(context);
            questo.find(".cast_film").append(html);

          }
        }

      },
      error: function(richiesta, stato, errori) {
        console.log(errori);
      }
    });
    /////////////////////////////////////////////////////////////

  });
  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////


  /////////////// CHIUSURA FINESTRA MODALE INFO /////////////
  $(document).on("click", ".fa-times-circle", function() {
    $(this).parent().parent().removeClass("show");
  });
  ////////////////////////////////////////////////////////////


  ////CHIAMATA AJAX PER IDENTIFICARE I GENERI DEI FILM /////

  var listaGeneriFilm = [];
  // console.log(listaGeneriFilm);

  $.ajax({
    url: "https://api.themoviedb.org/3/genre/movie/list?api_key=30743f728290a89379008b370ac44151&language=it-IT",
    method: 'GET',
    success: function(data) {
      var generiFilm = data.genres;
      for (var i = 0; i < generiFilm.length; i++) {
        listaGeneriFilm.push(generiFilm[i]);
      }
    },
    error: function(richiesta, stato, errori) {
      console.log(errori);
    }
  });

  ///////////////////////////////////////////////////////////



  /////////////// SELETTORE FILTRO FILM /////////////////////////////

  $(document).on("change", "#selettore-film", function() {

    var genereScelto = $(this).val();
    if (genereScelto == "Tutti") {
      $(".main__container").find(".film__container").show();
    } else {
      $(".main__container").find(".film__container").each(function() {
        if ($(this).attr("data-genere").includes(genereScelto)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      })
    }
  })

  ///////////////////////////////////////////////////////////////

  ////CHIAMATA AJAX PER IDENTIFICARE I GENERI DELLE SERIE TV /////

  var listaGeneriSerieTv = [];
  // console.log(listaGeneriSerieTv);

  $.ajax({
    url: "https://api.themoviedb.org/3/genre/tv/list?api_key=30743f728290a89379008b370ac44151&language=it-IT",
    method: 'GET',
    success: function(data) {
      var generiSerieTv = data.genres;
      for (var i = 0; i < generiSerieTv.length; i++) {
        listaGeneriSerieTv.push(generiSerieTv[i]);
      }
    },
    error: function(richiesta, stato, errori) {
      console.log(errori);
    }
  });

  ///////////////////////////////////////////////////////////

  /////////////// SELETTORE FILTRO SERIE TV /////////////////////////////

  $(document).on("change", "#selettore-serie", function() {

    var genereSerieTvScelto = $(this).val();
    if (genereSerieTvScelto == "Tutti") {
      $(".main__container").find(".serietv__container").show();
    } else {
      $(".main__container").find(".serietv__container").each(function() {
        if ($(this).attr("data-genere").includes(genereSerieTvScelto)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      })
    }
  })

  ///////////////////////////////////////////////////////////////

  ////////////// HOME PAGE - POPOLARI /////////////////////////////
  ////////////////////////////////////////////////////////////////
  var numeroFilmPopolari = 10;
  var LinkPopolari = "https://api.themoviedb.org/3/movie/popular?api_key=30743f728290a89379008b370ac44151&language=it-IT&page=1";
  var appendPopolari = $(".film-popolari");
  ricercaFilmHome(listaGeneriFilm, numeroFilmPopolari, LinkPopolari, appendPopolari);
  ////////////////////////////////////////////////////////////////
  var LinkPiuVisti = "https://api.themoviedb.org/3/movie/top_rated?api_key=30743f728290a89379008b370ac44151&language=it-IT&page=2";
  var appendPiuVisti = $(".film-piu-votati");
  ricercaFilmHome(listaGeneriFilm, 6, LinkPiuVisti, appendPiuVisti);

  //////////////////////////////////////////////////////////////////////


});

////////////////  FUNZIONI DELLO SCRIPT  //////////////////////////
//////////////////////////////////////////////////////////////////


/////////////  FUNZIONE RICERCA FILM E SERIE TV //////////////////
function ricercaFilmSerieTv(ApiKey, LinkFilm, LinkSerieTv, listaGeneriFilm, listaGeneriSerieTv) {

  var query = $(".input-ricerca").val();
  if (query == 0) {
    Toastify({
      text: "Il campo è vuoto. Inserisci una query",
      duration: 3000,
      gravity: "bottom",
      position: 'right',
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();


  } else {
    $(".film").html("");
    $(".serie_tv").html("");
    $(".int-film__container").remove();
    $(".int-serie__container").remove();
    $(".film-popolari").remove();
    $(".film-piu-votati").remove();




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
        var totalePagineFilm = data.total_pages;

        if (data.total_results == 0) {

          Toastify({
            text: "Nessun film trovato",
            duration: 3000,
            gravity: "bottom",
            position: 'right',
            backgroundColor: "linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)",
          }).showToast();

        } else {

          stampaFilm(risultatiFilm, listaGeneriFilm);

          var source = $("#intestazioneFilm").html();
          var template = Handlebars.compile(source);
          var html = template();
          $(".intestazioneFilm").append(html);

          ///////////////////// POPOLO SELETTORE FILTRO FILM ////////////////////////////
          var listaNomiGeneriFilm = [];
          for (var cicloUno = 0; cicloUno < listaGeneriFilm.length; cicloUno++) {
            // console.log(listaGeneriFilm[cicloUno]);
            listaNomiGeneriFilm.push(listaGeneriFilm[cicloUno].name);
          }
          // console.log(listaNomiGeneriFilm);
          var listaSelettoreFilm;
          var source = $("#opzione_selettore").html();
          var template = Handlebars.compile(source);
          for (var cicloDue = 0; cicloDue < listaNomiGeneriFilm.length; cicloDue++) {

            listaSelettoreFilm = listaNomiGeneriFilm[cicloDue];

            var context = {
              "genere": listaSelettoreFilm,
            };
            var html = template(context);
            $("#selettore-film").append(html);
          }

          ////////////////////////////////////////////////////////////////////////


          /////////////////// FUNZIONE PAGINE SUCCESSIVA E PRECEDENTE ////////////


          $(".bottone__prev").hide()

          var dataPagina = $(".main__container").find(".film").attr("data-page");
          console.log( $(".main__container").find(".film").attr("data-page"))

          var numeroDataPagina = parseInt(dataPagina);
          console.log("numero data pagina: " + numeroDataPagina);



          // $(document).on("click", ".bottone__suc", function() {

          $( ".bottone__suc" ).click(function() {

          numeroDataPagina++
          console.log("num pagina prev: " + numeroDataPagina);


            $(".film").html("");

            $(".bottone__prev").show()


            if (numeroDataPagina <= totalePagineFilm) {
              chiamataAjaxPaginaPrecSuc(numeroDataPagina, query);
            } else {
              $(this).hide();
            }

            if (numeroDataPagina == totalePagineFilm) {
              $(this).hide();
            }

          });




          // $(document).on("click", ".bottone__prev", function() {
            $( ".bottone__prev" ).click(function() {
            numeroDataPagina--
            console.log("num pagina prev: " + numeroDataPagina);

            $(".film").html("");

            $(".bottone__suc").show()



            if (numeroDataPagina >= 1) {
              $(".film").html("");
              chiamataAjaxPaginaPrecSuc(numeroDataPagina, query);
            } else {
              $(this).hide();
            }

            if (numeroDataPagina == 1) {
              $(this).hide();
            }
          });



          function chiamataAjaxPaginaPrecSuc(pagina, query) {
            $.ajax({
              url: LinkFilm,
              method: 'GET',
              data: {
                api_key: ApiKey,
                language: "it-IT",
                query: query,
                page: pagina,
              },
              success: function(data) {
                var risultatiFilm = data.results;
                // var totalePagineFilm = data.total_pages;

                $(".film").html("");

                stampaFilm(risultatiFilm, listaGeneriFilm);

              },
              error: function(richiesta, stato, errori) {
                console.log(errori);
              }
            });
          }



          ///////////////////////////////////////////////////////////



        }
      },
      error: function(richiesta, stato, errori) {
        console.log(errori);
      }
    });


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
        if (data.total_results == 0) {

          Toastify({
            text: "Nessuna Serie TV trovata",
            duration: 3000,
            gravity: "bottom",
            position: 'right',
            backgroundColor: "linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)",
          }).showToast();

        } else {

          stampaSerieTv(risultatiSerieTv, listaGeneriSerieTv);

          var source = $("#intestazione-serie").html();
          var template = Handlebars.compile(source);
          var html = template();
          $(".intestazione-serie").append(html);

          ///////////////////// POPOLO SELETTORE FILTRO SERIE TV ////////////////////////////
          var listaNomiGeneriSerieTv = [];
          for (var cicloUno = 0; cicloUno < listaGeneriSerieTv.length; cicloUno++) {
            // console.log(listaGeneriSerieTv[cicloUno]);
            listaNomiGeneriSerieTv.push(listaGeneriSerieTv[cicloUno].name);
          }

          var listaSelettoreSerie;
          var source = $("#opzione_selettore__serie").html();
          var template = Handlebars.compile(source);
          for (var cicloDue = 0; cicloDue < listaNomiGeneriSerieTv.length; cicloDue++) {

            listaSelettoreSerie = listaNomiGeneriSerieTv[cicloDue];
            // console.log("lista" + listaNomiGeneriSerieTv[cicloDue]);

            var context = {
              "genere": listaSelettoreSerie,
            };

            var html = template(context);
            $("#selettore-serie").append(html);
          }

          ////////////////////////////////////////////////////////////////////////

        }

      },
      error: function(richiesta, stato, errori) {
        console.log(errori);
      }
    });
    $(".input-ricerca").val("");
  }
}
//////////////////////////////////////////////////////////////////

////////////////// FUNZIONE STAMPA FILM  /////////////////////////
function stampaFilm(risultatiFilm, listaGeneriFilm) {

  var source = $("#film").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < risultatiFilm.length; i++) {
    var filmSingolo = risultatiFilm[i];

    var descrizioneFilm = filmSingolo.overview;
    if (descrizioneFilm.length == 0) {
      descrizioneFilm = "Non è presente una descrizione del film"
    }

    var generiFilmSingolo = filmSingolo.genre_ids;

    var listaGeneriFilmSingolo = [];
    var genereFilmStampa = "";
    for (var n = 0; n < generiFilmSingolo.length; n++) {
      for (var j = 0; j < listaGeneriFilm.length; j++) {
        if (generiFilmSingolo[n] == listaGeneriFilm[j].id) {
          var genereFilm = listaGeneriFilm[j].name;
          listaGeneriFilmSingolo.push(genereFilm);
          genereFilmStampa += "<div class='genere'>" + genereFilm + "</div>"
        }
      }
    }

    var context = {
      "genereStampa": genereFilmStampa,
      "genere": listaGeneriFilmSingolo,
      "id": filmSingolo.id,
      "poster_path": linkImgPoster(filmSingolo.poster_path),
      "title": filmSingolo.title,
      "original_title": filmSingolo.original_title,
      "original_language": flagLingua(filmSingolo.original_language),
      "vote_average": votoStelle(filmSingolo.vote_average),
      "overview": descrizioneFilm,
    };

    var html = template(context);
    $(".film").append(html);

  }
}
//////////////////////////////////////////////////////////////////////


////////////////// FUNZIONE STAMPA SERIE TV  /////////////////////////
function stampaSerieTv(risultatiSerieTv, listaGeneriSerieTv) {
  var source = $("#serie_tv").html();
  var template = Handlebars.compile(source);
  for (var i = 0; i < risultatiSerieTv.length; i++) {
    var serieTvSingolo = risultatiSerieTv[i];

    var descrizioneSerieTv = serieTvSingolo.overview;
    if (descrizioneSerieTv.length == 0) {
      descrizioneSerieTv = "Non è presente una descrizione della serie TV"
    }

    var generiSerieTvSingolo = serieTvSingolo.genre_ids;
    var listaGeneriSerieTvSingolo = [];
    var genereSerieTvStampa = "";
    for (var n = 0; n < generiSerieTvSingolo.length; n++) {
      for (var j = 0; j < listaGeneriSerieTv.length; j++) {
        if (generiSerieTvSingolo[n] == listaGeneriSerieTv[j].id) {
          var genereSerieTv = listaGeneriSerieTv[j].name;
          listaGeneriSerieTvSingolo.push(genereSerieTv);
          genereSerieTvStampa += "<div class='genere'>" + genereSerieTv + "</div>"
        }
      }
    }
    var context = {
      "genereStampa": genereSerieTvStampa,
      "genere": listaGeneriSerieTvSingolo,
      "id": serieTvSingolo.id,
      "poster_path": linkImgPoster(serieTvSingolo.poster_path),
      "name": serieTvSingolo.name,
      "original_name": serieTvSingolo.original_name,
      "original_language": flagLingua(serieTvSingolo.original_language),
      "vote_average": votoStelle(serieTvSingolo.vote_average),
      "overview": descrizioneSerieTv,
    };
    var html = template(context);
    $(".serie_tv").append(html);
  }
}
/////////////////////////////////////////////////////////////////////////


/////////////////////// FUNZIONE FLAG LINGUA  ///////////////////////////
function flagLingua(lingua) {
  var Lingue = ["en", "bg", "zh", "it", "de", "fr", "el", "hi", "es", "ru", "ja", "th"];
  bandiera = "";
  if (Lingue.includes(lingua)) {
    bandiera = '<img class="lingue" src="img/flag/' + lingua + '.svg">';
  } else {
    bandiera = lingua;
  }
  return bandiera;
}
///////////////////////////////////////////////////////////////////////

///////////////////////// FUNZIONE VOTO STELLE ////////////////////////
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
////////////////////////////////////////////////////////////////////////

/////////////// FUNZIONE LINK DELL IMMAGINE POSTER ///////////////////
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
////////////////////////////////////////////////////////////////////////



/////////////  FUNZIONE RICERCA FILM E SERIE TV //////////////////
function ricercaFilmHome(listaGeneriFilm, numero, link, append) {

  $.ajax({
    url: link,
    method: 'GET',

    success: function(data) {
      var risultatiFilmPopolari = data.results;
      var source = $("#film").html();
      var template = Handlebars.compile(source);

      for (var i = 0; i < numero; i++) {
        var filmSingolo = risultatiFilmPopolari[i];

        var descrizioneFilm = filmSingolo.overview;
        if (descrizioneFilm.length == 0) {
          descrizioneFilm = "Non è presente una descrizione del film"
        }
        var generiFilmSingolo = filmSingolo.genre_ids;

        var listaGeneriFilmSingolo = [];
        var genereFilmStampa = "";
        for (var n = 0; n < generiFilmSingolo.length; n++) {
          for (var j = 0; j < listaGeneriFilm.length; j++) {
            if (generiFilmSingolo[n] == listaGeneriFilm[j].id) {
              var genereFilm = listaGeneriFilm[j].name;
              listaGeneriFilmSingolo.push(genereFilm);
              genereFilmStampa += "<div class='genere'>" + genereFilm + "</div>"
            }
          }
        }
        var context = {
          "genereStampa": genereFilmStampa,
          "genere": listaGeneriFilmSingolo,
          "id": filmSingolo.id,
          "poster_path": linkImgPoster(filmSingolo.poster_path),
          "title": filmSingolo.title,
          "original_title": filmSingolo.original_title,
          "original_language": flagLingua(filmSingolo.original_language),
          "vote_average": votoStelle(filmSingolo.vote_average),
          "overview": descrizioneFilm,
        };

        var html = template(context);
        append.append(html);

      }
    },
    error: function(richiesta, stato, errori) {
      console.log(errori);
    }
  });



}
