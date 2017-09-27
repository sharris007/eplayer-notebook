import { fetch, storeBookDetails, storeSsoKey, getAuthToken, gotAuthToken } from '../../../src/routes/Bookshelf/modules/bookshelfActions';
    
describe("Bookshelf (Action Creators)", function(){

	it("fetch() Should be a function", function(){
		expect(fetch).to.be.a('function')
	})

	it("fetch() Should return an action with type BOOKS",function(){
		let urn = "https://stpaperapiqa.stg-prsn.com/etext/v2/courseboot/web/compositeBookShelf";
		let piToken = "getuserbookshelf";
		expect(fetch(urn, piToken)).to.have.property('type', 'BOOKS')
	})

	it("fetch() Should return an action with payload",function(){
		let urn = "https://stpaperapiqa.stg-prsn.com/etext/v2/courseboot/web/compositeBookShelf";
		let piToken = "getuserbookshelf";
		expect(fetch(urn, piToken)).to.have.property('payload');
	})

	it("storeBookDetails() should be a function",function(){
		expect(storeBookDetails).to.be.a('function');
	})

	it("storeBookDetails() Should return an action with type BOOK_DETAILS ",function(){
		let book = {}
		expect(storeBookDetails(book)).to.have.property('type', 'BOOK_DETAILS');
	})

	it("storeBookDetails() Should initialize properties with book argument ",function(){
		let book = {
			author : "Buckley/Miller/Padilla/Thornton/Wysession",
			image : "https://view.cert2.ebookplus.pearsoncmg.com/ebookassets/ebookCM37953429/assets/flaL_eBook_thumbnail.png",
			title : "DEV: Florida Interactive Science: Life Science - DEV Title",
			globalBookId : "CM37953429",
			globalUserId : "10315477",
			bookeditionid:"61739",
			updfUrl : "NA",
			bookServerUrl:"https://view.cert2.ebookplus.pearsoncmg.com",
			bookId : '',
			userInfoLastModifiedDate:"20170330144137",
			userBookLastModifiedDate:"20170828090341",
			userBookScenarioLastModifiedDate:"20170914025449",
			roleTypeID : "3"

		}
		expect(storeBookDetails(book)).to.have.property('authorName', book.author);
		expect(storeBookDetails(book)).to.have.property('thumbnail', book.image);
		expect(storeBookDetails(book)).to.have.property('title', book.title);
		expect(storeBookDetails(book)).to.have.property('globalBookId', book.globalBookId);
		expect(storeBookDetails(book)).to.have.property('globalUserId', book.globalUserId);
		expect(storeBookDetails(book)).to.have.property('bookeditionid', book.bookeditionid);
		expect(storeBookDetails(book)).to.have.property('uPdf', book.updfUrl);
		expect(storeBookDetails(book)).to.have.property('serverDetails', book.bookServerUrl);
		expect(storeBookDetails(book)).to.have.property('bookId', book.bookId);
		expect(storeBookDetails(book)).to.have.property('uid', book.userInfoLastModifiedDate);
		expect(storeBookDetails(book)).to.have.property('ubd', book.userBookLastModifiedDate);
		expect(storeBookDetails(book)).to.have.property('ubsd', book.userBookScenarioLastModifiedDate);
		expect(storeBookDetails(book)).to.have.property('roleTypeID', book.roleTypeID);
	})

	it("storeSsoKey() should be a function", function(){
		expect(storeSsoKey).to.be.a('function')
	})

	it("storeSsoKey() Should return an action with type SSO_KEY", function(){
		expect(storeSsoKey()).to.have.property('type','SSO_KEY');
	})

	it("storeSsoKey() Should return an action propertu ssoKey", function(){
		let ssoKey = '85053018374340868262017'
		expect(storeSsoKey(ssoKey)).to.have.property('ssoKey',ssoKey);
	})

	it("getAuthToken() Should be a function", function(){
		expect(getAuthToken).to.be.a('function');
	})

	it("getAuthToken() Should return an action with type AUTH", function(){
		expect(getAuthToken()).to.have.property('type','AUTH');
	})

	it("gotAuthToken() Should be a function", function(){
		expect(gotAuthToken).to.be.a('function');
	})

	it("gotAuthToken() Should return an action with type GOTAUTH", function(){
		expect(gotAuthToken()).to.have.property('type','GOTAUTH');
	})


	it("gotAuthToken() Should return an action with payload", function(){
		let payload =  { authFetched: {} }
		expect(gotAuthToken({})).to.have.deep.property('payload',payload);
	})

})