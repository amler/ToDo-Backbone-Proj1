////////////////////////////////
// Model
////////////////////////////////

Todo = Backbone.Model.extend({

	defaults: {
		task: ''
	},

	idAttribute: '_id'

/*	initialize: function () {
                console.log(this.defaults.task);
            }*/
});

////////////////////////////////
// Collection
////////////////////////////////

TodoList = Backbone.Collection.extend({
	model: Todo,
	url: 'http://tiny-pizza-server.herokuapp.com/collections/scamler-tests'
});

////////////////////////////////
// Edit View
////////////////////////////////

TodoView = Backbone.View.extend({
	template: _.template($('.task-list-item').text()),
	editTemplate: _.template($('.task-edit-item').text()),
	//editTemplate: 
	events: {
		//'click .submit-task' : 'showSubmit'
		'click .edit-button' 	: 'showEdit',
		'click .save-button' 	: 'saveEdit',
		'click .delete-button'  : 'destroy',
	},
 
	initialize: function() {
		// yo view! pay attention to these models any changes to the model will call method render
		this.listenTo(this.model, 'change' , this.render),
		// empty div to render template this.el
		$('.container').prepend(this.el);
		// call to the View's render method
		this.render();
	},

	render: function() {
	// variable for rendering template  // template  //passing the model and default prop
	    var renderedTemplate = this.template(this.model.attributes)
    // empty div // html render the variable above
	    this.$el.html(renderedTemplate);
	},

	showEdit: function() {
		var renderedTemplate = this.editTemplate(this.model.attributes)
		this.$el.html(renderedTemplate);
	},

	saveEdit: function() {
		// find search through the descendants of these elements in the DOM tree and construct a new jQuery object from the matching elements.
		// finding the value within the div rendered to extract the value
		var taskvalue = this.$el.find('.task-item input').val();
		// a "change" event will be triggered on the model selected
		this.model.set('task', taskvalue);
		// saves the model to the database
		this.model.save()
	},

	destroy: function(){
		//Destroys the model on the server by delegating an HTTP DELETE request to Backbone.sync.
		this.model.destroy();
		// takes element out of the DOM
		this.remove();
	}

});

////////////////////////////////
// Edit View
////////////////////////////////

AddTodo = Backbone.View.extend({

	addTaskTemplate: _.template($('.task-list-add-item').text()),
	//editTemplate: 
	events: {
		'click .submit-task' : 'saveNewTodo'
	},
 
	initialize: function() {
		// yo view! pay attention to these models any changes to the model will call method render
		this.listenTo(this.model, 'change' , this.render),
		// empty div to render template this.el
		$('.input-container').prepend(this.el);
		// call to the View's render method
		this.render();
	},

	render: function() {
	// variable for rendering template  // template  //passing the model and default prop
	    var renderedTemplate = this.template(this.model.attributes)
    // empty div // html render the variable above
	    this.$el.html(renderedTemplate);
	},

	saveNewTodo: function() {
		// find search through the descendants of these elements in the DOM tree and construct a new jQuery object from the matching elements.
		// finding the value within the div rendered to extract the value
		var taskvalue = this.$el.find('.todo-list-item input').val();
		// a "change" event will be triggered on the model selected
		this.model.set('task', taskvalue);
		// saves the model to the database
		this.model.save()
	},

});

/*
collection
I'm not creating the list above like in the console
list.add({name: 'heather'});
list.first().save();
*/
////////////////////////////////
// Create instances
////////////////////////////////

// new collection
var list = new TodoList();
//
list.fetch().done(function(){
	list.each(function (task){
		new TodoView({model: task});
	});
});
// nope
var view = new AddTodo();

