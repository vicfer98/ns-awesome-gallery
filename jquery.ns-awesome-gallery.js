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
              '<div class="ns-gallery-full-photo" style="background-image: url('+ image.url +');">' +
                '<div class="ns-gallery-photo-info">' +
                  '<div class="ns-gallery-photo-name">'+ image.name +'</div>' +
                  '<div class="ns-gallery-photo-description">'+ image.description +'</div>' +
                '</div>' +
              '</div>' +
              '<div class="ns-gallery-photos-list">' +
                '<ul></ul>' +
              '</div>' +
            '</div>'
          );

          var photosList = template.find('.ns-gallery-photos-list ul'),
              fullPhotoImg = template.find('.ns-gallery-full-photo');

          $.each(_options.images, function(i, image){
            var photoTemplate = $(
              '<li class="ns-gallery-photo-thumbnail">' +
                '<img src="'+ image.url +'" alt="">' +
              '</li>'
            );

            photoTemplate.find('img').on('click', function(e){
              var self = $(this);

              $('#ns-gallery-previewer .ns-gallery-photo-thumbnail').removeClass('active');
              self.parent().addClass('active');
              fullPhotoImg.attr('style', 'background-image: url(' + image.url + ');');
            });

            photosList.append(photoTemplate);
          });

          template.find('img[src="'+ image.url +'"]').parent().addClass('active');

          $('body').append(template);
        },
        makePhoto = function(image){
          var template = $(
            '<div class="ns-gallery-photo" style="width: '+ columnWidth +'%">' +
              '<div class="ns-gallery-photo-image" style="background-image: url('+ image.url +');">' +
              '</div>' +
              '<div class="ns-gallery-photo-overlay">' +
                '<div class="ns-gallery-photo-name">' + (image.name || '') +'</div>' +
                '<div class="ns-gallery-photo-description">' + (image.description || '') +'</div>' +
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
        init = function(){
          console.log(_options);
          $(el).empty().append('<div class="ns-awesome-gallery"></div>');
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
      
      if (!$(this).data('nsAwesomeGallery')) {
        gallery = new NsAwesomeGallery(this, $.fn.nsAwesomeGallery.defaultOptions, opt);
        gallery.init();
        $(this).data('nsAwesomeGallery', gallery);
      }
    });
  };

  $.fn.nsAwesomeGallery.defaultOptions = {
    columns: 4,
    images: []
  };
  
}));