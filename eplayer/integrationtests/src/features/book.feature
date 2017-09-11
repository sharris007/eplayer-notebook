Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected

Scenario: Bookshelf should be visible
    Given I open the site "/eplayer"
    Then I expect that element ".auth-form.ng-scope" becomes visible 
    When I set "amit_qa_edu2" to the inputfield "#username"
    Then I expect that element "#username" contains the text "amit_qa_edu2"
    When I set "Pa55word" to the inputfield "#password"
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

Scenario: Should click on TOC
    When I click on the element ".icon-white:nth-child(2)"
    And I click on the element "#contents"
    Then I expect that element ".bookTitleAndTabs" becomes visible
    And I expect that element ".list-group" becomes visible
    When I click on the element ".drawerWrap"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible

Scenario: Should remove the Bookmark from drawer component
    When I create a new bookmark
    Then I expect that element ".filled" becomes visible
    When I click on the element ".icon-white:nth-child(2)"
    And I click on the button "#bookmarks"
    And I move to element ".o-bookmark-date" with an offset of 0,0
    Then I expect that element ".remove" becomes visible
    When I click on the element ".remove"
    Then I expect that element ".deleteBtn" becomes visible
    When I click on the element ".deleteBtn"
    And I click on the element ".drawerWrap"
    Then I expect that element ".unfilled" becomes visible

Scenario: Should create an annotation
    When I select the text area of element "div[id=docViewer_ViewContainer_PageContainer_0]>img"
    Then I expect that element "#highlight-note-form" becomes visible
    When I click on the element "#color-button-yellow"
    Then I expect that element ".annotator-panel-2" becomes visible
    When I set "automation" to the inputfield "#note-text-area"
    And I pause for 3000ms
    Then I wait on element "#save-annotation" for 20000ms to be enabled
    When I click on the element "#save-annotation"
    Then I expect that element ".annotator-handle" becomes visible

Scenario: should check the note created inside drawer component
    When I click on the element ".icon-white:nth-child(2)"
    Then I expect that element ".bookTitleAndTabs" becomes visible
    When I click on the element "#notes"
    Then I expect that element "p*=automation" becomes visible
    When I click on the element ".drawerWrap"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible

Scenario: should delete note from UI
    When I click on the element ".annotator-handle"
    Then I expect that element "#deleteIcon" becomes visible
    When I click on the element "#deleteIcon"
    Then I expect that element "#ann-confirm-del" becomes visible
    When I click on the element "#ann-confirm-del" 
    Then I expect that element ".annotator-handle" becomes not visible
    When I click on the element ".icon-white:nth-child(2)"
    And I click on the element "#notes"
    Then I expect that element "p=*automation" is not visible
    When I click on the element ".drawerWrap"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible

Scenario: should click next page
    When I click on the element ".nextSection.section"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible 

Scenario: should click previous page
    When I click on the element ".prevSection.section"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible   

Scenario: should filter search text and give the result
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    And I expect that element ".search__no-results" is visible
    When I set "school" to the inputfield "#search__input"
    Then I expect that element "div[class=search__results]>ul>ul>li:nth-child(2)" becomes visible

Scenario: should check if Zoom button is clickable
    When I click on the element ".icon-white.prefIcon"
    Then I expect that element ".fontPane" becomes visible
    When I click on the element ".icon-white.prefIcon"
    Then I expect that element ".fontPane" becomes not visible

Scenario: should create a highlight
    When I select the text area of element "div[id=docViewer_ViewContainer_PageContainer_0]>img"
    Then I expect that element "#highlight-note-form" becomes visible
    When I click on the element "#color-button-green"
    Then I expect that element ".fwr-highlight-annot" becomes visible

Scenario: should delete the highlight
    Given the element "#deleteIcon" is visible
    When I click on the element "#deleteIcon"
    Then I expect that element "#ann-confirm-del" becomes visible
    When I click on the element "#ann-confirm-del" 
    Then I expect that element ".fwr-highlight-annot" becomes not visible

Scenario: should refresh the book
    When I refresh the browser window
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible 

Scenario: should click on back button to go bookshelf
    When I click on the element ".back_rec"
    Then I expect that element "#bookshelf" becomes visible
    When I click on the button "p*=Audio_492_Simp_Automation"
    Then I expect that element "#docViewer_ViewContainer_AnnotCanvas" becomes visible 

Scenario: should be able to logout from Book
    When I click on the element ".moreIcon"
    Then I expect that element "div*=Sign Out" becomes visible
    When I click on the element "html>body>div>div>div>div>div>div>div>span>div>div"
    Then I expect that element "#username" becomes visible

