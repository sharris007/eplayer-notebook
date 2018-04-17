import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { shallow } from 'enzyme';
import { BookshelfComponent } from '@pearson-incubator/bookshelf';
import BookshelfPage from '../../../src/routes/Bookshelf/components/Bookshelf';
import BookshelfHeader from '../../../src/components/BookshelfHeader';
import { fetch, storeBookDetails, storeSsoKey } from '../../../src/routes/Bookshelf/modules/bookshelfActions';

function shallowRender (component) {
  	const renderer = new ShallowRenderer();
	renderer.render(component)
 	 return renderer.getRenderOutput()
}

function shallowRenderWithProps (props = {}) {
  	return shallowRender(<BookshelfPage {...props}/>)
}

function handleBookClick(bookId, type){

}

	describe(" Bookshelf ", function(){
		let _props;

		beforeEach(function(){

			_props = {
				bookshelf : {
					fetching : false,
					fetched : true
				},
				book : {},
				login : {},
				location : {
					query : {
						bookshelftype : ''
					}
				},
				fetch,
				storeBookDetails,
				storeSsoKey, 
			}
		})

		before(() => {
			global.piSession = {
				currentToken : () => {},
				getToken : () => {},
				login : () => {}
				}
			global.localStorage = {
				setItem : () => {},
				getItem : () => {}
			}
		})

		after(() => {
			delete global.piSession;
		})

		it('Should render as a <div>.', function () {
			let wrapper = shallow(<BookshelfPage {..._props}/>);
    		expect(wrapper.type()).to.equal('div')
  		})

  		it('Should have id "bookshelf-page"', function() {
  			let wrapper = shallow(<BookshelfPage {..._props}/>);
  			expect(wrapper).to.have.id('bookshelf-page')
  		})

  		it('Should have children component BookshelfHeader', () => {
  			let wrapper = shallow(<BookshelfPage {..._props}/>);
  			expect(wrapper.find(BookshelfHeader)).to.have.length(1)
  		})

  		it('Should have children component BookshelfComponent', () => {
  			let wrapper = shallow(<BookshelfPage {..._props}/>);
  			expect(wrapper.find(BookshelfComponent)).to.have.length(1)
  		})

	})