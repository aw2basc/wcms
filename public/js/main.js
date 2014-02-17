var WCMS = {};
WCMS.wrap = $('.page-wrap');

var PageModel = Backbone.Model.extend({
	urlRoot:"/pages",
	idAttribute: "_id",
	defaults: {
		"pageName" : "new",
		"pageUrl" : "new",
		"pageTags" : [{tagName:'header',tagValue:'header'},{tagName:'content',tagValue:'content'}]
	}
});

var PageCollection = Backbone.Collection.extend({
	url:"/pages",
	model: PageModel
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
		this.tagsTemplate = _.template(WCMS.mainModel.get('tags'));
		
		this.tags = '';
	},
	events: {
		"click .page-save": "save"
	},
	render:function(){
		WCMS.pagesContainer.append(this.$el.html(
			this.template({
				pageName: this.model.get('pageName'),
				pageId: this.model.get('_id'),
				pageUrl: this.model.get('pageUrl'),
				pageDate: ''
			}) 
		));
		for(var i=0;i<this.model.attributes.pageTags.length;i++){
			this.$el.find('.tags-list').append(
				this.tagsTemplate({
					tagName: this.model.attributes.pageTags[i].tagName,
					tagValue: this.model.attributes.pageTags[i].tagValue
				})
			);
		}
	},
	save: function(e){
		e.preventDefault();
		for(var i=0;i<this.model.attributes.pageTags.length;i++){
			this.model.attributes.pageTags[i].tagName = _.escape($(this.$el.find('.tag-name')[i]).val());
			this.model.attributes.pageTags[i].tagValue = _.escape($(this.$el.find('.tag-value')[i]).val());
		}
		this.model.set({
			pageName:this.$el.find('.page-name').val(),
			pageUrl:this.$el.find('.page-url').val()
		});
		console.log(this.model);
		this.model.save();
	}
});


// site
var SiteModel = Backbone.Model.extend({
	urlRoot:"/sites",
	idAttribute: "_id"
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


// main
var MainModel = Backbone.Model.extend({
	urlRoot:"/main/templates"
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
		WCMS.siteModel.set({_id:"530176f4ec046f8773a77561"});
		WCMS.siteView = new SiteView({model:WCMS.siteModel});
		WCMS.siteModel.fetch();
	}
});

// router
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
