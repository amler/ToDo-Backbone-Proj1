////////////////////////////////
// Model
////////////////////////////////

Todo = Backbone.Model.extend({

	defaults: {
		task: ''
	},

	idAttribute: '_id'
});

////////////////////////////////
// Collection
////////////////////////////////

TodoList = Backbone.Collection.extend({
	model: Todo,
	url: 'http://tiny-pizza-server.herokuapp.com/collections/Amler-ToDos'
});

////////////////////////////////
// Edit View
////////////////////////////////

TodoView = Backbone.View.extend({
	template: _.template($('.task-list-item').text()),
	//editTemplate: 
	editTemplate: _.template($('.task-edit-item').text()),
	
	className: "todo-item",

	events: {
		//'click .submit-task' : 'showSubmit'
		'click .edit-button' 	 : 'showEdit',
		'click .save-button' 	 : 'saveEdit',
		'click .delete-button'   : 'destroy',
		'click .completed-button': 'taskDone'
	},
	// only runs once - hence constant refreshing of browser to see new tasks added
	initialize: function() {
		// tells THIS view to pay attention to these models & any changes to the model will call render method
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
		// 
		var renderedTemplate = this.editTemplate(this.model.attributes)
		
		this.$el.html(renderedTemplate);
	},

	saveEdit: function() {
		// find search through the descendants of these elements in the DOM tree and construct a new jQuery object from the matching elements.
		// finding the value within the div rendered to extract the value
		var currentTask = this.model.attributes.task;
		var taskvalue = this.$el.find('.task-item input').val();
		if (taskvalue == currentTask) {
			this.render();
		} else {
			// a "change" event will be triggered on the model selected
			this.model.set('task', taskvalue);
			// saves the model to the database
			this.model.save()
		}
	},

	taskDone: function(){
		this.$el.find('.task-item').toggleClass('done');
	},

	destroy: function(){
		//Destroys the model on the server by delegating an HTTP DELETE request to Backbone.sync.
		this.model.destroy();
		// takes element out of the DOM
		this.remove();
	}
});

////////////////////////////////
// Add item View
////////////////////////////////

AddTodoView = Backbone.View.extend({

	initialize: function() {
		this.listenTo(list, 'add', function(task){
			new TodoView({model: task})
		})
	},
});

////////////////////////////////
// Create instances
////////////////////////////////

// variable for our collection
var list = new TodoList();

var makeItHappen = new AddTodoView();

//Fetch the default set of models for this collection from the server
list.fetch();

// long hand for document ready - page can't be manipulated safely until the document is "ready."
$(document).ready(function(){
	// on click of enter button
	$('.enter-task').click(function(){
		// assign input value to a variable (find element class name)
		var taskvalue = $('.todo-list-item').val();
		// variable for adding new model to the collection
		var newTodo = list.add({task: taskvalue})
		// saving that 
		newTodo.save()
		('.todo-list-item').val('');
	})
});


//////////////////////////////
// OLD Functions which led to creating a new view
//////////////////////////////
/*// MOVED INTO A NEW VIEW TO AVOID REFRESH
list.fetch().done(function(){
	list.each(function (task){
		new TodoView({model: task});
	});
});*/

/*
declare variable for a new collection
list.add({task: 'chore'});
list.first().save();
*/

 