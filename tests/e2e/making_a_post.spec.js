var chai = require('chai')
chai.use(require('chai-as-promised'))
var expect = chai.expect

describe('making a post',function(){
	it('logs in and creates a new post', function(){
		//go to homepage
		browser.get('http://localhost:3001')

		//click login
		element(by.css('nav .login')).click()
		//browser.pause()

		//fill out and submit login form
		element(by.model('username')).sendKeys('vishi18')
		element(by.model('password')).sendKeys('123')

		element(by.css('form .btn')).click()
		
		//submit a new post on the posts page
		var post = 'my new automated post using chai as promised' +Math.random()
		element(by.model('postBody')).sendKeys(post)
		element(by.css('form .btn')).click()

		// the user should now see their post as the first post on the page

		expect(element.all(by.css('ul.list-group li')).first().getText())
		.to.eventually.contain(post)
		// this is not passing the test as it checks for the one earlier post
		// need to look at the chai-as-promised documentation
		
	})
})