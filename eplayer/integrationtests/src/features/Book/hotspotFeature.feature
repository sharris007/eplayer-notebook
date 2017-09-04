Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected

Scenario: Bookshelf should be visible
    Given I open the site "/eplayer"
    Then I expect that element ".auth-form.ng-scope" becomes visible 
    When I set "et1_qaautomation_edu1" to the inputfield "#username"
    Then I expect that element "#username" contains the text "et1_qaautomation_edu1"
    When I set "Pa55word@123" to the inputfield "#password"
    And I click on the button "#mainButton"
    Then I expect that element "#bookshelf" becomes visible

Scenario: Should launch the book
    When I click on the button "p*=Audio_492_Simp_Automation"
    Then I expect that element "#docViewer_ViewContainer_AnnotCanvas" becomes visible 

Scenario: should navigate to the page number using search bar
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    When I set "305" to the inputfield "#search__input"
    Then I expect that element "span*=305" becomes visible
    When I click on the element "span*=305"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible

Scenario: Should add a Bookmark
    Given the element ".bookmarkIcon" is visible
    When I create a new bookmark
    Then I expect that element ".filled" becomes visible

Scenario: Should remove the Bookmark from header
    When I click on the element ".filled"
    Then I expect that element ".unfilled" becomes visible

Scenario: Should check mp3 audio icon hotspot
	When I click on the element "[name='eText MP3']"
	Then I expect that element ".aquila-audio-player" becomes visible
	When I click on the element ".play-pause"
	Then I expect that element ".progress-bar" becomes visible
    And I expect that element ".aquila-volume-control" becomes visible

Scenario: Check mp4 video icon hotspot
    When I click on the element "[name='eText H264']"
    Then I expect that element ".poster-play-icon" becomes visible
    When I click on the element ".poster-play-icon"
    Then I expect that element ".video-player" becomes visible
    When I press esc key
    Then I expect that element ".modal-content-area" becomes not visible


Scenario: Check image custom icon hotspot
    When I click on the element "[name='eText Image']"
    Then I expect that element ".preview-image" becomes visible
    When I click on the element ".preview-image"
    Then I expect that element ".inner.ril-inner.inner___1rfRQ.imgLightBox" becomes visible
    When I click on the element ".nav-btns.close-btn.outline-style"
    Then I expect that element ".inner.ril-inner.inner___1rfRQ.imgLightBox" becomes not visible

Scenario: Check eText url icon hotspot
    When I click on the element "[name='eText HTML']"
    Then I expect that element ".link-iframe" becomes visible
    When I press esc key
    Then I expect that element ".link-iframe" becomes not visible

Scenario: Check eText chromeless url custom icon hotspot
    When I click on the element "[name='eText Chromeless']"
    Then I expect that element ".link-iframe" becomes visible
    When I press esc key
    Then I expect that element ".link-iframe" becomes not visible

Scenario: Check eText PDF icon hotspot
    When I click on the element "[name='eText PDF']"
    And I focus the last opened tab
    Then I expect that the url is "https://media.pearsoncmg.com/ebookplus/testing/ebookBiologyCampbell/url/test.pdf"
    When I close the last opened tab
    Then I expect that the url is not "https://media.pearsoncmg.com/ebookplus/testing/ebookBiologyCampbell/url/test.pdf"

Scenario: Check cross reference custom icon hotspot
    When I click on the element "[name='eText Page Number']"
    Then I expect that element ".centerCircularBar" becomes visible
    And I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible

Scenario: should navigate back to the page number using search bar
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    When I set "305" to the inputfield "#search__input"
    Then I expect that element "span*=305" becomes visible
    When I click on the element "span*=305"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible
    And I expect that element "[name='eText Region MP3']" becomes visible

Scenario: Should check mp3 audio region hotspot
    When I click on the element "[name='eText Region MP3']"
    Then I expect that element ".aquila-audio-player" becomes visible
    When I click on the element ".play-pause"
    Then I expect that element ".progress-bar" becomes visible
    And I expect that element ".aquila-volume-control" becomes visible

Scenario: Check mp4 video region hotspot
    When I click on the element "[name='eText Region H264']"
    Then I expect that element ".poster-play-icon" becomes visible
    When I click on the element ".poster-play-icon"
    Then I expect that element ".video-player" becomes visible
    When I press esc key
    Then I expect that element ".modal-content-area" becomes not visible

Scenario: Check image region hotspot
    When I click on the element "[name='eText Region Image']"
    Then I expect that element ".preview-image" becomes visible
    When I click on the element ".preview-image"
    Then I expect that element ".inner.ril-inner.inner___1rfRQ.imgLightBox" becomes visible
    When I click on the element ".nav-btns.close-btn.outline-style"
    Then I expect that element ".inner.ril-inner.inner___1rfRQ.imgLightBox" becomes not visible

Scenario: Check eText url region hotspot
    When I click on the element "[name='eText Region URL']"
    Then I expect that element ".link-iframe" becomes visible
    When I press esc key
    Then I expect that element ".link-iframe" becomes not visible

Scenario: Check eText chromeless url region hotspot
    When I click on the element "[name='eText Region Chromeless']"
    Then I expect that element ".link-iframe" becomes visible
    When I press esc key
    Then I expect that element ".link-iframe" becomes not visible

Scenario: Check eText PDF icon hotspot
    When I click on the element "[name='eText Region PDF']"
    And I focus the last opened tab
    Then I expect that the url is "https://media.pearsoncmg.com/ebookplus/testing/ebookBiologyCampbell/url/test.pdf"
    When I close the last opened tab
    Then I expect that the url is not "https://media.pearsoncmg.com/ebookplus/testing/ebookBiologyCampbell/url/test.pdf"


Scenario: Check cross reference region hotspot
    When I click on the element "[name='eText Region Page Number']"
    Then I expect that element ".centerCircularBar" becomes visible
    And I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible

Scenario: should be able to logout from Book
    When I click on the element ".moreIcon"
    Then I expect that element "div*=Sign Out" becomes visible
    When I click on the element "#signOutButton"
    Then I expect that element "#username" becomes visible