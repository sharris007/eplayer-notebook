Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected

Scenario: Bookshelf should be visible
    Then I expect that element "#bookshelf" becomes visible

Scenario: Should launch the book
    When I click on the button "p*=Audio_492_Simp_Automation"
    Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible

Scenario: Verify the availability of zoom icon [TC-ETEXT-3829_Zoom_01]
    Then I expect that element ".icon-white.prefIcon" becomes visible

Scenario: Should open the zoom slider panel [TC-ETEXT-3829_Zoom_02]
    When I click on the element ".icon-white.prefIcon"
    Then I expect that element ".preferenceDropdown" becomes visible


Scenario Outline: Verify the UI of zoom slider panel [TC-ETEXT-3829_Zoom_03]
    Then I expect that element "<slider_UI>" becomes visible
    Examples:
    | slider_UI |
    | .resizeFontsmall |
    | #numInput |
    | .resizeFontlarge |
    | .annotationToggle |

Scenario: Default zoom Level, Value 1 as 100% [TC-ETEXT-3829_Zoom_06]
    Then I expect that the attribute "value" from element "#numInput" is "1"

Scenario: Zoom panel closes when accessing any other component on the page [TC-ETEXT-3829_Zoom_05]
    When I click on the element ".nextContent"
    Then I expect that element ".preferenceDropdown" becomes not visible

Scenario: Move zoom slider using Arrow Key
    When I click on the element ".icon-white.prefIcon"
    And I press "ArrowRight"
    Then I expect that the attribute "value" from element "#numInput" is "1.1"
    When I press "ArrowLeft"
    Then I expect that the attribute "value" from element "#numInput" is "1"

Scenario: Zoom percentage should reset to 100% on re-launching the title [TC-ETEXT-3829_Zoom_29]
    When I press "ArrowRight"
    Then I expect that the attribute "value" from element "#numInput" is "1.1"
    When I click on the element ".pe-icon--chevron-back-18"
    Then I wait on element ".bookContainer" for 120000ms to be visible
    When I click on the button "p*=Audio_492_Simp_Automation"
    Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible
    When I click on the element ".icon-white.prefIcon"
    Then I expect that the attribute "value" from element "#numInput" is "1"

Scenario: Search feature should work fine after Zoom In/Out [TC-ETEXT-3829_Zoom_30, TC-ETEXT-3829_Zoom_31]
    When I press "ArrowRight"
    And I click on search icon ".icon-white.searchIcon" and in element "#search__input" set page as "A-A" and click on the searched term
    Then I expect that element "[name='Page A-A']" becomes visible
    When I click on the element ".icon-white.prefIcon"
    And I press "ArrowLeft"
    And I click on search icon ".icon-white.searchIcon" and in element "#search__input" set page as "A1" and click on the searched term
    Then I expect that element "[name='Page A1']" becomes visible

Scenario: Able to create highlights when page is Zoom In [TC-ETEXT-3829_Zoom_32]
    When I click on search icon ".icon-white.searchIcon" and in element "#search__input" set page as "A-A" and click on the searched term
    Then I expect that element "[name='Page A-A']" becomes visible
    When I click on the element ".icon-white.prefIcon"
    And I press "ArrowRight"
    Then I expect that the attribute "value" from element "#numInput" is "1.1"
    When I select the text area of element "div[id=docViewer_ViewContainer_PageContainer_0]>img"
    Then I wait on element ".annotator-panel-1.annotator-panel-triangle" for 120000ms to be visible
    When I click on the element "#color-button-green"
    And I pause for 3000ms
    When I click on the element ".drawerIcon.icon-white"
    Then I wait on element "#notes" for 1000ms to be visible
    And I click on the element "#notes"
    When I pause for 2000ms
    And I move to element ".note-link" with an offset of 0,0
    And I pause for 2000ms
    And I click on the element ".remove"
    And I click on the button ".deleteBtn"
    And I pause for 2000ms
    Then I expect that element ".empty-message" becomes visible


Scenario: Able to create highlights when page is Zoom Out [TC-ETEXT-3829_Zoom_33]
    When I press esc key
    And I pause for 1000ms
    And I click on the element ".icon-white.prefIcon"
    And I press "ArrowLeft"
    Then I expect that the attribute "value" from element "#numInput" is "0.9"
    When I select the text area of element "div[id=docViewer_ViewContainer_PageContainer_0]>img"
    Then I wait on element ".annotator-panel-1.annotator-panel-triangle" for 120000ms to be visible
    When I click on the element "#color-button-pink"
    And I pause for 3000ms
    When I click on the element ".drawerIcon.icon-white"
    Then I wait on element "#notes" for 2000ms to be visible
    And I click on the element "#notes"
    When I pause for 2000ms
    And I move to element ".note-link" with an offset of 0,0
    And I pause for 3000ms
    And I click on the element ".remove"
    And I click on the button ".deleteBtn"
    And I pause for 2000ms
    Then I expect that element ".empty-message" becomes visible

Scenario: Able to create Private Note when page is Zoom In [TC-ETEXT-3829_Zoom_34, TC-ETEXT-3829_Zoom_40]
    When I press esc key
    And I pause for 1000ms
    And I click on the element ".icon-white.prefIcon"
    And I press "ArrowRight"
    Then I expect that the attribute "value" from element "#numInput" is "1.1"
    When I select the text area of element "div[id=docViewer_ViewContainer_PageContainer_0]>img"
    Then I wait on element ".annotator-panel-1.annotator-panel-triangle" for 120000ms to be visible
    When I click on the element "#color-button-yellow"
    And I pause for 3000ms
    And I set "ZoomInPrivateNote" to the inputfield "#note-text-area"
    And I pause for 2000ms
    And I click on the element "#save-annotation"
    And I pause for 2000ms
    When I click on the element ".drawerIcon.icon-white"
    Then I wait on element "#notes" for 2000ms to be visible
    And I click on the element "#notes"
    When I pause for 3000ms
    And I move to element ".note-link" with an offset of 0,0
    And I pause for 3000ms
    And I click on the element ".remove"
    And I click on the button ".deleteBtn"
    And I pause for 2000ms
    Then I expect that element ".empty-message" becomes visible

Scenario: Able to create Private Note when page is Zoom Out [TC-ETEXT-3829_Zoom_35, TC-ETEXT-3829_Zoom_41]
    When I press esc key
    And I pause for 1000ms
    And I click on the element ".icon-white.prefIcon"
    And I press "ArrowLeft"
    Then I expect that the attribute "value" from element "#numInput" is "0.9"
    When I select the text area of element "div[id=docViewer_ViewContainer_PageContainer_0]>img"
    Then I wait on element ".annotator-panel-1.annotator-panel-triangle" for 120000ms to be visible
    When I click on the element "#color-button-yellow"
    And I pause for 3000ms
    And I set "ZoomOutPrivateNote" to the inputfield "#note-text-area"
    And I pause for 2000ms
    And I click on the element "#save-annotation"
    And I pause for 2000ms
    When I click on the element ".drawerIcon.icon-white"
    Then I wait on element "#notes" for 2000ms to be visible
    And I click on the element "#notes"
    When I pause for 3000ms
    And I move to element ".note-link" with an offset of 0,0
    And I pause for 3000ms
    And I click on the element ".remove"
    And I click on the button ".deleteBtn"
    And I pause for 2000ms
    Then I expect that element ".empty-message" becomes visible

Scenario: Bookmark a page when page is Zoom In [TC-ETEXT-3829_Zoom_42]
    When I press esc key
    And I pause for 1000ms
    And I click on the element ".icon-white.prefIcon"
    And I press "ArrowRight"
    Then I expect that the attribute "value" from element "#numInput" is "1.1"
    When I click on the element ".bookmarkIcon"
    And I click on the element ".drawerIcon.icon-white"
    Then I wait on element "#bookmarks" for 2000ms to be visible
    And I click on the element "#bookmarks"
    Then I expect that element ".o-bookmark-empty-message" becomes not visible

Scenario: Un-Bookmark as page when page is Zoom In [TC-ETEXT-3829_Zoom_43]
    When I press esc key
    And I click on the element ".bookmarkIcon"
    And I click on the element ".drawerIcon.icon-white"
    Then I wait on element "#bookmarks" for 2000ms to be visible
    And I click on the element "#bookmarks"
    Then I expect that element ".o-bookmark-empty-message" becomes visible

Scenario: Bookmark a page when page is Zoom out [TC-ETEXT-3829_Zoom_44]
    When I press esc key
    And I pause for 1000ms
    And I click on the element ".icon-white.prefIcon"
    And I press "ArrowLeft"
    Then I expect that the attribute "value" from element "#numInput" is "0.9"
    When I click on the element ".bookmarkIcon"
    And I click on the element ".drawerIcon.icon-white"
    Then I wait on element "#bookmarks" for 2000ms to be visible
    And I click on the element "#bookmarks"
    Then I expect that element ".o-bookmark-empty-message" becomes not visible

Scenario: Un-Bookmark a page when page is Zoom out [TC-ETEXT-3829_Zoom_45]
    When I press esc key
    And I click on the element ".bookmarkIcon"
    And I click on the element ".drawerIcon.icon-white"
    Then I wait on element "#bookmarks" for 2000ms to be visible
    When I click on the element "#bookmarks"
    Then I expect that element ".o-bookmark-empty-message" becomes visible

Scenario: Zoom Slider Panel closes when clicking anywhere on the page [TC-ETEXT-3829_Zoom_49]
    When I press esc key
    And I pause for 1000ms
    And I click on the element ".icon-white.prefIcon"
    And I click on the element "[name='Page A-A']"
    And I press esc key
    Then I expect that element ".preferenceDropdown" becomes not visible

Scenario: Zoom Slider Panel closes when navigating to a different page [TC-ETEXT-3829_Zoom_49]
    When I click on the element ".icon-white.prefIcon"
    And I click on the element ".nextContent"
    Then I wait on element "[name='Page A1']" for 120000ms to be visible
    And I expect that element ".preferenceDropdown" becomes not visible

Scenario: Able to Sign-out when page is Zoom In [TC-ETEXT-3829_Zoom_46]
    When I click on the element ".icon-white.prefIcon"
    And I press "ArrowRight"
    Then I expect that the attribute "value" from element "#numInput" is "1.1"
    When I click on the element ".pe-icon--chevron-back-18"
    Then I wait on element ".signoutBtn>div>button" for 3000ms to be visible
    When I click on the element ".signoutBtn>div>button"
    Then I wait on element "#username" for 3000ms to be visible

Scenario: Able to Sign-out when page is Zoom Out [TC-ETEXT-3829_Zoom_47]
    When I set "et1_qaautomation_edu2" value in element "#username" and "Pa55word@123" value in element "#password" and click on "#mainButton" button
    Then I wait on element "#bookshelf" for 120000ms to be visible
    When I click on the button "p*=Audio_492_Simp_Automation"
    Then I wait on element "#docViewer_ViewContainer_PageContainer_0" for 120000ms to be visible
    When I click on the element ".icon-white.prefIcon"
    And I press "ArrowLeft"
    Then I expect that the attribute "value" from element "#numInput" is "0.9"
    When I click on the element ".pe-icon--chevron-back-18"
    Then I wait on element ".signoutBtn>div>button" for 3000ms to be visible
    When I click on the element ".signoutBtn>div>button"
    Then I wait on element "#username" for 3000ms to be visible
