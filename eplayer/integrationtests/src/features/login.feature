Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected

Background:
    Given I open the site "/eplayer"
    Then I expect that element ".auth-form.ng-scope" becomes visible 

Scenario: should not let you log in with correct Username and wrong password
    When I set "amit_qa_edu2" to the inputfield "#username"
    Then I expect that element "#username" contains the text "amit_qa_edu2"
    When I set "Pa55word111" to the inputfield "#password"
    And I click on the button "#mainButton"
    Then I expect that element ".panel-title.pe-form--error.ng-binding" becomes visible

Scenario: should not let you log in with blank Username and password
    When I set " " to the inputfield "#username"
    Then I expect that element "#username" contains the text " "
    When I set " " to the inputfield "#password"
    And I click on the button "#mainButton"
    Then I expect that element ".panel-title.pe-form--error.ng-binding" becomes visible

Scenario: should not let you log in with wrong Username and wrong password
    When I set "xxxxxxxx" to the inputfield "#username"
    Then I expect that element "#username" contains the text "xxxxxxxx"
    When I set "Pa55wordss" to the inputfield "#password"
    And I click on the button "#mainButton"
    Then I expect that element ".panel-title.pe-form--error.ng-binding" becomes visible

Scenario: should let you log in with correct Username and correct Password
    When I set "et1_qaautomation_edu1" to the inputfield "#username"
    Then I expect that element "#username" contains the text "et1_qaautomation_edu1"
    When I set "Pa55word@123" to the inputfield "#password"
    And I click on the button "#mainButton"
    Then I expect that element "#bookshelf" becomes visible 