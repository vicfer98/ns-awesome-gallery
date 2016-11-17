;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    factory(jQuery);
  }
}(function ($) {
  'use strict';
  
  var NsAwesomeGallery = function(el, defaultOptions, options){
    var self,
        _options = $.extend(true, {}, defaultOptions, options),
        gallerySelector = '.ns-awesome-gallery',
        columnWidth = (100 / _options.columns).toFixed(2),
        addPhoto = function(url){

        },
        showPreviewer = function(image){
          var template = $(
            '<div id="ns-gallery-previewer">' +
              '<div class="ns-gallery-photo-cnt">' +
                '<div class="ns-gallery-full-photo">' +
                  '<div class="ns-gallery-arrows">' +
                    '<div class="ns-gallery-arrow-left">' +
                      '<span class="fa fa-chevron-circle-left"></span>' +
                    '</div>' +
                    '<div class="ns-gallery-arrow-right">' +
                      '<span class="fa fa-chevron-circle-right"></span>' +
                    '</div>' +
                  '</div>' +
                  '<img src="'+ image.file.url +'" alt="">' +
                '</div>' +
              '</div>' +
              '<div class="ns-gallery-photos-list">' +
                '<ul></ul>' +
              '</div>' +
              '<div class="ns-gallery-photo-action">' +
                '<button class="like-button">' +
                  '<img class="like-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsRDQkIkiQQ4QAAAMNJREFUOMvFk80KQUEYht+hsLCz4QrkAizEQm7g7CXiAiS5QT8XYeEajgXqOOSxmTINHUPJU7OYr96nb94a6d8Y9wKUJbUlFSRtjDF7O69I6ki6SFoZY45PJiACYh4cgD4wBE7OPAYiP9wAzjxztccnAeqSlLOOiV3bJ2+PT1HS2BXUvuiv6grWXwiWbgclYEc4W6DgF9kC0oBwAjRf7gSMAwSDzIcBi4zwLKgdYO4Fb8D0o4qBke0kfbt2hqQHdH/6G++mNkWiYvN0pAAAAABJRU5ErkJggg==" alt=""> ' + image.totalVotes +
                '</button>' +
              '</div>' +
              '<span id="ns-gallery-previewer-close" class="fa fa-close"></span>' +
            '</div>'
          );

          template.find('#ns-gallery-previewer-close').on('click', function(e){
            template.find('img').unbind('click');
            $(window).unbind('resize.ns-gallery-previewer');
            $(this).unbind('click');
            template.remove();
            init();
          });

          var photosList = template.find('.ns-gallery-photos-list ul'),
              fullPhotoImg = template.find('.ns-gallery-full-photo img'),
              mainCnt = template.find('.ns-gallery-photo-cnt'),
              likeButton = template.find('.like-button');

          likeButton.data('image_data', image);

          likeButton.on('click', function(e){
            var data = likeButton.data('image_data');
            var userId = getCookie('_zcvoteuserid_');

            $.ajax({
              method: 'POST',
              contentType: 'application/json',
              dataType: 'json',
              url: 'http://voteapi.zen.car/votes.json',
              data: JSON.stringify({photo_id: data.id, user_id: userId}),
              success: function (resp) {
                likeButton.html('<img class="like-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsRDQkIkiQQ4QAAAMNJREFUOMvFk80KQUEYht+hsLCz4QrkAizEQm7g7CXiAiS5QT8XYeEajgXqOOSxmTINHUPJU7OYr96nb94a6d8Y9wKUJbUlFSRtjDF7O69I6ki6SFoZY45PJiACYh4cgD4wBE7OPAYiP9wAzjxztccnAeqSlLOOiV3bJ2+PT1HS2BXUvuiv6grWXwiWbgclYEc4W6DgF9kC0oBwAjRf7gSMAwSDzIcBi4zwLKgdYO4Fb8D0o4qBke0kfbt2hqQHdH/6G++mNkWiYvN0pAAAAABJRU5ErkJggg==" alt=""> ' + resp.data.photo.totalVotes);
                var img = template.find('.ns-gallery-photos-list img[src="'+resp.data.photo.file.thumb_url+'"]');
                var imgData = img.data('image_data');
                imgData.totalVotes = resp.data.photo.totalVotes;
                img.data('image_data', imgData);
              },
              error: function(error){
                if (error.status == 422) {
                  alert('Вы уже голосовали за эту фотографию')
                }
              }
            });
          });

          $.each(_options.images, function(i, image){
            var photoTemplate = $(
              '<li class="ns-gallery-photo-thumbnail" data-index="'+ i +'">' +
                '<img src="'+ image.file.thumb_url +'" alt="" data-url="'+image.file.url+'">' +
              '</li>'
            );

            var img = photoTemplate.find('img');

            img.data('image_data', image);

            img.on('click', function(e){
              var self = $(this);

              likeButton.data('image_data', img.data('image_data'));

              $('#ns-gallery-previewer .ns-gallery-photo-thumbnail').removeClass('active');
              self.parent().addClass('active');
              fullPhotoImg.attr('src', image.file.url);
            });

            photosList.append(photoTemplate);
          });

          template.find('.ns-gallery-arrow-left').on('click', function(e){
            var index = template.find('.ns-gallery-photos-list .active').attr('data-index');

            if (index == 0) {
              index = _options.images.length - 1;
            } else {
              index = parseInt(index) - 1;
            }

            var _img = template.find('.ns-gallery-photo-thumbnail[data-index="'+index+'"]').find('img');
            _img.trigger('click');
            var data = _img.data('image_data');
            likeButton.data('image_data', data);
            likeButton.html('<img class="like-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsRDQkIkiQQ4QAAAMNJREFUOMvFk80KQUEYht+hsLCz4QrkAizEQm7g7CXiAiS5QT8XYeEajgXqOOSxmTINHUPJU7OYr96nb94a6d8Y9wKUJbUlFSRtjDF7O69I6ki6SFoZY45PJiACYh4cgD4wBE7OPAYiP9wAzjxztccnAeqSlLOOiV3bJ2+PT1HS2BXUvuiv6grWXwiWbgclYEc4W6DgF9kC0oBwAjRf7gSMAwSDzIcBi4zwLKgdYO4Fb8D0o4qBke0kfbt2hqQHdH/6G++mNkWiYvN0pAAAAABJRU5ErkJggg==" alt=""> ' + data.totalVotes);
          });

          template.find('.ns-gallery-arrow-right').on('click', function(e){
            var index = template.find('.ns-gallery-photos-list .active').attr('data-index');

            if (index == _options.images.length - 1) {
              index = 0;
            } else {
              index = parseInt(index) + 1;
            }

            var _img = template.find('.ns-gallery-photo-thumbnail[data-index="'+index+'"]').find('img');
            _img.trigger('click');
            var data = _img.data('image_data');
            likeButton.data('image_data', data);
            likeButton.html('<img class="like-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsRDQkIkiQQ4QAAAMNJREFUOMvFk80KQUEYht+hsLCz4QrkAizEQm7g7CXiAiS5QT8XYeEajgXqOOSxmTINHUPJU7OYr96nb94a6d8Y9wKUJbUlFSRtjDF7O69I6ki6SFoZY45PJiACYh4cgD4wBE7OPAYiP9wAzjxztccnAeqSlLOOiV3bJ2+PT1HS2BXUvuiv6grWXwiWbgclYEc4W6DgF9kC0oBwAjRf7gSMAwSDzIcBi4zwLKgdYO4Fb8D0o4qBke0kfbt2hqQHdH/6G++mNkWiYvN0pAAAAABJRU5ErkJggg==" alt=""> ' + data.totalVotes);
          });

          template.find('img[src="'+ image.file.thumb_url +'"]').parent().addClass('active');

          $('body').append(template);

          fullPhotoImg.css('max-height', mainCnt.height());

          $(window).on('resize.ns-gallery-previewer', function(){
            fullPhotoImg.css('max-height', mainCnt.height());
          });
        },
        makePhoto = function(image, i){
          var _image = image.file;
          var template = $(
            '<div class="ns-gallery-photo" style="width: '+ columnWidth +'%">' +
              '<div class="ns-gallery-photo-image" style="background-image: url('+ _image.thumb_url +');">' +
              '</div>' +
              '<div class="ns-gallery-photo-overlay">' +
                '<div class="ns-gallery-photo-likes">' +
                  '<img class="like-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsRDQkIkiQQ4QAAAMNJREFUOMvFk80KQUEYht+hsLCz4QrkAizEQm7g7CXiAiS5QT8XYeEajgXqOOSxmTINHUPJU7OYr96nb94a6d8Y9wKUJbUlFSRtjDF7O69I6ki6SFoZY45PJiACYh4cgD4wBE7OPAYiP9wAzjxztccnAeqSlLOOiV3bJ2+PT1HS2BXUvuiv6grWXwiWbgclYEc4W6DgF9kC0oBwAjRf7gSMAwSDzIcBi4zwLKgdYO4Fb8D0o4qBke0kfbt2hqQHdH/6G++mNkWiYvN0pAAAAABJRU5ErkJggg==" alt=""> ' + image.totalVotes +
                '</div>' +
              '</div>'
          );

          template.find('.ns-gallery-photo-overlay').on('click', function(e){
            showPreviewer(image);
          });

          return template;
        },
        renderPhotos = function(){
          var gallery = $(el).find(gallerySelector);

          $.each(_options.images, function(i, image){
            gallery.append(makePhoto(image));
          });
        },
        setCookie = function(name, value, days) {
          var expires;

          if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
          } else {
            expires = "";
          }
          document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        },

        getCookie = function(name) {
          var nameEQ = encodeURIComponent(name) + "=";
          var ca = document.cookie.split(';');
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
          }
          return null;
        },
        init = function(){
          $(el).empty().append('<div class="ns-awesome-gallery"></div>');
          var userId = getCookie('_zcvoteuserid_');

          if (userId == null) {
            setCookie('_zcvoteuserid_', 'user_' + Date.now());
          }

          renderPhotos();
        };

    self = {
      init: init
    };
    
    return self;
  };

  $.fn.nsAwesomeGallery = function (opt) {
    return this.each(function () {
      var gallery;
      var self = this;
      
      if (!$(this).data('nsAwesomeGallery')) {
        $.ajax({
          type: 'GET',
          url: "http://voteapi.zen.car/photos",
          success: function(resp){
            gallery = new NsAwesomeGallery(
              self,
              $.fn.nsAwesomeGallery.defaultOptions,
              $.extend(true, opt, {images: resp.data})
            );
            gallery.init();
            $(self).data('nsAwesomeGallery', gallery);
          },
          error: function() {

          }
        });

      }
    });
  };

  $.fn.nsAwesomeGallery.defaultOptions = {
    columns: 4,
    images: []
  };
  
}));