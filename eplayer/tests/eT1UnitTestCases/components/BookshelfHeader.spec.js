import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import RaisedButton from 'material-ui/RaisedButton';
import Icon from '../../../src/components/Icon';
import BookshelfHeader from '../../../src/components/BookshelfHeader';

describe('Bookshelf Header', () => {
	let _component, _props;

	beforeEach(() => {
		_props = {
			firstName: 'et1qa_edu1',
  			lastName: 'et1qa_edu1',
  			messages: {
  				Welcome : 'Welcome'
  			}
		}
		_component = shallow(<BookshelfHeader {..._props}/>)
	});

	it('Should render as a div', () => {
		expect(_component.type()).to.equal('div')
	});

	it('Should have class name bookshelfHeader', () => {
		expect(_component.hasClass('bookshelfHeader')).to.equal(true)
	})

	it('Should render logo once', () => {
		expect(_component.find('.logo')).to.have.length(1)
	})

	it('Should render rightComp once', () => {
		expect(_component.find('.rightComp')).to.have.length(1)
	})

	it('Should render label once', () => {
		expect(_component.find('.label')).to.have.length(1)
	})

	it('Should conatain <span className="dropdown"><Icon name="dropdown-open-18" /></span>', () =>{
		expect(_component.contains(<span className="dropdown"><Icon name="dropdown-open-18" /></span>)).to.equal(true);
	})
	
	it('Should render signoutBtn once', () => {
		expect(_component.find('.signoutBtn')).to.have.length(1)
	})

	it('Should render RaisedButton once', () => {
		expect(_component.find(RaisedButton)).to.have.length(1)
	})

	it('Should render title once', () => {
		expect(_component.find('.title')).to.have.length(1)
	})

})