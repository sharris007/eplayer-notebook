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

Scenario: should refresh the bookshelf
    When I refresh the browser window
    Then I expect that element ".bookshelf-body" becomes visible 

Scenario: should be able to logout from Bookshelf
    When I click on the element ".signoutBtn>div>button"
    Then I expect that element "#username" becomes visible
    
    
