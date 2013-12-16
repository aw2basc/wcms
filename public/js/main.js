var WCMS = {};
WCMS.wrap = $('.page-wrap');

var PageModel = Backbone.Model.extend({
	urlRoot:"/pages",
	idAttribute: "_id",
	defaults: {
		"pageName" : "",
		"pageUrl" : ""
	}
});

var PageCollection = Backbone.Collection.extend({
	url:"/pages",
	model: PageModel
});

var SiteModel = Backbone.Model.extend({
	urlRoot:"/sites",
	idAttribute: "_id"
});

var MainModel = Backbone.Model.extend({
	urlRoot:"/main/templates"
});

var AddPageView = Backbone.View.extend({
	className:'add-page',
	initialize:function(){
		this.render();
	},
	events: {
		"click .add-page":"addPage"
	},
	addPage:function(){
		var pageModel = new PageModel();
		WCMS.pageCollection.add(pageModel);
		pageModel.save({},{
			success:function(m,r,o){
				var sitePages = WCMS.siteModel.get('sitePages');
				sitePages.push(r._id);
				WCMS.siteModel.set('sitePages',sitePages);
				WCMS.siteModel.save();
			}
		});
		var pageView = new PageView({model:pageModel});
	},
	render:function(){
		$('.add-page-container').html(this.$el.html('<a class="add-page" href="#">add page</a>'));
	}
});

var PageView = Backbone.View.extend({
	className:'page',
	initialize:function(){
		this.listenToOnce(this.model, 'change', this.render);
		this.template = _.template(WCMS.mainModel.get('pages'));
	},
	events: {
		"click .page-save": "save"
	},
	render:function(){
		WCMS.pagesContainer.append(this.$el.html(this.template({pageName: this.model.get('pageName')})));
	},
	save: function(e){
		e.preventDefault();
		this.model.set('pageName', this.$('.pageName').val());
		this.model.save();
		console.log(this.model.get('pageName'));
	}
});

var SiteView = Backbone.View.extend({
	className: 'site',
	initialize:function(){
		this.listenTo(this.model, 'change', this.render);
		this.template = _.template(WCMS.mainModel.get('site'));
	},
	render:function(){
		WCMS.siteContainer.html(this.$el.html(this.template(this.model.attributes)));

		WCMS.pageCollection = new PageCollection();
		_.each(this.model.get('sitePages'), function(e,i,l){
			var pageModel = new PageModel({_id:e});
			var pageView = new PageView({model:pageModel});
			WCMS.pageCollection.add(pageModel);
			pageModel.fetch();
		});

		WCMS.addPageView = new AddPageView();
	}
});

var MainView = Backbone.View.extend({
	initialize:function(){
		this.listenTo(this.model, 'change', this.render);
	},
	render:function(){
		WCMS.wrap.html(this.model.get('main'));
		WCMS.siteContainer = $('.site-container');
		WCMS.pagesContainer = $('.pages-container');

		WCMS.siteModel = new SiteModel();
		WCMS.siteModel.set({_id:"52ad17df936a7c0ea563be85"});
		WCMS.siteView = new SiteView({model:WCMS.siteModel});
		WCMS.siteModel.fetch();
	}
});

var AppRouter = Backbone.Router.extend({
	routes: {
		"":"main"
	},
	initialize:function(){
	},
	main:function(){
		WCMS.mainModel = new MainModel();
		var mainView = new MainView({model:WCMS.mainModel});
		WCMS.mainModel.fetch();
	}
});

var appRouter = new AppRouter();
Backbone.history.start();
