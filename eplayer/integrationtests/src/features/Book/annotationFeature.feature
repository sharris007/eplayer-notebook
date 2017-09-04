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

Scenario: should click next page
    When I click on the element ".nextSection.section"
    Then I expect that element "div[id=docViewer_ViewContainer_PageContainer_0]>img" becomes visible

Scenario: Should create an annotation
    When I pause for 10000ms
    And I select the text area of element "div[id=docViewer_ViewContainer_PageContainer_0]>img"
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

Scenario: should be able to logout from Book
    When I click on the element ".moreIcon"
    Then I expect that element "div*=Sign Out" becomes visible
    When I click on the element "#signOutButton"
    Then I expect that element "#username" becomes visible
