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

Scenario: Should click on TOC
    When I click on the element ".icon-white:nth-child(2)"
    And I click on the element "#contents"
    Then I expect that element ".bookTitleAndTabs" becomes visible
    And I expect that element ".list-group" becomes visible
    When I click on the element ".drawerWrap"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible

Scenario: should navigate to the page number using search bar
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    When I set "302" to the inputfield "#search__input"
    Then I expect that element "span*=302" becomes visible
    When I click on the element "span*=302"
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

Scenario: should filter search text and give the result
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element ".searchCompContainer" becomes visible
    And I expect that element ".search__no-results" is visible
    When I set "school" to the inputfield "#search__input"
    Then I expect that element "div[class=search__results]>ul>ul>li:nth-child(2)" becomes visible
    When I click on the element ".icon-white.searchIcon"
    Then I expect that element "div[class=search__results]>ul>ul>li:nth-child(2)" becomes not visible

Scenario: should create a highlight
    When I select the text area of element "div[id=docViewer_ViewContainer_PageContainer_0]>img"
    Then I expect that element "#highlight-note-form" becomes visible
    When I click on the element "#color-button-green"
    Then I expect that element ".fwr-highlight-annot" becomes visible

Scenario: should check if Zoom button is clickable
    When I click on the element ".icon-white.prefIcon"
    Then I expect that element ".fontPane" becomes visible
    When I click on the element ".icon-white.prefIcon"
    Then I expect that element ".fontPane" becomes not visible

Scenario: should delete the highlight
    When I click on the element ".fwr-highlight-annot"
    Then I expect that element "#deleteIcon" becomes visible
    When I click on the element "#deleteIcon"
    Then I expect that element ".fwr-highlight-annot" becomes not visible

Scenario: should click previous page
    When I click on the element ".prevSection.section"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible   

Scenario: should refresh the book
    When I refresh the browser window
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible 

Scenario: should click on back button to go bookshelf
    When I click on the element ".back_rec"
    Then I expect that element "#bookshelf" becomes visible
    When I click on the button "p*=Audio_492_Simp_Automation"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible 

Scenario: should be able to logout from Book
    When I click on the element ".moreIcon"
    Then I expect that element "div*=Sign Out" becomes visible
    When I click on the element "#signOutButton"
    Then I expect that element "#username" becomes visible

