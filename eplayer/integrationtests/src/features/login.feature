Feature:
    In order to keep my product stable
    As a developer or product manager
    I want to make sure that everything works as expected

Background:
    Given I open the site "/eplayer"
    Then I expect that element ".auth-form.ng-scope" becomes visible

Scenario: Availability of Lables, Links & Buttons on Login page
    Then I expect that element "label*=Username" becomes visible
    Then I expect that element "label*=Password" becomes visible
    Then I expect that element "#help-in-form.pe-icon--btn.toggle-help-icon.ng-scope" does exist
    Then I expect that element ".logo" becomes visible
    Then I expect that element "a#forgotUsernameOrPasswordLink.ng-binding" becomes visible
    Then I expect that element "button*=Create" becomes visible
    Then I expect that element ".copyright" becomes visible

Scenario: Should be able to access Help link from Footer
    When I click on the element "#supportLink"
    Then I expect that element "#o-contextual-help-drawer" becomes visible
    And I pause for 1000ms
    Then I click on the element ".pe-icon--btn.close-help"

Scenario Outline: Should be able to access footer links
    When I click on the element "<LinkName>"
    And I focus the last opened tab
    Then I expect that element "<NewPage>" becomes visible
    And I pause for 1000ms
    Then I close the last opened tab
Examples:
| LinkName | NewPage |
| span*=Accessibility | .mar-bot--125 |
| span*=Privacy | h1*=Privacy |
| span*=Terms | h1*=Pearson |

Scenario: Should not let you log in with blank Username and password
    When I click on the button "#mainButton"
    Then I expect that element "div.ng-binding.ng-scope" becomes visible

Scenario Outline: Failed Login for incorrect username or password
    When I set "<username1>" to the inputfield "#username"
    And I set "<password1>" to the inputfield "#password"
    And I click on the button "#mainButton"
    Then I expect that element ".panel-title.pe-form--error.ng-binding" becomes visible
Examples:
| username1 | password1 |
| et1_qaautomation_edu1 |  Pa55word111 |
| xxxxxx |  Pa55word@123 |

Scenario: Should let you log in with correct Username and correct Password
    When I set "et1_qaautomation_edu1" to the inputfield "#username"
    Then I expect that element "#username" contains the text "et1_qaautomation_edu1"
    When I set "Pa55word@123" to the inputfield "#password"
    And I click on the button "#mainButton"
    Then I expect that element "#bookshelf" becomes visible
