function log(exp) {
  console.log(exp);
}

var PhotoSearch = Backbone.View.extend({
  el: document.getElementById('results'),
  render: function( event ){
    var compiled_template = _.template( $("#results-template").html() );
    this.el.html( compiled_template(this.model.toJSON()) );
    return this; //recommended as this enables calls to be chained.
  },
  events: {
    "submit #searchForm": "search",
    "click .reset": "reset",
    "click .advanced": "switchContext"
  },
  search: function( event ){
  //executed when a form '#searchForm' has been submitted
  },
  reset: function( event ){
  //executed when an element with class "reset" has been clicked.
  },
  switchContext: function( event ){
  //executed when an element with class "advanced" has been clicked.
  }
});

var Photo = Backbone.Model.extend({

  defaults: {
    src: 'placeholder.jpg',
    title: 'an image placeholder',
    coordinates: [0,0]
  },

  validate: function(atts) {
    if (atts.title === undefined) {
      console.log('Title undefined.');
    }
  },

  initialize: function(){
    console.log('Photo created.');
    this.on("change:src", function(){
      var src = this.get("src");
      console.log('Image source updated to ' + src);
    });
    this.on('error', function(model, err) {
      console.log(err);
    })
    this.on('change:title', function() {
      var title = this.get('title')
      console.log('Title set:' + title)
    })
  },

  changeSrc: function( source ){
    this.set({ src: source });
  },

  setTitle: function( title ) {
    this.set({ title: title })
  }

});

var PhotoCollection = Backbone.Collection.extend({
  model: Photo,
  url: '/photos',
  initialize: function() {
    this.on('add', function(photo) {
      console.log('Photo added: ' + photo.get('title'));
    });
    this.on('change:src', function() {
      log('Collection changed.')
    });
  }
});

var myPhoto = new Photo({ title: "My awesome photo", src:"boston.jpg", location: "Boston", tags:['the big game', 'vacation'] })
var myAttributes = myPhoto.attributes;
log(myAttributes)
myPhoto.setTitle('Barney')

myCollection = new PhotoCollection()
myCollection.add(myPhoto)
var t = myCollection.getByCid('c0')
t.set({src:'goofer.gif'})
myCollection.add([{ title: "My awesome photo", src:"boston.jpg", location: "Boston", tags:['the big game', 'vacation'] },
  { title: "Dood", src:"boston.jpg", location: "Boston", tags:['the big game', 'vacation'] },
  { title: "My awesome photo", src:"boston.jpg", location: "Boston", tags:['the big game', 'vacation'] }])

myCollection.fetch()

//

var ourObject = {};
_.extend(ourObject, Backbone.Events);
ourObject.on("all", function(){
  console.log("Something was triggered.");
});
ourObject.on("dance", function(msg){
  console.log("We triggered " + msg);
});
ourObject.trigger("dance", "our event");

//

var GalleryRouter = Backbone.Router.extend({

  routes: {
    "about" : "showAbout",
    "photos/:id" : "getPhoto",
    "search/:query" : "searchPhotos",
    "search/:query/p:page" : "searchPhotos",
    "photos/:id/download/*imagePath" : "downloadPhoto",
    "*other" : "defaultRoute"
  },

  showAbout: function() {
  },

  getPhoto: function(id){
    console.log("You are trying to reach photo " + id);
  },

  searchPhotos: function(query, page) {
    var page_number = page || 1;
    console.log("Page number: " + page_number + " of the results for " + query);
  },

  downloadPhoto: function(id, path) {
  },

  defaultRoute: function(other) {
    console.log("Invalid. You attempted to reach:" + other);
  }

});

var myGalleryRouter = new GalleryRouter();
Backbone.history.start();