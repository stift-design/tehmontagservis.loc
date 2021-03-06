( function( $, _, Backbone, builderSettings, sectionData ) {

	var Model = Backbone.Model.extend( {
		defaults: function() {
			return _.extend( {}, sectionData.defaults.gallery, {
				id: _.uniqueId( 'gallery_' ),
			} );
		},

		initialize: function( attrs ) {
			this.items = attrs['gallery-items'];
			this.set( 'gallery-items', new Backbone.Collection(), { silent: true } );
		},
	} );

	var ItemModel = Backbone.Model.extend( {
		defaults: function() {
			return _.extend( {}, sectionData.defaults['gallery-item'], {
				id: _.uniqueId( 'gallery-item_' ),
			} );
		},
	} );

	var View = make.classes.SectionView.extend( {
		template: wp.template( 'ttfmake-section-gallery' ),

		events: _.extend( {}, make.classes.SectionView.prototype.events, {
			'click .ttfmake-section-configure': 'onConfigureSectionClick',
			'click .ttfmake-gallery-add-item-link': 'onAddItemClick',
		} ),

		initialize: function() {
			make.classes.SectionView.prototype.initialize.apply( this, arguments );
			this.itemViews = new Backbone.Collection();
		},

		afterRender: function() {
			make.classes.SectionView.prototype.afterRender.apply( this, arguments );

			this.listenTo( this.model, 'change:columns', this.onColumnCountChanged );
			this.listenTo( this.model.get( 'gallery-items' ), 'add', this.onItemModelAdded );
			this.listenTo( this.model.get( 'gallery-items' ), 'remove', this.onItemModelRemoved );
			this.listenTo( this.model.get( 'gallery-items' ), 'reset', this.onItemModelsSorted );
			this.listenTo( this.model.get( 'gallery-items' ), 'add remove change reset', this.onItemCollectionChanged );
			this.listenTo( this.itemViews, 'add', this.onItemViewAdded );
			this.listenTo( this.itemViews, 'remove', this.onItemViewRemoved );
			this.listenTo( this.itemViews, 'reset', this.onItemViewsSorted );

			var items = this.model.items || _.times( 3, _.constant( sectionData.defaults['gallery-item'] ) );
			var itemCollection = this.model.get( 'gallery-items' );

			_.each( items, function( itemAttrs ) {
				var itemModel = make.factory.model( itemAttrs );
				itemModel.parentModel = this.model;
				itemCollection.add( itemModel );
			}, this );

			this.initSortables();
			this.on( 'sort-start', this.onItemSortStart, this );
			this.on( 'sort-stop', this.onItemSortStop, this );
		},

		onColumnCountChanged: function( itemModel ) {
			var newColumnCount = this.model.get( 'columns' );
			var $stage = $( '.ttfmake-gallery-items-stage', this.$el );

			$stage.removeClass( function( i, className ) {
				return className.match( /ttfmake-gallery-columns-[0-9]/g || [] ).join( ' ' );
			});

			$stage.addClass( 'ttfmake-gallery-columns-' + newColumnCount );
		},

		onItemModelAdded: function( itemModel, itemCollection, options ) {
			var itemView = make.factory.view( { model: itemModel } );

			if ( itemView ) {
				var itemIndex = itemCollection.indexOf( itemModel );
				var itemViewModel = new Backbone.Model( { id: itemModel.id, view: itemView } );
				this.itemViews.add( itemViewModel, _.extend( options, { at: itemIndex } ) );
			}
		},

		onItemModelRemoved: function( itemModel ) {
			var itemViewModel = this.itemViews.get( itemModel.id );
			this.itemViews.remove( itemViewModel );
		},

		onItemModelsSorted: function( itemCollection ) {
			this.itemViews.reset( _.map( itemCollection.pluck( 'id' ), function( id ) {
				return this.itemViews.get( id );
			}, this ) );
		},

		onItemCollectionChanged: function() {
			this.model.trigger( 'change' );
		},

		onItemViewAdded: function( itemViewModel, itemViewCollection, options ) {
			var itemViewIndex = this.itemViews.indexOf( itemViewModel );
			var $itemViewEl = itemViewModel.get( 'view' ).render().$el;

			if ( 0 === itemViewIndex ) {
				$( '.ttfmake-gallery-items-stage', this.$el ).prepend( $itemViewEl );
			} else {
				var previousItemViewModel = this.itemViews.at( itemViewIndex - 1 );
				previousItemViewModel.get( 'view' ).$el.after( $itemViewEl );
			}

			itemViewModel.get( 'view' ).trigger( 'rendered' );

			if ( options.scroll ) {
				window.make.builder.scrollToView( itemViewModel.get( 'view' ) );
			}
		},

		onItemViewRemoved: function( itemViewModel ) {
			itemViewModel.get( 'view' ).$el.animate( {
				opacity: 'toggle',
				height: 'toggle'
			}, builderSettings.closeSpeed, function() {
				itemViewModel.get( 'view' ).remove();
			} );
		},

		onItemViewsSorted: function( itemViewCollection ) {
			var $stage = $( '.ttfmake-gallery-items-stage', this.$el );

			itemViewCollection.forEach( function( itemViewModel ) {
				var $itemViewEl = itemViewModel.get( 'view' ).$el;
				$itemViewEl.detach();
				$stage.append( $itemViewEl );
			}, this );
		},

		initSortables: function() {
			var $sortable = $( '.ttfmake-gallery-items-stage', this.$el );

			$sortable.sortable( {
				handle: '.ttfmake-sortable-handle',
				placeholder: 'sortable-placeholder',
				forcePlaceholderSizeType: true,
				distance: 2,
				tolerance: 'pointer',

				start: function ( e, ui ) {
					this.trigger( 'sort-start', e, ui );
				}.bind( this ),

				stop: function ( e, ui ) {
					this.trigger( 'sort-stop', e, ui );
				}.bind( this ),
			} );
		},

		onItemSortStart: function( e, ui ) {
			ui.placeholder.height( ui.item.height() - 2 );
		},

		onItemSortStop: function( e, ui ) {
			var $sortable = $( '.ttfmake-gallery-items-stage', this.$el );
			var ids = $sortable.sortable( 'toArray', { attribute: 'data-id' } );

			this.model.get( 'gallery-items' ).reset( _.map( ids, function( id ) {
				return this.model.get( 'gallery-items' ).get( id );
			}, this ) );
		},

		onAddItemClick: function( e ) {
			e.preventDefault();

			var itemModel = make.factory.model( sectionData.defaults['gallery-item'] );
			itemModel.parentModel = this.model;
			this.model.get( 'gallery-items' ).add( itemModel, { scroll: true } );
		},

		onConfigureSectionClick: function( e ) {
			e.preventDefault();

			var sectionType = this.model.get( 'section-type' );
			var sectionSettings = sectionData.settings[ sectionType ];

			if ( sectionSettings ) {
				window.make.overlay = new window.make.overlays.configuration( {
					model: this.model,
					buttonLabel: 'Update gallery settings'
				}, sectionSettings );
				window.make.overlay.open();
			}
		},
	} );

	var ItemView = make.classes.SectionItemView.extend( {
		template: wp.template( 'ttfmake-section-gallery-item' ),

		events: _.extend( {}, make.classes.SectionItemView.prototype.events, {
			'click .ttfmake-gallery-item-remove': 'onRemoveItemClick',
			'click .ttfmake-gallery-item-configure': 'onConfigureItemClick',
			'click .edit-content-link': 'onEditItemContentClick',
			'click .ttfmake-media-uploader-placeholder': 'onUploaderSlideClick'
		} ),

		afterRender: function() {
			make.classes.SectionItemView.prototype.afterRender.apply( this, arguments );

			this.listenTo( this.model, 'change:background-image-url', this.onItemBackgroundChanged );
		},

		onRemoveItemClick: function( e ) {
			e.preventDefault();

			if ( ! confirm( 'Are you sure you want to trash this item permanently?' ) ) {
				return;
			}

			this.model.collection.remove( this.model );
		},

		onItemBackgroundChanged: function( itemModel ) {
			var $placeholder = $( '.ttfmake-media-uploader-placeholder', this.$el );
			var backgroundImageURL = itemModel.get( 'background-image-url' );

			$placeholder.css( 'background-image', 'url(' + backgroundImageURL + ')' );

			if ( '' !== backgroundImageURL ) {
				$placeholder.parent().addClass( 'ttfmake-has-image-set' );
			} else {
				$placeholder.parent().removeClass( 'ttfmake-has-image-set' );
			}
		},

		onEditItemContentClick: function( e ) {
			e.preventDefault();

			window.make.overlay = new window.make.overlays.content( {
				model: this.model,
				field: 'description',
				buttonLabel: 'Update item'
			} );
			window.make.overlay.open();

			var backgroundColor = this.model.parentModel.get( 'background-color' );

			if (backgroundColor) {
				window.make.overlay.setStyle( { backgroundColor: backgroundColor } );
			}
		},

		onUploaderSlideClick: function( e ) {
			e.preventDefault();

			window.make.media = new window.make.overlays.media( {
				model: this.model,
				field: 'background-image',
				type: 'image',
				title: $( e.target ).data( 'title' )
			} );

			window.make.media.open();
		},

		onConfigureItemClick: function( e ) {
			e.preventDefault();

			var sectionType = this.model.get( 'section-type' );
			var sectionSettings = sectionData.settings[ sectionType ];

			if ( sectionSettings ) {
				window.make.overlay = new window.make.overlays.configuration( {
					model: this.model,
					title: 'Configure item',
					buttonLabel: 'Update item',
				}, sectionSettings );
				window.make.overlay.open();
			}
		},

	} );

	make.factory.model = _.wrap( make.factory.model, function( func, attrs, BaseClass ) {
		switch ( attrs[ 'section-type' ] ) {
			case 'gallery': BaseClass = Model; break;
			case 'gallery-item': BaseClass = ItemModel; break;
		}

		return func( attrs, BaseClass );
	} );

	make.factory.view = _.wrap( make.factory.view, function( func, options, BaseClass ) {
		switch ( options.model.get( 'section-type' ) ) {
			case 'gallery': BaseClass = View; break;
			case 'gallery-item': BaseClass = ItemView; break;
		}

		return func( options, BaseClass );
	} );

} ) ( jQuery, _, Backbone, ttfmakeBuilderSettings, ttfMakeSections );
